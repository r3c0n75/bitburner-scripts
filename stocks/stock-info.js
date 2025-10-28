/** stock-info.js
 * Display detailed stock market information.
 * Usage: run stocks/stock-info.js [symbol]
 * 
 * Requirements:
 * - TIX API Access ($5 billion from WSE)
 * - 4S Market Data TIX API ($1 billion) - optional, for forecasts
 */

/**
 * Format number for both v2.x and v3.x compatibility
 */
function formatMoney(ns, value, format) {
  try {
    return ns.nFormat(value, format);
  } catch (e) {
    const units = ['', 'k', 'm', 'b', 't', 'q', 'Q', 's', 'S', 'o', 'n'];
    let unitIndex = 0;
    let num = Math.abs(value);
    while (num >= 1000 && unitIndex < units.length - 1) { num /= 1000; unitIndex++; }
    const decimals = format.includes('.00') ? 2 : format.includes('.000') ? 3 : 0;
    return (value < 0 ? '-$' : '$') + num.toFixed(decimals) + units[unitIndex];
  }
}

/** @param {NS} ns */
export async function main(ns) {
  // Check if TIX API is available
  if (!ns.stock.hasWSEAccount()) {
    ns.tprint("ERROR: You need to purchase WSE Account access first!");
    ns.tprint("Visit the World Stock Exchange in the City.");
    return;
  }

  if (!ns.stock.hasTIXAPIAccess()) {
    ns.tprint("ERROR: You need to purchase TIX API Access ($5 billion)!");
    return;
  }

  const symbol = ns.args[0];
  const has4S = ns.stock.has4SDataTIXAPI();

  if (symbol) {
    // Display info for specific stock
    displayStockInfo(ns, symbol, has4S);
  } else {
    // Display all stocks
    displayAllStocks(ns, has4S);
  }
}

/** @param {NS} ns */
function displayStockInfo(ns, symbol, has4S) {
  const position = ns.stock.getPosition(symbol);
  const [longShares, longPrice, shortShares, shortPrice] = position;
  const maxShares = ns.stock.getMaxShares(symbol);
  const askPrice = ns.stock.getAskPrice(symbol);
  const bidPrice = ns.stock.getBidPrice(symbol);
  const volatility = ns.stock.getVolatility(symbol);
  
  ns.tprint(`\n${"═".repeat(70)}`);
  ns.tprint(`STOCK INFORMATION: ${symbol}`);
  ns.tprint(`${"═".repeat(70)}`);
  ns.tprint(`Ask Price: ${formatMoney(ns, askPrice, "$0.00a")}`);
  ns.tprint(`Bid Price: ${formatMoney(ns, bidPrice, "$0.00a")}`);
  ns.tprint(`Spread: ${formatMoney(ns, askPrice - bidPrice, "$0.00a")} (${((askPrice - bidPrice) / askPrice * 100).toFixed(2)}%)`);
  ns.tprint(`Max Shares: ${formatMoney(ns, maxShares, "0.00a")}`);
  ns.tprint(`Volatility: ${(volatility * 100).toFixed(2)}%`);
  
  if (has4S) {
    const forecast = ns.stock.getForecast(symbol);
    ns.tprint(`Forecast: ${(forecast * 100).toFixed(2)}% (${forecast > 0.5 ? "BULLISH ↑" : "BEARISH ↓"})`);
  } else {
    ns.tprint(`Forecast: (Requires 4S Market Data TIX API - $1 billion)`);
  }
  
  ns.tprint(`\n--- Your Position ---`);
  if (longShares > 0) {
    const longValue = longShares * bidPrice;
    const longProfit = (bidPrice - longPrice) * longShares;
    const longReturn = ((bidPrice - longPrice) / longPrice) * 100;
    ns.tprint(`Long: ${formatMoney(ns, longShares, "0.00a")} shares @ ${formatMoney(ns, longPrice, "$0.00a")}`);
    ns.tprint(`  Current Value: ${formatMoney(ns, longValue, "$0.00a")}`);
    ns.tprint(`  Profit/Loss: ${formatMoney(ns, longProfit, "$0.00a")} (${longReturn > 0 ? "+" : ""}${longReturn.toFixed(2)}%)`);
  } else {
    ns.tprint(`Long: No position`);
  }
  
  if (shortShares > 0) {
    const shortValue = shortShares * askPrice;
    const shortProfit = (shortPrice - askPrice) * shortShares;
    const shortReturn = ((shortPrice - askPrice) / shortPrice) * 100;
    ns.tprint(`Short: ${formatMoney(ns, shortShares, "0.00a")} shares @ ${formatMoney(ns, shortPrice, "$0.00a")}`);
    ns.tprint(`  Current Value: ${formatMoney(ns, shortValue, "$0.00a")}`);
    ns.tprint(`  Profit/Loss: ${formatMoney(ns, shortProfit, "$0.00a")} (${shortReturn > 0 ? "+" : ""}${shortReturn.toFixed(2)}%)`);
  } else {
    ns.tprint(`Short: No position`);
  }
}

