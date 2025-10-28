/** stock-trader-momentum.js
 * Momentum-based stock trading WITHOUT 4S Market Data requirement.
 * 
 * Strategy: Buy stocks on upward momentum (rallies), hold until profit target or stop loss.
 * Uses price history tracking instead of forecasts.
 * 
 * Usage: run stocks/stock-trader-momentum.js [max-stocks] [total-capital] [profit-target] [stop-loss] [refresh-rate-ms]
 * Example: run stocks/stock-trader-momentum.js 10 1000000000 0.10 0.05 6000
 * 
 * Parameters:
 * - max-stocks: Maximum number of different stocks to buy (e.g., 10)
 * - total-capital: Total money to invest across ALL stocks (e.g., 1000000000 = $1b)
 * - profit-target: Profit % to auto-sell at (e.g., 0.10 = 10%, 0.15 = 15%, 0.20 = 20%)
 * - stop-loss: Loss % to auto-sell at (e.g., 0.05 = 5%, 0.10 = 10%) to limit losses
 * - refresh-rate-ms: How often to check market in milliseconds (default: 6000 = 6s)
 * 
 * Requirements:
 * - TIX API Access ($5 billion)
 * - Does NOT require 4S Market Data (saves $25 billion!)
 * 
 * Strategy (MOMENTUM with RISK MANAGEMENT):
 * - Track price changes over last 5 cycles
 * - Buy if 4+ POSITIVE price movements (riding the momentum/rally)
 * - Sell ONLY when profit target reached OR stop loss triggered
 * - Follows upward trends (holds until target or stop loss)
 * - Accounts for $100k commission per transaction
 */

const BUY_MOMENTUM_THRESHOLD = 4;    // Need this many POSITIVE movements to buy (momentum)
const HISTORY_LENGTH = 5;             // Track last 5 price points
const COMMISSION = 100000;            // Stock transaction commission
const MAX_PRICE_SWING = 3;            // Skip stocks with >3% price swings (too risky)

function formatMoney(ns,v,f){try{return ns.nFormat(v,f);}catch(e){const u=['','k','m','b','t','q','Q','s','S','o','n'];let i=0,n=Math.abs(v);while(n>=1000&&i<u.length-1){n/=1000;i++;}return(v<0?'-$':'$')+n.toFixed(f.includes('.00')?2:f.includes('.000')?3:0)+u[i];}}

// Global price history storage
const priceHistory = {};

