/** stock-close-all.js
 * Close ALL stock positions and liquidate portfolio.
 * 
 * Instantly sells all long and short positions, showing profit/loss for each.
 * Useful for taking profits, stopping trading, or rebalancing.
 * 
 * Usage: run stocks/stock-close-all.js [--confirm]
 * 
 * Requirements:
 * - TIX API Access ($5 billion)
 * 
 * Safety: Requires --confirm flag to prevent accidental liquidation
 */

function formatMoney(ns,v,f){try{return ns.nFormat(v,f);}catch(e){const u=['','k','m','b','t','q','Q','s','S','o','n'];let i=0,n=Math.abs(v);while(n>=1000&&i<u.length-1){n/=1000;i++;}return(v<0?'-$':'$')+n.toFixed(f.includes('.00')?2:f.includes('.000')?3:0)+u[i];}}

/** @param {NS} ns */
export async function main(ns) {
  if (!ns.stock.hasWSEAccount() || !ns.stock.hasTIXAPIAccess()) {
    ns.tprint("ERROR: You need TIX API Access! ($5 billion from WSE)");
    return;
  }

  const confirmFlag = ns.args.includes("--confirm");
  const has4S = ns.stock.has4SDataTIXAPI();
  
  // Scan for positions
  const symbols = ns.stock.getSymbols();
  let positions = [];
  
  for (const symbol of symbols) {
    const position = ns.stock.getPosition(symbol);
    const [longShares, longPrice, shortShares, shortPrice] = position;
    
    if (longShares === 0 && shortShares === 0) continue;
    
    const bidPrice = ns.stock.getBidPrice(symbol);
    const askPrice = ns.stock.getAskPrice(symbol);
    const forecast = has4S ? ns.stock.getForecast(symbol) : 0.5;
    
    if (longShares > 0) {
      const currentValue = longShares * bidPrice;
      const cost = longShares * longPrice;
      const profit = currentValue - cost - 200000;  // Include commission
      const returnPct = (profit / cost) * 100;
      
      positions.push({
        symbol,
        type: "LONG",
        shares: longShares,
        entryPrice: longPrice,
        exitPrice: bidPrice,
        profit,
        returnPct,
        forecast
      });
    }
    
    if (shortShares > 0) {
      const currentValue = shortShares * askPrice;
      const cost = shortShares * shortPrice;
      const profit = cost - currentValue - 200000;  // Include commission
      const returnPct = (profit / cost) * 100;
      
      positions.push({
        symbol,
        type: "SHORT",
        shares: shortShares,
        entryPrice: shortPrice,
        exitPrice: askPrice,
        profit,
        returnPct,
        forecast
      });
    }
  }
  
  if (positions.length === 0) {
    ns.tprint("INFO: No positions to close. Portfolio is already empty.");
    return;
  }
  
  // Display summary before closing
  ns.tprint(`${"═".repeat(70)}`);
  ns.tprint(`PORTFOLIO LIQUIDATION SUMMARY`);
  ns.tprint(`${"═".repeat(70)}`);
  ns.tprint(`Found ${positions.length} position(s) to close:`);
  ns.tprint("");
  
  let totalProfit = 0;
  let profitableCount = 0;
  let losingCount = 0;
  
  // Sort by profit (best to worst)
  positions.sort((a, b) => b.profit - a.profit);
  
  for (const pos of positions) {
    const profitStr = pos.profit > 0 ? `+${formatMoney(ns,pos.profit, "$0.00a")}` : formatMoney(ns,pos.profit, "$0.00a");
    const returnStr = pos.profit > 0 ? `+${pos.returnPct.toFixed(1)}%` : `${pos.returnPct.toFixed(1)}%`;
    const emoji = pos.profit > 0 ? "✓" : pos.profit < 0 ? "✗" : "→";
    
    let forecastInfo = "";
    if (has4S) {
      const fcStr = pos.forecast > 0.5 ? `↑${(pos.forecast * 100).toFixed(0)}%` : 
                   pos.forecast < 0.5 ? `↓${(pos.forecast * 100).toFixed(0)}%` : "→50%";
      forecastInfo = ` | Forecast: ${fcStr}`;
    }
    
    ns.tprint(`${emoji} ${pos.symbol} ${pos.type}: ${formatMoney(ns,pos.shares, "0.0a")} shares @ ${formatMoney(ns,pos.entryPrice, "$0.00a")} → ${formatMoney(ns,pos.exitPrice, "$0.00a")}`);
    ns.tprint(`   P/L: ${profitStr} (${returnStr})${forecastInfo}`);
    
    totalProfit += pos.profit;
    if (pos.profit > 0) profitableCount++;
    else if (pos.profit < 0) losingCount++;
  }
  
  ns.tprint("");
  ns.tprint(`${"─".repeat(70)}`);
  ns.tprint(`TOTAL REALIZED P/L: ${totalProfit > 0 ? "+" : ""}${formatMoney(ns,totalProfit, "$0.00a")}`);
  ns.tprint(`Profitable Trades: ${profitableCount} | Losing Trades: ${losingCount}`);
  ns.tprint(`Win Rate: ${((profitableCount / positions.length) * 100).toFixed(1)}%`);
  ns.tprint(`${"═".repeat(70)}`);
  
  // Safety check
  if (!confirmFlag) {
    ns.tprint("");
    ns.tprint("⚠️  SAFETY: Add --confirm flag to execute liquidation");
    ns.tprint("Example: run stocks/stock-close-all.js --confirm");
    return;
  }
  
  // Execute liquidation
  ns.tprint("");
  ns.tprint("🔄 EXECUTING LIQUIDATION...");
  ns.tprint("");
  
  let successCount = 0;
  let failCount = 0;
  let actualProfit = 0;
  
  for (const pos of positions) {
    try {
      let salePrice = 0;
      
      if (pos.type === "LONG") {
        salePrice = ns.stock.sellStock(pos.symbol, pos.shares);
      } else {
        salePrice = ns.stock.sellShort(pos.symbol, pos.shares);
      }
      
      if (salePrice > 0) {
        successCount++;
        actualProfit += pos.profit;
        ns.tprint(`✓ Closed ${pos.symbol} ${pos.type}: ${formatMoney(ns,pos.profit, "$0.00a")}`);
      } else {
        failCount++;
        ns.tprint(`✗ Failed to close ${pos.symbol} ${pos.type}`);
      }
      
      await ns.sleep(50);  // Small delay between transactions
    } catch (error) {
      failCount++;
      ns.tprint(`✗ Error closing ${pos.symbol} ${pos.type}: ${error}`);
    }
  }
  
  // Final summary
  ns.tprint("");
  ns.tprint(`${"═".repeat(70)}`);
  ns.tprint(`LIQUIDATION COMPLETE`);
  ns.tprint(`${"═".repeat(70)}`);
  ns.tprint(`Positions Closed: ${successCount}/${positions.length}`);
  ns.tprint(`Failed: ${failCount}`);
  ns.tprint(`Total Realized P/L: ${actualProfit > 0 ? "+" : ""}${formatMoney(ns,actualProfit, "$0.00a")}`);
  ns.tprint(`Cash Available: ${formatMoney(ns,ns.getServerMoneyAvailable("home"), "$0.00a")}`);
  ns.tprint(`${"═".repeat(70)}`);
  
  if (successCount === positions.length) {
    ns.tprint("✅ All positions successfully closed!");
  } else if (successCount > 0) {
    ns.tprint("⚠️  Some positions failed to close. Check your portfolio.");
  } else {
    ns.tprint("❌ No positions were closed. Check TIX API access.");
  }
}

