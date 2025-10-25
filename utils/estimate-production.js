/** estimate-production.js
 * Estimate production rates for different configurations.
 * Usage: run estimate-production.js [target]
 */

/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0] || "joesguns";
  
  try {
    const maxMoney = ns.getServerMaxMoney(target);
    const hackTime = ns.getHackTime(target);
    const growTime = ns.getGrowTime(target);
    const weakenTime = ns.getWeakenTime(target);
    const hackChance = ns.hackAnalyzeChance(target);
    const hackPercent = ns.hackAnalyze(target);
    
    ns.tprint(`\n=== Production Estimate for ${target} ===`);
    ns.tprint(`Max Money: ${ns.nFormat(maxMoney, "$0.00a")}`);
    ns.tprint(`Hack Time: ${(hackTime/1000).toFixed(2)}s`);
    ns.tprint(`Grow Time: ${(growTime/1000).toFixed(2)}s`);
    ns.tprint(`Weaken Time: ${(weakenTime/1000).toFixed(2)}s`);
    ns.tprint(`Hack Chance: ${(hackChance*100).toFixed(1)}%`);
    ns.tprint(`Hack Percent: ${(hackPercent*100).toFixed(2)}%`);
    
    // Calculate expected values
    const expectedPerHack = maxMoney * hackPercent * hackChance;
    const moneyPerSecond = expectedPerHack / (hackTime / 1000);
    
    ns.tprint(`\nExpected per hack: ${ns.nFormat(expectedPerHack, "$0.00a")}`);
    ns.tprint(`Money per second: ${ns.nFormat(moneyPerSecond, "$0.00a")}/s`);
    
    // Estimate for different thread counts
    ns.tprint(`\n=== Production Estimates ===`);
    for (const threads of [1, 5, 10, 25, 50, 100]) {
      const totalPerSecond = moneyPerSecond * threads;
      const totalPerMinute = totalPerSecond * 60;
      const totalPerHour = totalPerMinute * 60;
      
      ns.tprint(`${threads} threads: ${ns.nFormat(totalPerSecond, "$0.00a")}/s, ${ns.nFormat(totalPerMinute, "$0.00a")}/min, ${ns.nFormat(totalPerHour, "$0.00a")}/hr`);
    }
    
    // Calculate batch timing
    const batchTime = Math.max(hackTime, growTime, weakenTime);
    const batchInterval = batchTime * 1.25; // 25% buffer
    
    ns.tprint(`\n=== Batch Timing ===`);
    ns.tprint(`Batch Time: ${(batchTime/1000).toFixed(2)}s`);
    ns.tprint(`Recommended Interval: ${(batchInterval/1000).toFixed(2)}s`);
    ns.tprint(`Batches per minute: ${(60000/batchInterval).toFixed(1)}`);
    
  } catch (e) {
    ns.tprint(`Error estimating production for ${target}: ${e}`);
  }
}
