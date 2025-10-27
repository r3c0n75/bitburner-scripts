/** stock-trader-basic.js
 * Simple automated stock trading strategy.
 * 
 * Strategy: Buy stocks with >55% forecast, sell when forecast drops below 50%
 * 
 * Usage: run stocks/stock-trader-basic.js [investment-per-stock] [refresh-rate-ms]
 * Example: run stocks/stock-trader-basic.js 1000000000 6000
 * 
 * Requirements:
 * - TIX API Access ($5 billion)
 * - 4S Market Data TIX API ($1 billion) - REQUIRED for forecasts
 * - Sufficient funds for trading
 */

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

  const investmentPerStock = ns.args[0] || 1e9; // Default: $1 billion per stock
  const refreshRate = ns.args[1] || 6000;       // Default: 6 seconds (market updates every 6s)
  
  ns.disableLog("ALL");
  ns.clearLog();
  ns.tail();
  
  ns.print(`${"═".repeat(50)}`);
  ns.print(`BASIC STOCK TRADER - STARTING`);
  ns.print(`${"═".repeat(50)}`);
  ns.print(`Investment per Stock: ${ns.nFormat(investmentPerStock, "$0.00a")}`);
  ns.print(`Refresh Rate: ${refreshRate}ms`);
  ns.print(`Buy Threshold: ${(BUY_THRESHOLD * 100).toFixed(0)}% forecast`);
  ns.print(`Sell Threshold: ${(SELL_THRESHOLD * 100).toFixed(0)}% forecast`);
  ns.print(`${"═".repeat(50)}\n`);

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
            
            ns.print(`✓ SELL ${symbol}: ${ns.nFormat(longShares, "0.0a")} shares @ ${ns.nFormat(salePrice, "$0.00a")}`);
            ns.print(`  Forecast: ${(forecast * 100).toFixed(1)}% | Profit: ${ns.nFormat(profit, "$0.00a")}`);
          }
        }
      }
      // Check if we should buy
      else if (forecast > BUY_THRESHOLD) {
        const playerMoney = ns.getServerMoneyAvailable("home");
        const maxAffordable = Math.floor((playerMoney - COMMISSION) / askPrice);
        const maxShares = ns.stock.getMaxShares(symbol);
        const targetShares = Math.floor(investmentPerStock / askPrice);
        const sharesToBuy = Math.min(maxAffordable, maxShares, targetShares);
        
        if (sharesToBuy > 0) {
          const purchasePrice = ns.stock.buyStock(symbol, sharesToBuy);
          if (purchasePrice > 0) {
            tradesExecuted++;
            actionsThisCycle++;
            
            ns.print(`✓ BUY ${symbol}: ${ns.nFormat(sharesToBuy, "0.0a")} shares @ ${ns.nFormat(purchasePrice, "$0.00a")}`);
            ns.print(`  Forecast: ${(forecast * 100).toFixed(1)}% | Cost: ${ns.nFormat(sharesToBuy * purchasePrice, "$0.00a")}`);
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
    
    ns.print(`\n${"─".repeat(50)}`);
    ns.print(`Portfolio: ${positionCount} positions | Value: ${ns.nFormat(portfolioValue, "$0.00a")}`);
    ns.print(`Unrealized P/L: ${ns.nFormat(unrealizedProfit, "$0.00a")} (${((unrealizedProfit / invested) * 100).toFixed(2)}%)`);
    ns.print(`Realized P/L: ${ns.nFormat(totalProfit, "$0.00a")} | Total Trades: ${tradesExecuted}`);
  }
}

