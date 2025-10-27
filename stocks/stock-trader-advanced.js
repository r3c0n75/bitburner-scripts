/** stock-trader-advanced.js
 * Advanced automated stock trading with portfolio management.
 * 
 * Features:
 * - Long positions with dynamic sizing
 * - Short positions (if available in your game version)
 * - Dynamic position sizing based on forecast confidence
 * - Stop-loss protection
 * - Portfolio rebalancing
 * - Performance tracking
 * 
 * Usage: run stocks/stock-trader-advanced.js [total-investment] [refresh-rate-ms]
 * Example: run stocks/stock-trader-advanced.js 50000000000 6000
 * 
 * Requirements:
 * - TIX API Access ($5 billion)
 * - 4S Market Data TIX API ($1 billion)
 * 
 * Note: Short positions may not be available in all Bitburner versions.
 *       Script will work with long positions only if shorts unavailable.
 */

const LONG_THRESHOLD = 0.55;    // Go long if forecast > 55%
const SHORT_THRESHOLD = 0.45;   // Go short if forecast < 45%
const EXIT_THRESHOLD = 0.02;    // Exit if forecast moves within 2% of neutral
const STOP_LOSS = -0.10;        // Exit if position loses 10%
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

  // Check if short functions are available (version-dependent)
  let canShort = false;
  try {
    canShort = typeof ns.stock.buyShort === 'function' && typeof ns.stock.sellShort === 'function';
  } catch (e) {
    canShort = false;
  }
  
  const totalInvestment = ns.args[0] || 50e9;  // Default: $50 billion
  const refreshRate = ns.args[1] || 6000;       // Default: 6 seconds
  
  ns.disableLog("ALL");
  ns.clearLog();
  ns.tail();
  
  ns.print(`${"═".repeat(70)}`);
  ns.print(`ADVANCED STOCK TRADER - STARTING`);
  ns.print(`${"═".repeat(70)}`);
  ns.print(`Total Investment Budget: ${ns.nFormat(totalInvestment, "$0.00a")}`);
  ns.print(`Short Positions: ${canShort ? "ENABLED" : "DISABLED (not available in this version)"}`);
  if (!canShort) {
    ns.print(`  Note: Trading long positions only`);
  }
  ns.print(`Refresh Rate: ${refreshRate}ms`);
  ns.print(`Long Threshold: ${(LONG_THRESHOLD * 100).toFixed(0)}%`);
  if (canShort) {
    ns.print(`Short Threshold: ${(SHORT_THRESHOLD * 100).toFixed(0)}%`);
  }
  ns.print(`Stop Loss: ${(STOP_LOSS * 100).toFixed(0)}%`);
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
        const returnPct = ((bidPrice - longPrice) / longPrice);
        const shouldExit = forecast < (0.5 + EXIT_THRESHOLD) || returnPct < STOP_LOSS;
        
        if (shouldExit) {
          const salePrice = ns.stock.sellStock(symbol, longShares);
          if (salePrice > 0) {
            const profit = (salePrice - longPrice) * longShares - 2 * COMMISSION;
            totalProfit += profit;
            tradesExecuted++;
            actionsThisCycle++;
            
            if (profit > biggestWin) biggestWin = profit;
            if (profit < biggestLoss) biggestLoss = profit;
            
            const reason = returnPct < STOP_LOSS ? "STOP LOSS" : "FORECAST";
            ns.print(`✓ SELL LONG ${symbol}: ${ns.nFormat(longShares, "0.0a")} @ ${ns.nFormat(salePrice, "$0.00a")}`);
            ns.print(`  Reason: ${reason} | Return: ${(returnPct * 100).toFixed(2)}% | Profit: ${ns.nFormat(profit, "$0.00a")}`);
          }
        }
      }
      
      // Check short positions
      if (shortShares > 0 && canShort) {
        const returnPct = ((shortPrice - askPrice) / shortPrice);
        const shouldExit = forecast > (0.5 - EXIT_THRESHOLD) || returnPct < STOP_LOSS;
        
        if (shouldExit) {
          const salePrice = ns.stock.sellShort(symbol, shortShares);
          if (salePrice > 0) {
            const profit = (shortPrice - salePrice) * shortShares - 2 * COMMISSION;
            totalProfit += profit;
            tradesExecuted++;
            actionsThisCycle++;
            
            if (profit > biggestWin) biggestWin = profit;
            if (profit < biggestLoss) biggestLoss = profit;
            
            const reason = returnPct < STOP_LOSS ? "STOP LOSS" : "FORECAST";
            ns.print(`✓ CLOSE SHORT ${symbol}: ${ns.nFormat(shortShares, "0.0a")} @ ${ns.nFormat(salePrice, "$0.00a")}`);
            ns.print(`  Reason: ${reason} | Return: ${(returnPct * 100).toFixed(2)}% | Profit: ${ns.nFormat(profit, "$0.00a")}`);
          }
        }
      }
    }
    
    // Second pass: Look for new entry opportunities
    const portfolioValue = calculatePortfolioValue(ns);
    const availableCash = ns.getServerMoneyAvailable("home");
    const totalCapital = portfolioValue + availableCash;
    const maxPositionValue = totalCapital * MAX_POSITION_SIZE;
    
    for (const symbol of symbols) {
      const forecast = ns.stock.getForecast(symbol);
      const position = ns.stock.getPosition(symbol);
      const [longShares, , shortShares] = position;
      
      // Skip if we already have a position
      if (longShares > 0 || shortShares > 0) continue;
      
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
            tradesExecuted++;
            actionsThisCycle++;
            
            ns.print(`✓ BUY LONG ${symbol}: ${ns.nFormat(sharesToBuy, "0.0a")} @ ${ns.nFormat(purchasePrice, "$0.00a")}`);
            ns.print(`  Forecast: ${(forecast * 100).toFixed(1)}% | Confidence: ${(confidence * 100).toFixed(1)}%`);
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
          const purchasePrice = ns.stock.buyShort(symbol, sharesToShort);
          if (purchasePrice > 0) {
            tradesExecuted++;
            actionsThisCycle++;
            
            ns.print(`✓ SHORT ${symbol}: ${ns.nFormat(sharesToShort, "0.0a")} @ ${ns.nFormat(purchasePrice, "$0.00a")}`);
            ns.print(`  Forecast: ${(forecast * 100).toFixed(1)}% | Confidence: ${(confidence * 100).toFixed(1)}%`);
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
    ns.print(`Best Trade: ${ns.nFormat(biggestWin, "$0.00a")}`);
    ns.print(`Worst Trade: ${ns.nFormat(biggestLoss, "$0.00a")}`);
  }
  ns.print(`${"═".repeat(70)}`);
}

