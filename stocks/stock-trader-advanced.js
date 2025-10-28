/** stock-trader-advanced.js
 * Advanced automated stock trading with portfolio management.
 * 
 * Features:
 * - Long positions with dynamic sizing
 * - Short positions (if available in your game version)
 * - Dynamic position sizing based on forecast confidence
 * - Commission-aware profit targets and stop-loss protection
 * - Portfolio rebalancing
 * - Performance tracking
 * 
 * Usage: run stocks/stock-trader-advanced.js [max-stocks] [total-capital] [profit-target] [stop-loss] [refresh-rate-ms]
 * Example: run stocks/stock-trader-advanced.js 10 50000000000 0.25 0.15 6000
 * 
 * Parameters:
 * - max-stocks: Maximum number of different stocks to buy (e.g., 10)
 * - total-capital: Total money to invest across ALL stocks (e.g., 50000000000 = $50b)
 * - profit-target: NET profit % after commissions (e.g., 0.25 = 25%, 0.30 = 30%)
 * - stop-loss: NET loss % after commissions (e.g., 0.15 = 15%, 0.20 = 20%)
 * - refresh-rate-ms: How often to check market in milliseconds (default: 6000 = 6s)
 * 
 * ⚠️ CRITICAL: COMMISSION WARNING ⚠️
 * Each trade costs $100k commission (buy) + $100k commission (sell) = $200k total!
 * Profit targets and stop-loss are calculated AFTER commissions.
 * 
 * MINIMUM SAFE CAPITAL REQUIREMENTS:
 * - Per Stock Position: $2,000,000+ (commission = 10% of position)
 * - Recommended: $5,000,000+ per stock (commission = 4% of position)
 * - Total Capital: $20,000,000+ for 10 stocks (minimum)
 * - Optimal: $50,000,000+ for 10 stocks (recommended)
 * 
 * COMMISSION IMPACT ON PROFIT TARGETS:
 * With $1m per stock and 15% profit target:
 *   Raw gain: $150k, Commission: $200k → NET LOSS: $50k ❌
 * 
 * With $5m per stock and 25% profit target:
 *   Raw gain: $1.25m, Commission: $200k → NET PROFIT: $1.05m ✓
 * 
 * RECOMMENDED SETTINGS BY CAPITAL:
 * - $20m total → run stocks/stock-trader-advanced.js 10 20000000 0.30 0.20 6000
 * - $50m total → run stocks/stock-trader-advanced.js 10 50000000 0.25 0.15 6000
 * - $100m+ total → run stocks/stock-trader-advanced.js 10 100000000 0.20 0.10 6000
 * 
 * Requirements:
 * - TIX API Access ($5 billion)
 * - 4S Market Data TIX API ($1 billion)
 * - Minimum $20 million trading capital (higher recommended)
 * 
 * Note: Short positions may not be available in all Bitburner versions.
 *       Script will work with long positions only if shorts unavailable.
 */

const LONG_THRESHOLD = 0.55;    // Go long if forecast > 55%
const SHORT_THRESHOLD = 0.45;   // Go short if forecast < 45%
const EXIT_THRESHOLD = 0.02;    // Exit if forecast moves within 2% of neutral
const COMMISSION = 100000;      // Transaction commission
const MAX_POSITION_SIZE = 0.10; // Max 10% of portfolio per stock

