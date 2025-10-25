/** home-batcher.js
 * Home server batch operations.
 * Usage: run home-batcher.js [target]
 */

/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0] || "joesguns";
  
  ns.disableLog("sleep");
  ns.disableLog("getServerMaxRam");
  ns.disableLog("getServerUsedRam");

  const host = "home";
  const hackScript = "attack-hack.js";
  const growScript = "attack-grow.js";
  const weakenScript = "attack-weaken.js";
  const helpers = [hackScript, growScript, weakenScript];

  // Ensure helpers exist
  for (const f of helpers) {
    if (!ns.fileExists(f, host)) {
      ns.tprint(`ERROR: helper missing on ${host}: ${f}`);
      return;
    }
  }

  // Get available RAM
  const maxRam = ns.getServerMaxRam(host);
  const usedRam = ns.getServerUsedRam(host);
  const freeRam = Math.max(0, maxRam - usedRam);

  const ramPerThread = ns.getScriptRam(hackScript, host);
  if (!ramPerThread || isNaN(ramPerThread) || ramPerThread <= 0) {
    ns.tprint(`ERROR: cannot determine script RAM for ${hackScript}`);
    return;
  }

  const threads = Math.floor(freeRam / ramPerThread);
  if (threads < 1) {
    ns.tprint(`Insufficient RAM: ${freeRam.toFixed(2)}GB < ${ramPerThread.toFixed(2)}GB`);
    return;
  }

  // Split threads
  const hackThreads = Math.max(1, Math.floor(threads * 0.25));
  const growThreads = Math.max(1, Math.floor(threads * 0.45));
  const weakenThreads = Math.max(1, threads - hackThreads - growThreads);

  ns.tprint(`Home batcher: target=${target} threads=${threads} => h${hackThreads}/g${growThreads}/w${weakenThreads}`);

  // Kill existing helpers
  for (const helper of helpers) {
    try {
      ns.kill(helper, host);
    } catch (e) {
      // Ignore errors
    }
  }

  await ns.sleep(100);

  // Start helpers
  try {
    if (weakenThreads > 0) {
      const pid = ns.exec(weakenScript, host, weakenThreads, target);
      if (pid > 0) ns.tprint(`Started ${weakenScript} with ${weakenThreads} threads (pid: ${pid})`);
    }
    
    if (growThreads > 0) {
      const pid = ns.exec(growScript, host, growThreads, target);
      if (pid > 0) ns.tprint(`Started ${growScript} with ${growThreads} threads (pid: ${pid})`);
    }
    
    if (hackThreads > 0) {
      const pid = ns.exec(hackScript, host, hackThreads, target);
      if (pid > 0) ns.tprint(`Started ${hackScript} with ${hackThreads} threads (pid: ${pid})`);
    }
  } catch (e) {
    ns.tprint(`Error starting helpers: ${e}`);
  }

  ns.tprint("Home batcher started successfully!");
}
