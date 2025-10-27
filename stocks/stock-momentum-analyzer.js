/** stock-momentum-analyzer.js
 * Preview momentum analysis WITHOUT making any trades.
 * Shows what stock-trader-momentum.js would buy/sell.
 * 
 * Usage: run stocks/stock-momentum-analyzer.js [cycles]
 * Example: run stocks/stock-momentum-analyzer.js 10
 * 
 * Requirements:
 * - TIX API Access ($5 billion)
 * - Does NOT require 4S Market Data
 * 
 * This script:
 * - Collects price data over multiple cycles
 * - Calculates momentum for each stock
 * - Shows BUY/HOLD/AVOID recommendations
 * - Does NOT execute any trades (safe to run)
 */

const BUY_MOMENTUM_THRESHOLD = 3;
const HISTORY_LENGTH = 5;
const MAX_VOLATILITY = 0.05;

const priceHistory = {};

/** @param {NS} ns */
export async function main(ns) {
  if (!ns.stock.hasWSEAccount() || !ns.stock.hasTIXAPIAccess()) {
    ns.tprint("ERROR: You need TIX API Access! ($5 billion from WSE)");
    return;
  }

  const cyclesToRun = ns.args[0] || 10; // Default: 10 cycles (60 seconds at 6s/cycle)
  const refreshRate = 6000; // 6 seconds to match market updates
  
  ns.tprint(`${"═".repeat(70)}`);
  ns.tprint(`MOMENTUM ANALYSIS PREVIEW - NO TRADES EXECUTED`);
  ns.tprint(`${"═".repeat(70)}`);
  ns.tprint(`Collecting price data over ${cyclesToRun} cycles (${(cyclesToRun * refreshRate / 1000).toFixed(0)} seconds)...`);
  ns.tprint(`This will show you what stocks have momentum WITHOUT buying anything.`);
  ns.tprint(`${"═".repeat(70)}`);

  const symbols = ns.stock.getSymbols();
  
  // Initialize price history
  for (const symbol of symbols) {
    priceHistory[symbol] = [];
  }

  // Collect price data
  for (let cycle = 1; cycle <= cyclesToRun; cycle++) {
    ns.tprint(`Cycle ${cycle}/${cyclesToRun} - Collecting prices... (${((cycle/cyclesToRun)*100).toFixed(0)}%)`);
    
    for (const symbol of symbols) {
      const bidPrice = ns.stock.getBidPrice(symbol);
      updatePriceHistory(symbol, bidPrice);
    }
    
    if (cycle < cyclesToRun) {
      await ns.sleep(refreshRate);
    }
  }

  // Analyze momentum
  ns.tprint("");
  ns.tprint(`${"═".repeat(70)}`);
  ns.tprint(`MOMENTUM ANALYSIS COMPLETE`);
  ns.tprint(`${"═".repeat(70)}`);

  const recommendations = {
    strongBuy: [],
    buy: [],
    hold: [],
    avoid: []
  };

  for (const symbol of symbols) {
    if (priceHistory[symbol].length < HISTORY_LENGTH) continue;
    
    const askPrice = ns.stock.getAskPrice(symbol);
    const bidPrice = ns.stock.getBidPrice(symbol);
    const momentum = calculateMomentum(symbol);
    const priceChange = calculatePriceChange(symbol);
    const priceVolatility = calculatePriceVolatility(symbol);
    
    const analysis = {
      symbol,
      askPrice,
      bidPrice,
      momentum,
      priceChange,
      priceVolatility,
      tooVolatile: priceVolatility > 10 // >10% price swings in our data
    };
    
    // Categorize
    if (analysis.tooVolatile) {
      recommendations.avoid.push(analysis);
    } else if (momentum.positive >= 4) {
      recommendations.strongBuy.push(analysis);
    } else if (momentum.positive >= BUY_MOMENTUM_THRESHOLD) {
      recommendations.buy.push(analysis);
    } else {
      recommendations.hold.push(analysis);
    }
  }

  // Display recommendations
  displayRecommendations(ns, recommendations);
}

function updatePriceHistory(symbol, price) {
  if (!priceHistory[symbol]) {
    priceHistory[symbol] = [];
  }
  priceHistory[symbol].push(price);
  if (priceHistory[symbol].length > HISTORY_LENGTH) {
    priceHistory[symbol].shift();
  }
}

function calculateMomentum(symbol) {
  const history = priceHistory[symbol];
  let positive = 0;
  let negative = 0;
  
  for (let i = 1; i < history.length; i++) {
    const change = history[i] - history[i - 1];
    if (change > 0) positive++;
    else if (change < 0) negative++;
  }
  
  return { positive, negative };
}

function calculatePriceChange(symbol) {
  const history = priceHistory[symbol];
  if (history.length < 2) return 0;
  
  const first = history[0];
  const last = history[history.length - 1];
  return ((last - first) / first) * 100;
}

function calculatePriceVolatility(symbol) {
  const history = priceHistory[symbol];
  if (history.length < 2) return 0;
  
  // Calculate max price swing as % of average
  let min = Math.min(...history);
  let max = Math.max(...history);
  let avg = history.reduce((a, b) => a + b, 0) / history.length;
  
  return ((max - min) / avg) * 100;
}