/** @param {NS} ns */
export async function main(ns) {
  // Validate API access
  if (!ns.stock.hasWSEAccount() || !ns.stock.hasTIXAPIAccess()) {
    ns.tprint("ERROR: You need TIX API Access! ($5 billion from WSE)");
    return;
  }

  // Check if they have 4S Data (recommend using forecast-based scripts instead)
  if (ns.stock.has4SDataTIXAPI()) {
    ns.tprint("═".repeat(70));
    ns.tprint("NOTICE: You have 4S Market Data!");
    ns.tprint("Consider using stock-trader-basic.js instead for better results.");
    ns.tprint("That script uses forecasts which are more accurate than momentum.");
    ns.tprint("═".repeat(70));
    await ns.sleep(3000);
  }

      // Parse parameters
      const maxStocks = ns.args[0] || 10;           // Default: Buy up to 10 different stocks
      const totalCapital = ns.args[1] || 1e9;       // Default: $1 billion total investment
      const profitTarget = ns.args[2] || 0.05;      // Default: 5% profit target (more achievable)
      const stopLoss = ns.args[3] || 0.05;          // Default: 5% stop loss
      const refreshRate = ns.args[4] || 6000;       // Default: 6 seconds
      
      // Validate profit target
      if (profitTarget <= 0 || profitTarget > 1) {
        ns.tprint("ERROR: Profit target must be between 0 and 1 (e.g., 0.10 for 10%)");
        return;
      }
      
      // Validate stop loss
      if (stopLoss <= 0 || stopLoss > 1) {
        ns.tprint("ERROR: Stop loss must be between 0 and 1 (e.g., 0.05 for 5%)");
        return;
      }
  
  // Calculate per-stock investment accounting for commissions
  // Reserve commission fees: $100k per buy transaction
  const totalCommissionReserve = maxStocks * COMMISSION;
  const investableCapital = totalCapital - totalCommissionReserve;
  const investmentPerStock = Math.floor(investableCapital / maxStocks);
  
  if (investmentPerStock <= 0) {
    ns.tprint("ERROR: Total capital too low for the number of stocks!");
    ns.tprint(`Need at least $${formatMoney(ns,(maxStocks * COMMISSION * 2), "0.00a")} for ${maxStocks} stocks`);
    return;
  }
  
  ns.disableLog("ALL");
  ns.clearLog();
  ns.tail();
  
      ns.print(`${"═".repeat(70)}`);
      ns.print(`MOMENTUM STOCK TRADER - STARTING`);
      ns.print(`${"═".repeat(70)}`);
      ns.print(`Strategy: Ride momentum, hold until profit target or stop loss`);
      ns.print(`Max Different Stocks: ${maxStocks}`);
      ns.print(`Total Capital: ${formatMoney(ns,totalCapital, "$0.00a")}`);
      ns.print(`Investment per Stock: ${formatMoney(ns,investmentPerStock, "$0.00a")} (after ${formatMoney(ns,COMMISSION, "$0.00a")} commission)`);
      ns.print(`Profit Target: +${(profitTarget * 100).toFixed(1)}% (take profit)`);
      ns.print(`Stop Loss: -${(stopLoss * 100).toFixed(1)}% (limit losses)`);
      ns.print(`Refresh Rate: ${refreshRate}ms`);
      ns.print(`Buy Signal: ${BUY_MOMENTUM_THRESHOLD}+ POSITIVE movements (ride the rally)`);
      ns.print(`Sell: Only on profit target or stop loss`);
      ns.print(`Max Price Swing: ${MAX_PRICE_SWING}%`);
      ns.print(`${"═".repeat(70)}\n`);

  let cycleCount = 0;
  let totalProfit = 0;
  let tradesExecuted = 0;

  // Initialize price history for all stocks
  const symbols = ns.stock.getSymbols();
  for (const symbol of symbols) {
    priceHistory[symbol] = [];
  }

  while (true) {
    cycleCount++;
    ns.print(`\n--- Cycle ${cycleCount} (${new Date().toLocaleTimeString()}) ---`);
    
    let actionsThisCycle = 0;
    
    for (const symbol of symbols) {
      const askPrice = ns.stock.getAskPrice(symbol);
      const bidPrice = ns.stock.getBidPrice(symbol);
      const position = ns.stock.getPosition(symbol);
      const [longShares, longPrice] = position;
      
      // Update price history
      updatePriceHistory(symbol, bidPrice);
      
      // Calculate momentum (need enough history first)
      if (priceHistory[symbol].length < HISTORY_LENGTH) {
        continue; // Not enough data yet
      }
      
      // Skip if price swings too high (too risky)
      const priceSwing = calculatePriceSwing(symbol);
      if (priceSwing > MAX_PRICE_SWING) {
        continue;
      }
      
      const momentum = calculateMomentum(symbol);
      const positiveMovements = momentum.positive;
      const negativeMovements = momentum.negative;
      
          // Check if we should sell (ONLY profit target or stop loss)
          if (longShares > 0) {
            const currentReturn = ((bidPrice - longPrice) / longPrice);
            
            // Sell ONLY if profit target reached OR stop loss triggered
            const hitProfitTarget = currentReturn >= profitTarget;
            const hitStopLoss = currentReturn <= -stopLoss;
            const shouldSell = hitProfitTarget || hitStopLoss;
            
            if (shouldSell) {
              const salePrice = ns.stock.sellStock(symbol, longShares);
              if (salePrice > 0) {
                const profit = (salePrice - longPrice) * longShares - 2 * COMMISSION;
                totalProfit += profit;
                tradesExecuted++;
                actionsThisCycle++;
                
                const reason = hitProfitTarget ? "PROFIT TARGET" : "STOP LOSS";
                ns.print(`✓ SELL ${symbol}: ${formatMoney(ns,longShares, "0.0a")} shares @ ${formatMoney(ns,salePrice, "$0.00a")}`);
                ns.print(`  Reason: ${reason} | Return: ${(currentReturn * 100).toFixed(2)}% | Momentum: ${positiveMovements}↑ ${negativeMovements}↓ | Profit: ${formatMoney(ns,profit, "$0.00a")}`);
              }
            }
          }
          // Check if we should buy (only if under max stocks limit)
          else if (positiveMovements >= BUY_MOMENTUM_THRESHOLD) {
        // Count current positions
        const currentPositions = symbols.filter(s => {
          const [shares] = ns.stock.getPosition(s);
          return shares > 0;
        }).length;
        
        // Only buy if we haven't reached max stocks
        if (currentPositions >= maxStocks) {
          continue; // Already at max positions
        }
        
        const playerMoney = ns.getServerMoneyAvailable("home");
        const maxAffordable = Math.floor((playerMoney - COMMISSION) / askPrice);
        const maxShares = ns.stock.getMaxShares(symbol);
        const targetShares = Math.floor(investmentPerStock / askPrice);
        const sharesToBuy = Math.min(maxAffordable, maxShares, targetShares);
        
        if (sharesToBuy > 0) {
          const purchasePrice = ns.stock.buyStock(symbol, sharesToBuy);
          if (purchasePrice > 0) {
            const totalCost = sharesToBuy * purchasePrice + COMMISSION;
            totalProfit -= COMMISSION; // Account for buy commission in total profit
            tradesExecuted++;
            actionsThisCycle++;
            
            ns.print(`✓ BUY ${symbol}: ${formatMoney(ns,sharesToBuy, "0.0a")} shares @ ${formatMoney(ns,purchasePrice, "$0.00a")}`);
            ns.print(`  Momentum Buy: ${positiveMovements}↑ ${negativeMovements}↓ (riding the rally) | Swing: ${priceSwing.toFixed(1)}% | Total Cost: ${formatMoney(ns,totalCost, "$0.00a")}`);
            ns.print(`  Positions: ${currentPositions + 1}/${maxStocks}`);
          }
        }
      }
    }
    
    if (actionsThisCycle === 0) {
      ns.print("No trading opportunities this cycle.");
    }
    
    // Display portfolio summary
    displayPortfolioSummary(ns, totalProfit, tradesExecuted, cycleCount);
    
    await ns.sleep(refreshRate);
  }
}

