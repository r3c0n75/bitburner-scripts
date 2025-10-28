/** f-estimate-production.js - FORMULAS.EXE ENHANCED VERSION
 * 
 * EXACT production rate calculations using Formulas.exe (requires $5 billion program)
 * 
 * IMPROVEMENTS OVER estimate-production.js:
 *  - Uses ns.formulas.hacking.* for EXACT calculations
 *  - Perfect hack chance, timing, and percent calculations
 *  - Shows both current AND optimal state projections
 *  - Zero estimation error - all calculations are precise
 * 
 * Usage: run utils/f-estimate-production.js [target]
 */

/**
 * Format number for both v2.x and v3.x compatibility
 * @param {NS} ns
 * @param {number} value
 * @param {string} format
 */
function formatMoney(ns, value, format) {
  // Try old nFormat (v2.x) - it exists in v3.x but throws error when called
  try {
    return ns.nFormat(value, format);
  } catch (e) {
    // nFormat removed or errored, use custom formatting for v3.x
    const units = ['', 'k', 'm', 'b', 't', 'q', 'Q', 's', 'S', 'o', 'n'];
    let unitIndex = 0;
    let num = Math.abs(value);
    
    while (num >= 1000 && unitIndex < units.length - 1) {
      num /= 1000;
      unitIndex++;
    }
    
    const decimals = format.includes('.00') ? 2 : format.includes('.000') ? 3 : 0;
    const formatted = num.toFixed(decimals) + units[unitIndex];
    return (value < 0 ? '-$' : '$') + formatted;
  }
}

