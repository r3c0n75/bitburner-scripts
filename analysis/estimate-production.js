/** estimate-production.js
 * Estimate REALISTIC production rates accounting for batch cycles.
 * This provides estimates that should match actual measured production.
 * Usage: run estimate-production.js [target]
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
  const target = ns.args[0] || "joesguns";
  
  try {
    const maxMoney = ns.getServerMaxMoney(target);
    const currentMoney = ns.getServerMoneyAvailable(target);
    const hackTime = ns.getHackTime(target);
    const growTime = ns.getGrowTime(target);
    const weakenTime = ns.getWeakenTime(target);
    const hackChance = ns.hackAnalyzeChance(target);
    const hackPercent = ns.hackAnalyze(target);
    
    ns.tprint(`\n=== Production Estimate for ${target} ===`);
    ns.tprint(`Max Money: ${formatMoney(ns, maxMoney, "$0.00a")}`);
    ns.tprint(`Current Money: ${formatMoney(ns, currentMoney, "$0.00a")} (${((currentMoney/maxMoney)*100).toFixed(1)}%)`);
    ns.tprint(`Hack Time: ${(hackTime/1000).toFixed(2)}s`);
    ns.tprint(`Grow Time: ${(growTime/1000).toFixed(2)}s`);
    ns.tprint(`Weaken Time: ${(weakenTime/1000).toFixed(2)}s`);
    ns.tprint(`Hack Chance: ${(hackChance*100).toFixed(1)}%`);
    ns.tprint(`Hack Percent: ${(hackPercent*100).toFixed(2)}%`);
    
    // Calculate batch cycle timing
    const batchTime = Math.max(hackTime, growTime, weakenTime);
    const batchInterval = batchTime * 1.25; // 25% safety buffer
    const batchesPerSecond = 1000 / batchInterval;
    const batchesPerMinute = 60000 / batchInterval;
    
    // Calculate realistic earnings per batch
    // In a batch: hack earns money, grow/weaken earn nothing
    const moneyPerHack = maxMoney * hackPercent * hackChance;
    
    ns.tprint(`\n=== Batch Cycle Analysis ===`);
    ns.tprint(`Batch Cycle Time: ${(batchTime/1000).toFixed(2)}s`);
    ns.tprint(`Safe Interval: ${(batchInterval/1000).toFixed(2)}s`);
    ns.tprint(`Max Batches/min: ${batchesPerMinute.toFixed(2)}`);
    ns.tprint(`Money per Hack Thread: ${formatMoney(ns, moneyPerHack, "$0.00a")}`);
    
    // Calculate realistic production rates for different thread counts
    ns.tprint(`\n=== Realistic Production Estimates ===`);
    ns.tprint(`(Based on full batch cycles with grow/weaken overhead)`);
    
    for (const threads of [1, 5, 10, 25, 50, 100]) {
      // Total money earned per batch cycle (all hack threads)
      const moneyPerBatch = moneyPerHack * threads;
      
      // Income rate accounting for batch timing
      const moneyPerSecond = moneyPerBatch * batchesPerSecond;
      const moneyPerMinute = moneyPerBatch * batchesPerMinute;
      const moneyPerHour = moneyPerMinute * 60;
      
      ns.tprint(`${threads} hack threads: ${formatMoney(ns, moneyPerSecond, "$0.00a")}/s, ${formatMoney(ns, moneyPerMinute, "$0.00a")}/min, ${formatMoney(ns, moneyPerHour, "$0.00a")}/hr`);
    }
    
    // Show theoretical maximum (if you could hack continuously)
    const theoreticalMaxPerSecond = moneyPerHack / (hackTime / 1000);
    const batchEfficiency = (moneyPerHack * batchesPerSecond) / theoreticalMaxPerSecond * 100;
    
    ns.tprint(`\n=== Efficiency Analysis ===`);
    ns.tprint(`Theoretical max (continuous hack): ${formatMoney(ns, theoreticalMaxPerSecond, "$0.00a")}/s`);
    ns.tprint(`Realistic rate (batch cycle): ${formatMoney(ns, moneyPerHack * batchesPerSecond, "$0.00a")}/s`);
    ns.tprint(`Batch efficiency: ${batchEfficiency.toFixed(1)}%`);
    ns.tprint(`\nNote: Batch efficiency < 100% is normal due to grow/weaken overhead.`);
    
    // Warning if server isn't prepped
    if (currentMoney < maxMoney * 0.95) {
      ns.tprint(`\n⚠️  WARNING: Server is only at ${((currentMoney/maxMoney)*100).toFixed(1)}% of max money.`);
      ns.tprint(`Actual earnings may be lower until server is fully grown.`);
    }
    
  } catch (e) {
    ns.tprint(`Error estimating production for ${target}: ${e}`);
  }
}