/** Update price history for a symbol */
function updatePriceHistory(symbol, price) {
  if (!priceHistory[symbol]) {
    priceHistory[symbol] = [];
  }
  
  priceHistory[symbol].push(price);
  
  // Keep only recent history
  if (priceHistory[symbol].length > HISTORY_LENGTH) {
    priceHistory[symbol].shift();
  }
}

/** Calculate momentum (positive vs negative price movements) */
function calculateMomentum(symbol) {
  const history = priceHistory[symbol];
  let positive = 0;
  let negative = 0;
  
  // Compare each price with previous price
  for (let i = 1; i < history.length; i++) {
    const change = history[i] - history[i - 1];
    if (change > 0) {
      positive++;
    } else if (change < 0) {
      negative++;
    }
  }
  
  return { positive, negative };
}

/** Calculate price swing (max % variation from average) */
function calculatePriceSwing(symbol) {
  const history = priceHistory[symbol];
  if (history.length < 2) return 0;
  
  const min = Math.min(...history);
  const max = Math.max(...history);
  const avg = history.reduce((a, b) => a + b, 0) / history.length;
  
  return ((max - min) / avg) * 100;
}

/** @param {NS} ns */
function displayPortfolioSummary(ns, totalProfit, tradesExecuted, cycleCount) {
  const symbols = ns.stock.getSymbols();
  let portfolioValue = 0;
  let invested = 0;
  let positionCount = 0;
  let strongMomentumCount = 0;
  
  for (const symbol of symbols) {
    const position = ns.stock.getPosition(symbol);
    const [longShares, longPrice] = position;
    
    if (longShares > 0) {
      positionCount++;
      const bidPrice = ns.stock.getBidPrice(symbol);
      portfolioValue += longShares * bidPrice;
      invested += longShares * longPrice;
    }
    
    // Count stocks with strong momentum opportunities (momentum buys)
    if (priceHistory[symbol] && priceHistory[symbol].length >= HISTORY_LENGTH) {
      const momentum = calculateMomentum(symbol);
      const priceSwing = calculatePriceSwing(symbol);
      if (momentum.positive >= BUY_MOMENTUM_THRESHOLD && priceSwing <= MAX_PRICE_SWING) {
        strongMomentumCount++;
      }
    }
  }
  
  const dataCollectionProgress = Math.min(100, (cycleCount / HISTORY_LENGTH) * 100);
  
  ns.print(`\n${"─".repeat(70)}`);
  ns.print(`Portfolio: ${positionCount} positions | Value: ${formatMoney(ns,portfolioValue, "$0.00a")}`);
  
  if (positionCount > 0) {
    const unrealizedProfit = portfolioValue - invested;
    ns.print(`Unrealized P/L: ${formatMoney(ns,unrealizedProfit, "$0.00a")} (${((unrealizedProfit / invested) * 100).toFixed(2)}%)`);
  }
  
  ns.print(`Realized P/L: ${formatMoney(ns,totalProfit, "$0.00a")} | Total Trades: ${tradesExecuted}`);
  ns.print(`Strong Momentum Opportunities: ${strongMomentumCount} (potential momentum buys)`);
  
  if (cycleCount < HISTORY_LENGTH) {
    ns.print(`\n⏳ Collecting price data: ${dataCollectionProgress.toFixed(0)}% complete`);
    ns.print(`   (Need ${HISTORY_LENGTH} cycles for accurate momentum tracking)`);
  }
}

