/** stock-trader-basic.js
 * Simple automated stock trading strategy.
 * 
 * Strategy: Buy stocks with >55% forecast, sell when forecast drops below 50%
 * 
 * Usage: run stocks/stock-trader-basic.js [max-stocks] [total-capital] [refresh-rate-ms]
 * Example: run stocks/stock-trader-basic.js 10 1000000000 6000
 * 
 * Parameters:
 * - max-stocks: Maximum number of different stocks to buy (e.g., 10)
 * - total-capital: Total money to invest across ALL stocks (e.g., 1000000000 = $1b)
 * - refresh-rate-ms: How often to check market in milliseconds (default: 6000 = 6s)
 * 
 * ⚠️ CRITICAL: COMMISSION WARNING ⚠️
 * Each trade costs $100k commission (buy) + $100k commission (sell) = $200k total!
 * 
 * MINIMUM SAFE CAPITAL REQUIREMENTS:
 * - Per Stock Position: $1,000,000+ (commission = 20% of position)
 * - Total Capital: $10,000,000+ for 10 stocks
 * 
 * DO NOT USE WITH LOW CAPITAL:
 * - $2m / 10 stocks = $200k per stock → 100% LOSS from commissions alone!
 * - $5m / 10 stocks = $500k per stock → 40% loss from commissions
 * - $10m / 10 stocks = $1m per stock → 20% loss from commissions (acceptable)
 * 
 * If you have less than $10m total capital, use fewer stocks:
 * - $5m capital → max 5 stocks (run stocks/stock-trader-basic.js 5 5000000)
 * - $3m capital → max 3 stocks (run stocks/stock-trader-basic.js 3 3000000)
 * 
 * Requirements:
 * - TIX API Access ($5 billion)
 * - 4S Market Data TIX API ($1 billion) - REQUIRED for forecasts
 * - Minimum $10 million trading capital recommended
 */

function formatMoney(ns,v,f){try{return ns.nFormat(v,f);}catch(e){const u=['','k','m','b','t','q','Q','s','S','o','n'];let i=0,n=Math.abs(v);while(n>=1000&&i<u.length-1){n/=1000;i++;}return(v<0?'-$':'$')+n.toFixed(f.includes('.00')?2:f.includes('.000')?3:0)+u[i];}}

const BUY_THRESHOLD = 0.55;  // Buy if forecast > 55%
const SELL_THRESHOLD = 0.50;  // Sell if forecast < 50%
const COMMISSION = 100000;     // Stock transaction commission

