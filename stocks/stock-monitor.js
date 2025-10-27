/** stock-monitor.js
 * Real-time stock portfolio monitoring dashboard.
 * 
 * Displays live portfolio performance with automatic updates.
 * Does NOT execute trades - monitoring only.
 * 
 * Usage: run stocks/stock-monitor.js [refresh-rate-ms]
 * Example: run stocks/stock-monitor.js 3000
 * 
 * Requirements:
 * - TIX API Access ($5 billion)
 * - 4S Market Data TIX API ($1 billion) - optional, for forecasts
 */

/** @param {NS} ns */
export async function main(ns) {
  if (!ns.stock.hasWSEAccount() || !ns.stock.hasTIXAPIAccess()) {
    ns.tprint("ERROR: You need TIX API Access! ($5 billion from WSE)");
    return;
  }

  const refreshRate = ns.args[0] || 3000;  // Default: 3 seconds
  const has4S = ns.stock.has4SDataTIXAPI();
  
  ns.disableLog("ALL");
  ns.clearLog();
  ns.tail();
  
  let startingPortfolioValue = 0;
  let startTime = Date.now();
  let peakValue = 0;
  let lowestValue = Infinity;
  
  while (true) {
    ns.clearLog();
    
    const symbols = ns.stock.getSymbols();
    const now = new Date();
    
    // Calculate portfolio metrics
    let portfolioValue = 0;
    let invested = 0;
    let positions = [];
    
    for (const symbol of symbols) {
      const position = ns.stock.getPosition(symbol);
      const [longShares, longPrice, shortShares, shortPrice] = position;
      
      if (longShares === 0 && shortShares === 0) continue;
      
      const askPrice = ns.stock.getAskPrice(symbol);
      const bidPrice = ns.stock.getBidPrice(symbol);
      const forecast = has4S ? ns.stock.getForecast(symbol) : 0.5;
      
      if (longShares > 0) {
        const currentValue = longShares * bidPrice;
        const cost = longShares * longPrice;
        const profit = currentValue - cost;
        const returnPct = (profit / cost) * 100;
        
        portfolioValue += currentValue;
        invested += cost;
        
        positions.push({
          symbol,
          type: "LONG",
          shares: longShares,
          entryPrice: longPrice,
          currentPrice: bidPrice,
          value: currentValue,
          profit,
          returnPct,
          forecast
        });
      }
      
      if (shortShares > 0) {
        const currentValue = shortShares * askPrice;
        const cost = shortShares * shortPrice;
        const profit = cost - currentValue;
        const returnPct = (profit / cost) * 100;
        
        portfolioValue += currentValue;
        invested += cost;
        
        positions.push({
          symbol,
          type: "SHORT",
          shares: shortShares,
          entryPrice: shortPrice,
          currentPrice: askPrice,
          value: currentValue,
          profit,
          returnPct,
          forecast
        });
      }
    }
    
    // Initialize tracking variables
    if (startingPortfolioValue === 0 && portfolioValue > 0) {
      startingPortfolioValue = portfolioValue;
      peakValue = portfolioValue;
      lowestValue = portfolioValue;
    }
    
    if (portfolioValue > peakValue) peakValue = portfolioValue;
    if (portfolioValue < lowestValue && portfolioValue > 0) lowestValue = portfolioValue;
    
    const totalProfit = portfolioValue - invested;
    const totalReturn = invested > 0 ? (totalProfit / invested) * 100 : 0;
    const sessionReturn = startingPortfolioValue > 0 ? 
      ((portfolioValue - startingPortfolioValue) / startingPortfolioValue) * 100 : 0;
    const drawdown = peakValue > 0 ? ((peakValue - portfolioValue) / peakValue) * 100 : 0;
    const runTime = (Date.now() - startTime) / 1000 / 60;  // minutes
    
    // Sort positions by profit/loss
    positions.sort((a, b) => b.profit - a.profit);
    
    // Display dashboard
    ns.print(`${"═".repeat(70)}`);
    ns.print(`STOCK PORTFOLIO MONITOR - ${now.toLocaleTimeString()}`);
    ns.print(`${"═".repeat(70)}`);
    ns.print(`Active Positions: ${positions.length}`);
    ns.print(`Portfolio Value: ${ns.nFormat(portfolioValue, "$0.00a")}`);
    ns.print(`Total Invested: ${ns.nFormat(invested, "$0.00a")}`);
    ns.print(`Cash Available: ${ns.nFormat(ns.getServerMoneyAvailable("home"), "$0.00a")}`);
    ns.print(`${"─".repeat(70)}`);
    ns.print(`Unrealized P/L: ${ns.nFormat(totalProfit, "$0.00a")} (${totalReturn > 0 ? "+" : ""}${totalReturn.toFixed(2)}%)`);
    ns.print(`Session Return: ${sessionReturn > 0 ? "+" : ""}${sessionReturn.toFixed(2)}%`);
    ns.print(`Peak Value: ${ns.nFormat(peakValue, "$0.00a")}`);
    ns.print(`Drawdown: ${drawdown.toFixed(2)}%`);
    ns.print(`Runtime: ${runTime.toFixed(1)} minutes`);
    
    if (positions.length > 0) {
      ns.print(`\n${"═".repeat(70)}`);
      ns.print(`POSITIONS`);
      ns.print(`${"─".repeat(70)}`);
      
      // Header
      if (has4S) {
        ns.print(sprintf("%-6s %-5s %8s %8s %10s %10s %8s",
          "Symbol", "Type", "Shares", "Entry", "Current", "P/L", "Return"));
      } else {
        ns.print(sprintf("%-6s %-5s %8s %8s %10s %10s %8s",
          "Symbol", "Type", "Shares", "Entry", "Current", "P/L", "Return"));
      }
      ns.print(`${"─".repeat(70)}`);
      
      for (const pos of positions) {
        const profitColor = pos.profit > 0 ? "+" : "";
        const returnStr = `${profitColor}${pos.returnPct.toFixed(1)}%`;
        
        ns.print(sprintf("%-6s %-5s %8s %8s %10s %10s %8s",
          pos.symbol,
          pos.type,
          ns.nFormat(pos.shares, "0.0a"),
          ns.nFormat(pos.entryPrice, "$0.0a"),
          ns.nFormat(pos.currentPrice, "$0.0a"),
          ns.nFormat(pos.profit, "$0.0a"),
          returnStr
        ));
        
        if (has4S) {
          const fcStr = pos.forecast > 0.5 ? `↑${(pos.forecast * 100).toFixed(0)}%` : 
                       pos.forecast < 0.5 ? `↓${(pos.forecast * 100).toFixed(0)}%` : "→50%";
          ns.print(`  Forecast: ${fcStr}`);
        }
      }
    } else {
      ns.print(`\nNo active positions.`);
    }
    
    ns.print(`\n${"═".repeat(70)}`);
    ns.print(`Next update in ${(refreshRate / 1000).toFixed(1)}s...`);
    
    await ns.sleep(refreshRate);
  }
}

// Simple sprintf for formatting
function sprintf(format, ...args) {
  let result = "";
  let argIndex = 0;
  
  const parts = format.split(/(%[-\d.]*[sdf])/);
  for (const part of parts) {
    if (part.startsWith("%")) {
      const match = part.match(/%([-]?)(\d*)(?:\.(\d+))?([sdf])/);
      if (match && argIndex < args.length) {
        const [, leftAlign, width, precision, type] = match;
        let value = args[argIndex++];
        
        if (type === "d") {
          value = Math.floor(value).toString();
        } else if (type === "f") {
          value = parseFloat(value).toFixed(precision || 2);
        } else {
          value = String(value);
        }
        
        const w = parseInt(width || "0");
        if (w > value.length) {
          const padding = " ".repeat(w - value.length);
          value = leftAlign ? value + padding : padding + value;
        }
        
        result += value;
      }
    } else {
      result += part;
    }
  }
  
  return result;
}