/** @param {NS} ns */
function displayAllStocks(ns, has4S) {
  const symbols = ns.stock.getSymbols();
  
  ns.tprint(`${"═".repeat(70)}`);
  ns.tprint(`STOCK MARKET OVERVIEW`);
  ns.tprint(`${"═".repeat(70)}`);
  ns.tprint(`Total Stocks: ${symbols.length}`);
  ns.tprint(`4S Market Data: ${has4S ? "YES" : "NO (forecasts unavailable)"}`);
  ns.tprint(`${"─".repeat(70)}`);
  
  let totalPortfolioValue = 0;
  let totalInvested = 0;
  let positionsCount = 0;
  
  // Header
  if (has4S) {
    ns.tprint(sprintf("%-6s %10s %10s %8s %8s %8s", 
      "Symbol", "Ask", "Bid", "Forecast", "Position", "P/L"));
  } else {
    ns.tprint(sprintf("%-6s %10s %10s %8s %8s", 
      "Symbol", "Ask", "Bid", "Position", "P/L"));
  }
  ns.tprint(`${"─".repeat(70)}`);
  
  for (const symbol of symbols) {
    const askPrice = ns.stock.getAskPrice(symbol);
    const bidPrice = ns.stock.getBidPrice(symbol);
    const position = ns.stock.getPosition(symbol);
    const [longShares, longPrice, shortShares, shortPrice] = position;
    
    let posStr = "---";
    let plStr = "---";
    
    if (longShares > 0) {
      positionsCount++;
      const value = longShares * bidPrice;
      const invested = longShares * longPrice;
      const profit = value - invested;
      const returnPct = (profit / invested) * 100;
      
      totalPortfolioValue += value;
      totalInvested += invested;
      
      posStr = `L ${formatMoney(ns, longShares, "0.0a")}`;
      plStr = `${returnPct > 0 ? "+" : ""}${returnPct.toFixed(1)}%`;
    } else if (shortShares > 0) {
      positionsCount++;
      const value = shortShares * askPrice;
      const invested = shortShares * shortPrice;
      const profit = invested - value;
      const returnPct = (profit / invested) * 100;
      
      totalPortfolioValue += value;
      totalInvested += invested;
      
      posStr = `S ${formatMoney(ns, shortShares, "0.0a")}`;
      plStr = `${returnPct > 0 ? "+" : ""}${returnPct.toFixed(1)}%`;
    }
    
    if (has4S) {
      const forecast = ns.stock.getForecast(symbol);
      const fcStr = forecast > 0.5 ? `↑${(forecast * 100).toFixed(0)}%` : `↓${(forecast * 100).toFixed(0)}%`;
      ns.tprint(sprintf("%-6s %10s %10s %8s %8s %8s",
        symbol,
        formatMoney(ns, askPrice, "$0.0a"),
        formatMoney(ns, bidPrice, "$0.0a"),
        fcStr,
        posStr,
        plStr
      ));
    } else {
      ns.tprint(sprintf("%-6s %10s %10s %8s %8s",
        symbol,
        formatMoney(ns, askPrice, "$0.0a"),
        formatMoney(ns, bidPrice, "$0.0a"),
        posStr,
        plStr
      ));
    }
  }
  
  ns.tprint(`${"─".repeat(70)}`);
  ns.tprint(`Active Positions: ${positionsCount}`);
  if (totalInvested > 0) {
    const totalProfit = totalPortfolioValue - totalInvested;
    const totalReturn = (totalProfit / totalInvested) * 100;
    ns.tprint(`Portfolio Value: ${formatMoney(ns, totalPortfolioValue, "$0.00a")}`);
    ns.tprint(`Total Invested: ${formatMoney(ns, totalInvested, "$0.00a")}`);
    ns.tprint(`Total P/L: ${formatMoney(ns, totalProfit, "$0.00a")} (${totalReturn > 0 ? "+" : ""}${totalReturn.toFixed(2)}%)`);
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