/** @param {NS} ns */
export async function main(ns) {
  // Validate API access
  if (!ns.stock.hasWSEAccount() || !ns.stock.hasTIXAPIAccess()) {
    ns.tprint("ERROR: You need TIX API Access! ($5 billion from WSE)");
    return;
  }

  if (!ns.stock.has4SDataTIXAPI()) {
    ns.tprint("ERROR: You need 4S Market Data TIX API! ($1 billion)");
    ns.tprint("This script requires forecast data to make trading decisions.");
    return;
  }

  // Parse parameters
  const maxStocks = ns.args[0] || 10;           // Default: Buy up to 10 different stocks
  const totalCapital = ns.args[1] || 1e9;       // Default: $1 billion total investment
  const refreshRate = ns.args[2] || 6000;       // Default: 6 seconds (market updates every 6s)
  
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
  ns.print(`BASIC STOCK TRADER - STARTING`);
  ns.print(`${"═".repeat(70)}`);
  ns.print(`Max Different Stocks: ${maxStocks}`);
  ns.print(`Total Capital: ${formatMoney(ns,totalCapital, "$0.00a")}`);
  ns.print(`Investment per Stock: ${formatMoney(ns,investmentPerStock, "$0.00a")} (after ${formatMoney(ns,COMMISSION, "$0.00a")} commission)`);
  ns.print(`Refresh Rate: ${refreshRate}ms`);
  ns.print(`Buy Threshold: ${(BUY_THRESHOLD * 100).toFixed(0)}% forecast`);
  ns.print(`Sell Threshold: ${(SELL_THRESHOLD * 100).toFixed(0)}% forecast`);
  ns.print(`${"═".repeat(70)}\n`);

  let cycleCount = 0;
  let totalProfit = 0;
  let tradesExecuted = 0;

  while (true) {
    cycleCount++;
    ns.print(`\n--- Cycle ${cycleCount} (${new Date().toLocaleTimeString()}) ---`);
    
    const symbols = ns.stock.getSymbols();
    let actionsThisCycle = 0;
    
    for (const symbol of symbols) {
      const forecast = ns.stock.getForecast(symbol);
      const position = ns.stock.getPosition(symbol);
      const [longShares, longPrice] = position;
      const askPrice = ns.stock.getAskPrice(symbol);
      const bidPrice = ns.stock.getBidPrice(symbol);
      
      // Check if we should sell
      if (longShares > 0) {
        if (forecast < SELL_THRESHOLD) {
          const salePrice = ns.stock.sellStock(symbol, longShares);
          if (salePrice > 0) {
            const profit = (salePrice - longPrice) * longShares - 2 * COMMISSION;
            totalProfit += profit;
            tradesExecuted++;
            actionsThisCycle++;
            
            ns.print(`✓ SELL ${symbol}: ${formatMoney(ns,longShares, "0.0a")} shares @ ${formatMoney(ns,salePrice, "$0.00a")}`);
            ns.print(`  Forecast: ${(forecast * 100).toFixed(1)}% | Profit: ${formatMoney(ns,profit, "$0.00a")}`);
          }
        }
      }
      // Check if we should buy (only if under max stocks limit)
      else if (forecast > BUY_THRESHOLD) {
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
            tradesExecuted++;
            actionsThisCycle++;
            
            ns.print(`✓ BUY ${symbol}: ${formatMoney(ns,sharesToBuy, "0.0a")} shares @ ${formatMoney(ns,purchasePrice, "$0.00a")}`);
            ns.print(`  Forecast: ${(forecast * 100).toFixed(1)}% | Total Cost: ${formatMoney(ns,totalCost, "$0.00a")}`);
            ns.print(`  Positions: ${currentPositions + 1}/${maxStocks}`);
          }
        }
      }
    }
    
    if (actionsThisCycle === 0) {
      ns.print("No trading opportunities this cycle.");
    }
    
    // Display portfolio summary
    displayPortfolioSummary(ns, totalProfit, tradesExecuted);
    
    await ns.sleep(refreshRate);
  }
}

/** @param {NS} ns */
function displayPortfolioSummary(ns, totalProfit, tradesExecuted) {
  const symbols = ns.stock.getSymbols();
  let portfolioValue = 0;
  let invested = 0;
  let positionCount = 0;
  
  for (const symbol of symbols) {
    const position = ns.stock.getPosition(symbol);
    const [longShares, longPrice] = position;
    
    if (longShares > 0) {
      positionCount++;
      const bidPrice = ns.stock.getBidPrice(symbol);
      portfolioValue += longShares * bidPrice;
      invested += longShares * longPrice;
    }
  }
  
  if (positionCount > 0) {
    const unrealizedProfit = portfolioValue - invested;
    
    ns.print(`\n${"─".repeat(70)}`);
    ns.print(`Portfolio: ${positionCount} positions | Value: ${formatMoney(ns,portfolioValue, "$0.00a")}`);
    ns.print(`Unrealized P/L: ${formatMoney(ns,unrealizedProfit, "$0.00a")} (${((unrealizedProfit / invested) * 100).toFixed(2)}%)`);
    ns.print(`Realized P/L: ${formatMoney(ns,totalProfit, "$0.00a")} | Total Trades: ${tradesExecuted}`);
  }
}