/** @param {NS} ns */
function displayRecommendations(ns, rec) {
  const totalAnalyzed = rec.strongBuy.length + rec.buy.length + rec.hold.length + rec.avoid.length;
  
  ns.tprint(`Total Stocks Analyzed: ${totalAnalyzed}`);
  ns.tprint(`Strong Buy: ${rec.strongBuy.length} | Buy: ${rec.buy.length} | Hold: ${rec.hold.length} | Avoid: ${rec.avoid.length}`);
  
  // Strong Buy recommendations
  if (rec.strongBuy.length > 0) {
    ns.tprint("");
    ns.tprint(`${"═".repeat(70)}`);
    ns.tprint(`🔥 STRONG BUY (4+ positive movements)`);
    ns.tprint(`${"═".repeat(70)}`);
    
    rec.strongBuy.sort((a, b) => b.priceChange - a.priceChange);
    
    for (const stock of rec.strongBuy) {
      ns.tprint(`${stock.symbol.padEnd(6)} @ ${ns.nFormat(stock.askPrice, "$0.00a").padEnd(8)} | ` +
                `Momentum: ${stock.momentum.positive}↑ ${stock.momentum.negative}↓ | ` +
                `Change: ${stock.priceChange > 0 ? "+" : ""}${stock.priceChange.toFixed(2)}% | ` +
                `Swing: ${stock.priceVolatility.toFixed(1)}%`);
    }
  }
  
  // Buy recommendations
  if (rec.buy.length > 0) {
    ns.tprint("");
    ns.tprint(`${"═".repeat(70)}`);
    ns.tprint(`✅ BUY (3+ positive movements)`);
    ns.tprint(`${"═".repeat(70)}`);
    
    rec.buy.sort((a, b) => b.priceChange - a.priceChange);
    
    for (const stock of rec.buy) {
      ns.tprint(`${stock.symbol.padEnd(6)} @ ${ns.nFormat(stock.askPrice, "$0.00a").padEnd(8)} | ` +
                `Momentum: ${stock.momentum.positive}↑ ${stock.momentum.negative}↓ | ` +
                `Change: ${stock.priceChange > 0 ? "+" : ""}${stock.priceChange.toFixed(2)}% | ` +
                `Swing: ${stock.priceVolatility.toFixed(1)}%`);
    }
  }
  
  // Hold (neutral momentum)
  if (rec.hold.length > 0) {
    ns.tprint("");
    ns.tprint(`${"─".repeat(70)}`);
    ns.tprint(`⏸️  HOLD (Neutral momentum - no action recommended)`);
    ns.tprint(`Showing top 5 by price change:`);
    ns.tprint(`${"─".repeat(70)}`);
    
    rec.hold.sort((a, b) => Math.abs(b.priceChange) - Math.abs(a.priceChange));
    
    for (let i = 0; i < Math.min(5, rec.hold.length); i++) {
      const stock = rec.hold[i];
      ns.tprint(`${stock.symbol.padEnd(6)} @ ${ns.nFormat(stock.askPrice, "$0.00a").padEnd(8)} | ` +
                `Momentum: ${stock.momentum.positive}↑ ${stock.momentum.negative}↓ | ` +
                `Change: ${stock.priceChange > 0 ? "+" : ""}${stock.priceChange.toFixed(2)}%`);
    }
    if (rec.hold.length > 5) {
      ns.tprint(`... and ${rec.hold.length - 5} more neutral stocks`);
    }
  }
  
  // Avoid (too volatile)
  if (rec.avoid.length > 0) {
    ns.tprint("");
    ns.tprint(`${"─".repeat(70)}`);
    ns.tprint(`⚠️  AVOID (High price swings >10% - too risky)`);
    ns.tprint(`${"─".repeat(70)}`);
    
    rec.avoid.sort((a, b) => b.priceVolatility - a.priceVolatility);
    
    for (const stock of rec.avoid) {
      ns.tprint(`${stock.symbol.padEnd(6)} @ ${ns.nFormat(stock.askPrice, "$0.00a").padEnd(8)} | ` +
                `Price Swing: ${stock.priceVolatility.toFixed(1)}% ⚠️  | ` +
                `Momentum: ${stock.momentum.positive}↑ ${stock.momentum.negative}↓`);
    }
  }
  
  // Summary and next steps
  ns.tprint("");
  ns.tprint(`${"═".repeat(70)}`);
  ns.tprint(`SUMMARY & RECOMMENDATIONS`);
  ns.tprint(`${"═".repeat(70)}`);
  
  const buyableCount = rec.strongBuy.length + rec.buy.length;
  
  if (buyableCount > 0) {
    ns.tprint(`✅ ${buyableCount} stocks with positive momentum detected!`);
    ns.tprint(`\nThe momentum trader would buy these stocks now.`);
    ns.tprint(`\nTo start automated trading:`);
    ns.tprint(`  run stocks/stock-trader-momentum.js 1000000000 6000`);
  } else {
    ns.tprint(`⏸️  No stocks with strong positive momentum right now.`);
    ns.tprint(`\nMarket conditions may not be ideal for momentum trading.`);
    ns.tprint(`Recommendations:`);
    ns.tprint(`  - Wait and run this analyzer again in 5-10 minutes`);
    ns.tprint(`  - Consider saving up for 4S Market Data ($25b) for forecast-based trading`);
  }
  
  ns.tprint(`\nTo re-analyze momentum:`);
  ns.tprint(`  run stocks/stock-momentum-analyzer.js [cycles]`);
  ns.tprint(`  (Default 10 cycles = 60 seconds of data collection)`);
  ns.tprint(`${"═".repeat(70)}`);
}