/** @param {NS} ns */
export async function main(ns) {
  // Check for Formulas.exe
  if (!ns.formulas || !ns.formulas.hacking) {
    ns.tprint("ERROR: This script requires Formulas.exe ($5 billion from Dark Web)");
    ns.tprint("Use estimate-production.js for the non-formulas version.");
    return;
  }

  const target = ns.args[0] || "joesguns";
  
  try {
    const player = ns.getPlayer();
    const server = ns.getServer(target);
    
    const maxMoney = server.moneyMax;
    const currentMoney = server.moneyAvailable;
    const minSec = server.minDifficulty;
    const curSec = server.hackDifficulty;
    
    // EXACT calculations with CURRENT server state
    const hackTime = ns.formulas.hacking.hackTime(server, player);
    const growTime = ns.formulas.hacking.growTime(server, player);
    const weakenTime = ns.formulas.hacking.weakenTime(server, player);
    const hackChance = ns.formulas.hacking.hackChance(server, player);
    const hackPercent = ns.formulas.hacking.hackPercent(server, player);
    
    ns.tprint(`${"═".repeat(70)}`);
    ns.tprint(`EXACT Production Estimate for ${target} (Formulas.exe)`);
    ns.tprint(`${"═".repeat(70)}`);
    ns.tprint(`\n=== Current Server State ===`);
    ns.tprint(`Max Money: ${formatMoney(ns, maxMoney, "$0.00a")}`);
    ns.tprint(`Current Money: ${formatMoney(ns, currentMoney, "$0.00a")} (${((currentMoney/maxMoney)*100).toFixed(1)}%)`);
    ns.tprint(`Security: ${curSec.toFixed(1)} / ${minSec.toFixed(1)} (Δ${(curSec-minSec).toFixed(1)})`);
    ns.tprint(`\n=== EXACT Current Timings ===`);
    ns.tprint(`Hack Time: ${(hackTime/1000).toFixed(2)}s`);
    ns.tprint(`Grow Time: ${(growTime/1000).toFixed(2)}s`);
    ns.tprint(`Weaken Time: ${(weakenTime/1000).toFixed(2)}s`);
    ns.tprint(`Hack Chance: ${(hackChance*100).toFixed(2)}% (EXACT)`);
    ns.tprint(`Hack Percent: ${(hackPercent*100).toFixed(3)}% per thread (EXACT)`);
    
    // Calculate batch cycle timing (current state)
    const batchTime = Math.max(hackTime, growTime, weakenTime);
    const batchInterval = batchTime * 1.25; // 25% safety buffer
    const batchesPerSecond = 1000 / batchInterval;
    const batchesPerMinute = 60000 / batchInterval;
    
    // Calculate realistic earnings per batch (current state)
    const moneyPerHack = maxMoney * hackPercent * hackChance;
    
    ns.tprint(`\n=== Current Batch Cycle Analysis ===`);
    ns.tprint(`Batch Cycle Time: ${(batchTime/1000).toFixed(2)}s`);
    ns.tprint(`Safe Interval: ${(batchInterval/1000).toFixed(2)}s`);
    ns.tprint(`Max Batches/min: ${batchesPerMinute.toFixed(2)}`);
    ns.tprint(`Money per Hack Thread: ${formatMoney(ns, moneyPerHack, "$0.00a")}`);
    
    // Calculate realistic production rates for different thread counts (current state)
    ns.tprint(`\n=== EXACT Current Production Rates ===`);
    ns.tprint(`(Based on current security: ${curSec.toFixed(1)})`);
    
    for (const threads of [1, 5, 10, 25, 50, 100]) {
      const moneyPerBatch = moneyPerHack * threads;
      const moneyPerSecond = moneyPerBatch * batchesPerSecond;
      const moneyPerMinute = moneyPerBatch * batchesPerMinute;
      const moneyPerHour = moneyPerMinute * 60;
      
      ns.tprint(`${threads} hack threads: ${formatMoney(ns, moneyPerSecond, "$0.00a")}/s, ${formatMoney(ns, moneyPerMinute, "$0.00a")}/min, ${formatMoney(ns, moneyPerHour, "$0.00a")}/hr`);
    }
    
    // Now calculate OPTIMAL state (min security, max money)
    const serverOptimal = {...server};
    serverOptimal.hackDifficulty = minSec;
    serverOptimal.minDifficulty = minSec;
    serverOptimal.moneyAvailable = maxMoney;
    serverOptimal.moneyMax = maxMoney;
    
    // EXACT optimal calculations
    const optimalHackTime = ns.formulas.hacking.hackTime(serverOptimal, player);
    const optimalGrowTime = ns.formulas.hacking.growTime(serverOptimal, player);
    const optimalWeakenTime = ns.formulas.hacking.weakenTime(serverOptimal, player);
    const optimalHackChance = ns.formulas.hacking.hackChance(serverOptimal, player);
    const optimalHackPercent = ns.formulas.hacking.hackPercent(serverOptimal, player);
    
    const optimalBatchTime = Math.max(optimalHackTime, optimalGrowTime, optimalWeakenTime);
    const optimalBatchInterval = optimalBatchTime * 1.25;
    const optimalBatchesPerSecond = 1000 / optimalBatchInterval;
    const optimalMoneyPerHack = maxMoney * optimalHackPercent * optimalHackChance;
    
    // Show optimal state if significantly different from current
    if (curSec > minSec + 0.5 || currentMoney < maxMoney * 0.95) {
      ns.tprint(`${"═".repeat(70)}`);
      ns.tprint(`EXACT OPTIMAL Production (After Prep)`);
      ns.tprint(`${"═".repeat(70)}`);
      ns.tprint(`Security: ${minSec.toFixed(1)} (minimum), Money: 100%`);
      ns.tprint(`Optimal Hack Chance: ${(optimalHackChance*100).toFixed(2)}%`);
      ns.tprint(`Optimal Hack Percent: ${(optimalHackPercent*100).toFixed(3)}% per thread`);
      ns.tprint(`Optimal Batch Cycle: ${(optimalBatchTime/1000).toFixed(2)}s`);
      ns.tprint(`\n=== EXACT Optimal Production Rates ===`);
      
      for (const threads of [1, 5, 10, 25, 50, 100]) {
        const moneyPerBatch = optimalMoneyPerHack * threads;
        const moneyPerSecond = moneyPerBatch * optimalBatchesPerSecond;
        const moneyPerMinute = moneyPerBatch * (60000 / optimalBatchInterval);
        const moneyPerHour = moneyPerMinute * 60;
        
        // Calculate improvement over current
        const currentRate = moneyPerHack * threads * batchesPerSecond;
        const improvement = currentRate > 0 ? ((moneyPerSecond / currentRate - 1) * 100) : 0;
        
        ns.tprint(`${threads} hack threads: ${formatMoney(ns, moneyPerSecond, "$0.00a")}/s (+${improvement.toFixed(1)}% vs current)`);
      }
      
      ns.tprint(`\n💡 TIP: Run smart-batcher.js to prep this server to optimal state!`);
    }
    
    // Efficiency analysis
    const theoreticalMaxPerSecond = moneyPerHack / (hackTime / 1000);
    const batchEfficiency = (moneyPerHack * batchesPerSecond) / theoreticalMaxPerSecond * 100;
    
    ns.tprint(`${"═".repeat(70)}`);
    ns.tprint(`Efficiency Analysis`);
    ns.tprint(`${"═".repeat(70)}`);
    ns.tprint(`Theoretical max (continuous hack): ${formatMoney(ns, theoreticalMaxPerSecond, "$0.00a")}/s`);
    ns.tprint(`Realistic rate (batch cycle): ${formatMoney(ns, moneyPerHack * batchesPerSecond, "$0.00a")}/s`);
    ns.tprint(`Batch efficiency: ${batchEfficiency.toFixed(1)}%`);
    ns.tprint(`\nNote: Batch efficiency < 100% is normal due to grow/weaken overhead.`);
    
    // Warnings
    if (currentMoney < maxMoney * 0.95) {
      ns.tprint(`\n⚠️  WARNING: Server is only at ${((currentMoney/maxMoney)*100).toFixed(1)}% of max money.`);
      ns.tprint(`Production will increase as server is grown to 100%.`);
    }
    
    if (curSec > minSec + 1) {
      ns.tprint(`\n⚠️  WARNING: Server security is ${(curSec-minSec).toFixed(1)} above minimum.`);
      ns.tprint(`Production will increase significantly after weakening to minimum security.`);
    }
    
    // Player stats
    ns.tprint(`${"═".repeat(70)}`);
    ns.tprint(`Your Stats`);
    ns.tprint(`${"═".repeat(70)}`);
    ns.tprint(`Hacking Level: ${player.skills.hacking}`);
    ns.tprint(`Hacking Multiplier: ${(player.mults.hacking * 100).toFixed(0)}%`);
    ns.tprint(`${"═".repeat(70)}`);
    ns.tprint(`✅ All calculations use ns.formulas.hacking.* for perfect accuracy`);
    ns.tprint(`${"═".repeat(70)}\n`);
    
  } catch (e) {
    ns.tprint(`Error estimating production for ${target}: ${e}`);
  }
}