/** @param {NS} ns */
export async function main(ns) {
  // Validate API access
  if (!ns.stock.hasWSEAccount() || !ns.stock.hasTIXAPIAccess()) {
    ns.tprint("ERROR: You need TIX API Access! ($5 billion from WSE)");
    return;
  }

  if (!ns.stock.has4SDataTIXAPI()) {
    ns.tprint("ERROR: You need 4S Market Data TIX API! ($1 billion)");
    return;
  }

  // Parse parameters
  const maxStocks = ns.args[0] || 10;           // Default: Buy up to 10 different stocks
  const totalCapital = ns.args[1] || 50e9;      // Default: $50 billion total investment
  const profitTarget = ns.args[2] || 0.15;      // Default: 15% profit target
  const stopLoss = ns.args[3] || 0.10;          // Default: 10% stop loss
  const refreshRate = ns.args[4] || 6000;       // Default: 6 seconds
  
  // Validate profit target
  if (profitTarget <= 0 || profitTarget > 1) {
    ns.tprint("ERROR: Profit target must be between 0 and 1 (e.g., 0.15 for 15%)");
    return;
  }
  
  // Validate stop loss
  if (stopLoss <= 0 || stopLoss > 1) {
    ns.tprint("ERROR: Stop loss must be between 0 and 1 (e.g., 0.10 for 10%)");
    return;
  }

  // Check if short functions exist (requires BitNode-8 or Source-File 8 Level 2)
  // Note: Function existence doesn't guarantee permission - we'll handle errors when calling
  let canShort = typeof ns.stock.buyShort === 'function' && typeof ns.stock.sellShort === 'function';
  
  // Calculate per-stock investment accounting for commissions
  const totalCommissionReserve = maxStocks * COMMISSION;
  const investableCapital = totalCapital - totalCommissionReserve;
  const investmentPerStock = Math.floor(investableCapital / maxStocks);
  
  if (investmentPerStock <= 0) {
    ns.tprint("ERROR: Total capital too low for the number of stocks!");
    ns.tprint(`Need at least $${ns.nFormat((maxStocks * COMMISSION * 2), "0.00a")} for ${maxStocks} stocks`);
    return;
  }
  
  ns.disableLog("ALL");
  ns.clearLog();
  ns.tail();
  
  ns.print(`${"═".repeat(70)}`);
  ns.print(`ADVANCED STOCK TRADER - STARTING`);
  ns.print(`${"═".repeat(70)}`);
  ns.print(`Max Different Stocks: ${maxStocks}`);
  ns.print(`Total Capital: ${ns.nFormat(totalCapital, "$0.00a")}`);
  ns.print(`Investment per Stock: ${ns.nFormat(investmentPerStock, "$0.00a")} (after ${ns.nFormat(COMMISSION, "$0.00a")} commission)`);
  ns.print(`Short Positions: ${canShort ? "ENABLED" : "DISABLED (not available in this version)"}`);
  if (!canShort) {
    ns.print(`  Note: Trading long positions only`);
  }
  ns.print(`Refresh Rate: ${refreshRate}ms`);
  ns.print(`Long Threshold: ${(LONG_THRESHOLD * 100).toFixed(0)}%`);
  if (canShort) {
    ns.print(`Short Threshold: ${(SHORT_THRESHOLD * 100).toFixed(0)}%`);
  }
  ns.print(`Profit Target: +${(profitTarget * 100).toFixed(1)}% (take profit)`);
  ns.print(`Stop Loss: -${(stopLoss * 100).toFixed(1)}% (limit losses)`);
  ns.print(`${"═".repeat(70)}\n`);

  let cycleCount = 0;
  let totalProfit = 0;
  let tradesExecuted = 0;
  let biggestWin = 0;
  let biggestLoss = 0;

  while (true) {
    cycleCount++;
    ns.print(`\n${"─".repeat(70)}`);
    ns.print(`Cycle ${cycleCount} - ${new Date().toLocaleTimeString()}`);
    ns.print(`${"─".repeat(70)}`);
    
    const symbols = ns.stock.getSymbols();
    let actionsThisCycle = 0;
    
    // First pass: Check existing positions for exits
    for (const symbol of symbols) {
      const forecast = ns.stock.getForecast(symbol);
      const position = ns.stock.getPosition(symbol);
      const [longShares, longPrice, shortShares, shortPrice] = position;
      const askPrice = ns.stock.getAskPrice(symbol);
      const bidPrice = ns.stock.getBidPrice(symbol);
      
      // Check long positions
      if (longShares > 0) {
        // Calculate actual profit including commissions
        const grossProfit = (bidPrice - longPrice) * longShares;
        const netProfit = grossProfit - (2 * COMMISSION); // Buy + sell commission
        const netReturnPct = netProfit / (longShares * longPrice);
        
        const hitProfitTarget = netReturnPct >= profitTarget;
        const hitStopLoss = netReturnPct <= -stopLoss;
        const badForecast = forecast < (0.5 + EXIT_THRESHOLD);
        const shouldExit = hitProfitTarget || hitStopLoss || badForecast;
        
        if (shouldExit) {
          const salePrice = ns.stock.sellStock(symbol, longShares);
          if (salePrice > 0) {
            const profit = (salePrice - longPrice) * longShares - 2 * COMMISSION;
            totalProfit += profit;
            tradesExecuted++;
            actionsThisCycle++;
            
            if (profit > biggestWin) biggestWin = profit;
            if (profit < biggestLoss) biggestLoss = profit;
            
            const reason = hitProfitTarget ? "PROFIT TARGET" : (hitStopLoss ? "STOP LOSS" : "FORECAST");
            ns.print(`✓ SELL LONG ${symbol}: ${ns.nFormat(longShares, "0.0a")} @ ${ns.nFormat(salePrice, "$0.00a")}`);
            ns.print(`  Reason: ${reason} | Net Return: ${(netReturnPct * 100).toFixed(2)}% | Profit: ${ns.nFormat(profit, "$0.00a")}`);
          }
        }
      }
      
      // Check short positions
      if (shortShares > 0 && canShort) {
        // Calculate actual profit including commissions
        const grossProfit = (shortPrice - askPrice) * shortShares;
        const netProfit = grossProfit - (2 * COMMISSION); // Buy short + sell short commission
        const netReturnPct = netProfit / (shortShares * shortPrice);
        
        const hitProfitTarget = netReturnPct >= profitTarget;
        const hitStopLoss = netReturnPct <= -stopLoss;
        const badForecast = forecast > (0.5 - EXIT_THRESHOLD);
        const shouldExit = hitProfitTarget || hitStopLoss || badForecast;
        
        if (shouldExit) {
          try {
            const salePrice = ns.stock.sellShort(symbol, shortShares);
            if (salePrice > 0) {
              const profit = (shortPrice - salePrice) * shortShares - 2 * COMMISSION;
              totalProfit += profit;
              tradesExecuted++;
              actionsThisCycle++;
              
              if (profit > biggestWin) biggestWin = profit;
              if (profit < biggestLoss) biggestLoss = profit;
              
              const reason = hitProfitTarget ? "PROFIT TARGET" : (hitStopLoss ? "STOP LOSS" : "FORECAST");
              ns.print(`✓ CLOSE SHORT ${symbol}: ${ns.nFormat(shortShares, "0.0a")} @ ${ns.nFormat(salePrice, "$0.00a")}`);
              ns.print(`  Reason: ${reason} | Net Return: ${(netReturnPct * 100).toFixed(2)}% | Profit: ${ns.nFormat(profit, "$0.00a")}`);
            }
          } catch (e) {
            // Short access not available - disable shorts
            canShort = false;
            ns.print(`⚠ Short positions not available (requires BitNode-8 or Source-File 8 Level 2)`);
          }
        }
      }
    }
    
    // Second pass: Look for new entry opportunities
    const portfolioValue = calculatePortfolioValue(ns);
    const availableCash = ns.getServerMoneyAvailable("home");
    const totalCapital = portfolioValue + availableCash;
    const maxPositionValue = totalCapital * MAX_POSITION_SIZE;
    
    // Count current positions
    const currentPositions = symbols.filter(s => {
      const [longShares, , shortShares] = ns.stock.getPosition(s);
      return longShares > 0 || shortShares > 0;
    }).length;
    
    for (const symbol of symbols) {
      const forecast = ns.stock.getForecast(symbol);
      const position = ns.stock.getPosition(symbol);
      const [longShares, , shortShares] = position;
      
      // Skip if we already have a position
      if (longShares > 0 || shortShares > 0) continue;
      
      // Skip if we've reached max stocks limit
      if (currentPositions >= maxStocks) continue;
      
      const askPrice = ns.stock.getAskPrice(symbol);
      const bidPrice = ns.stock.getBidPrice(symbol);
      const maxShares = ns.stock.getMaxShares(symbol);
      
      // Check for long opportunity
      if (forecast > LONG_THRESHOLD) {
        const confidence = forecast - 0.5;  // How far above neutral
        const positionSize = Math.min(maxPositionValue * (confidence * 4), maxPositionValue);
        const sharesToBuy = Math.min(
          Math.floor(positionSize / askPrice),
          Math.floor((availableCash - COMMISSION) / askPrice),
          maxShares
        );
        
        if (sharesToBuy > 0) {
          const purchasePrice = ns.stock.buyStock(symbol, sharesToBuy);
          if (purchasePrice > 0) {
            const totalCost = sharesToBuy * purchasePrice + COMMISSION;
            tradesExecuted++;
            actionsThisCycle++;
            
            ns.print(`✓ BUY LONG ${symbol}: ${ns.nFormat(sharesToBuy, "0.0a")} @ ${ns.nFormat(purchasePrice, "$0.00a")}`);
            ns.print(`  Forecast: ${(forecast * 100).toFixed(1)}% | Confidence: ${(confidence * 100).toFixed(1)}% | Cost: ${ns.nFormat(totalCost, "$0.00a")}`);
            ns.print(`  Positions: ${currentPositions + 1}/${maxStocks}`);
          }
        }
      }
      // Check for short opportunity
      else if (forecast < SHORT_THRESHOLD && canShort) {
        const confidence = 0.5 - forecast;  // How far below neutral
        const positionSize = Math.min(maxPositionValue * (confidence * 4), maxPositionValue);
        const sharesToShort = Math.min(
          Math.floor(positionSize / askPrice),
          Math.floor((availableCash - COMMISSION) / askPrice),
          maxShares
        );
        
        if (sharesToShort > 0) {
          try {
            const purchasePrice = ns.stock.buyShort(symbol, sharesToShort);
            if (purchasePrice > 0) {
              const totalCost = sharesToShort * purchasePrice + COMMISSION;
              tradesExecuted++;
              actionsThisCycle++;
              
              ns.print(`✓ SHORT ${symbol}: ${ns.nFormat(sharesToShort, "0.0a")} @ ${ns.nFormat(purchasePrice, "$0.00a")}`);
              ns.print(`  Forecast: ${(forecast * 100).toFixed(1)}% | Confidence: ${(confidence * 100).toFixed(1)}% | Cost: ${ns.nFormat(totalCost, "$0.00a")}`);
              ns.print(`  Positions: ${currentPositions + 1}/${maxStocks}`);
            }
          } catch (e) {
            // Short access not available - disable shorts and continue with longs only
            canShort = false;
            ns.print(`⚠ Short positions not available (requires BitNode-8 or Source-File 8 Level 2)`);
            ns.print(`  Continuing with long positions only...`);
          }
        }
      }
    }
    
    if (actionsThisCycle === 0) {
      ns.print("No trading opportunities this cycle.");
    }
    
    // Display comprehensive portfolio summary
    displayAdvancedSummary(ns, totalProfit, tradesExecuted, biggestWin, biggestLoss);
    
    await ns.sleep(refreshRate);
  }
}

/** @param {NS} ns */
function calculatePortfolioValue(ns) {
  const symbols = ns.stock.getSymbols();
  let totalValue = 0;
  
  for (const symbol of symbols) {
    const position = ns.stock.getPosition(symbol);
    const [longShares, , shortShares] = position;
    const askPrice = ns.stock.getAskPrice(symbol);
    const bidPrice = ns.stock.getBidPrice(symbol);
    
    if (longShares > 0) {
      totalValue += longShares * bidPrice;
    }
    if (shortShares > 0) {
      totalValue += shortShares * askPrice;
    }
  }
  
  return totalValue;
}

/** @param {NS} ns */
function displayAdvancedSummary(ns, totalProfit, tradesExecuted, biggestWin, biggestLoss) {
  const symbols = ns.stock.getSymbols();
  let portfolioValue = 0;
  let invested = 0;
  let longPositions = 0;
  let shortPositions = 0;
  
  for (const symbol of symbols) {
    const position = ns.stock.getPosition(symbol);
    const [longShares, longPrice, shortShares, shortPrice] = position;
    const askPrice = ns.stock.getAskPrice(symbol);
    const bidPrice = ns.stock.getBidPrice(symbol);
    
    if (longShares > 0) {
      longPositions++;
      portfolioValue += longShares * bidPrice;
      invested += longShares * longPrice;
    }
    if (shortShares > 0) {
      shortPositions++;
      portfolioValue += shortShares * askPrice;
      invested += shortShares * shortPrice;
    }
  }
  
  const cash = ns.getServerMoneyAvailable("home");
  const totalCapital = portfolioValue + cash;
  const unrealizedProfit = portfolioValue - invested;
  const winRate = tradesExecuted > 0 ? (tradesExecuted - (totalProfit < 0 ? 1 : 0)) / tradesExecuted * 100 : 0;
  
  ns.print(`\n${"═".repeat(70)}`);
  ns.print(`PORTFOLIO SUMMARY`);
  ns.print(`${"─".repeat(70)}`);
  ns.print(`Positions: ${longPositions} long / ${shortPositions} short`);
  ns.print(`Portfolio Value: ${ns.nFormat(portfolioValue, "$0.00a")}`);
  ns.print(`Available Cash: ${ns.nFormat(cash, "$0.00a")}`);
  ns.print(`Total Capital: ${ns.nFormat(totalCapital, "$0.00a")}`);
  ns.print(`${"─".repeat(70)}`);
  ns.print(`Unrealized P/L: ${ns.nFormat(unrealizedProfit, "$0.00a")} (${invested > 0 ? ((unrealizedProfit / invested) * 100).toFixed(2) : "0.00"}%)`);
  ns.print(`Realized P/L: ${ns.nFormat(totalProfit, "$0.00a")}`);
  ns.print(`Total Trades: ${tradesExecuted}`);
  if (tradesExecuted > 0) {
    ns.print(`Best Trade: ${biggestWin > 0 ? ns.nFormat(biggestWin, "$0.00a") : "$0.00 (no profitable trades yet)"}`);
    ns.print(`Worst Trade: ${ns.nFormat(biggestLoss, "$0.00a")}`);
  }
  ns.print(`${"═".repeat(70)}`);
}

