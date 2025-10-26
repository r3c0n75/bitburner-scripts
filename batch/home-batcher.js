/** home-batcher.js
 * Home server batch operations with enhanced error handling.
 * Usage: run batch/home-batcher.js [target]
 */

/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0] || "joesguns";
  
  ns.disableLog("sleep");
  ns.disableLog("getServerMaxRam");
  ns.disableLog("getServerUsedRam");
  ns.disableLog("ps");

  const host = "home";
  const hackScript = "core/attack-hack.js";
  const growScript = "core/attack-grow.js";
  const weakenScript = "core/attack-weaken.js";
  const helpers = [hackScript, growScript, weakenScript];

  ns.tprint(`═══════════════════════════════════════════════════`);
  ns.tprint(`  HOME BATCHER: ${target}`);
  ns.tprint(`═══════════════════════════════════════════════════`);

  // Check for other running scripts that might compete for RAM
  const procs = ns.ps(host);
  const otherScripts = procs.filter(p => 
    !helpers.includes(p.filename) && 
    p.filename !== "batch/home-batcher.js"
  );
  
  if (otherScripts.length > 0) {
    ns.tprint(`⚠ WARNING: ${otherScripts.length} other script(s) running on home:`);
    for (const p of otherScripts.slice(0, 5)) {
      ns.tprint(`  - ${p.filename} (${p.threads} threads)`);
    }
    if (otherScripts.length > 5) {
      ns.tprint(`  ... and ${otherScripts.length - 5} more`);
    }
    ns.tprint(`  This may cause RAM conflicts!`);
    ns.tprint("");
  }

  // Ensure helpers exist
  for (const f of helpers) {
    if (!ns.fileExists(f, host)) {
      ns.tprint(`✗ ERROR: helper missing on ${host}: ${f}`);
      return;
    }
  }

  // Get RAM info
  const maxRam = ns.getServerMaxRam(host);
  const usedRam = ns.getServerUsedRam(host);
  const freeRam = Math.max(0, maxRam - usedRam);

  // Calculate RAM per thread for each script
  const hackRam = ns.getScriptRam(hackScript, host);
  const growRam = ns.getScriptRam(growScript, host);
  const weakenRam = ns.getScriptRam(weakenScript, host);

  if (!hackRam || !growRam || !weakenRam || hackRam <= 0 || growRam <= 0 || weakenRam <= 0) {
    ns.tprint(`✗ ERROR: cannot determine script RAM requirements`);
    return;
  }

  // Use the largest RAM requirement for thread calculation
  const ramPerThread = Math.max(hackRam, growRam, weakenRam);
  const threads = Math.floor(freeRam / ramPerThread);
  
  if (threads < 3) {
    ns.tprint(`✗ ERROR: Insufficient RAM for minimum operation`);
    ns.tprint(`  Available: ${freeRam.toFixed(2)}GB`);
    ns.tprint(`  Required: ${(ramPerThread * 3).toFixed(2)}GB (minimum 3 threads)`);
    ns.tprint(`  Used by others: ${usedRam.toFixed(2)}GB`);
    return;
  }

  // Split threads with proper allocation
  const hackThreads = Math.max(1, Math.floor(threads * 0.25));
  const growThreads = Math.max(1, Math.floor(threads * 0.45));
  const weakenThreads = Math.max(1, threads - hackThreads - growThreads);

  // Calculate actual RAM needed
  const neededRam = (hackThreads * hackRam) + (growThreads * growRam) + (weakenThreads * weakenRam);

  ns.tprint(`Available RAM: ${freeRam.toFixed(2)}GB / ${maxRam.toFixed(2)}GB`);
  ns.tprint(`Needed RAM: ${neededRam.toFixed(2)}GB`);
  ns.tprint(`Thread allocation: h${hackThreads}/g${growThreads}/w${weakenThreads} (${threads} total)`);
  ns.tprint("");

  if (neededRam > freeRam) {
    ns.tprint(`✗ ERROR: Not enough RAM for planned allocation!`);
    ns.tprint(`  Needed: ${neededRam.toFixed(2)}GB`);
    ns.tprint(`  Available: ${freeRam.toFixed(2)}GB`);
    ns.tprint(`  Shortfall: ${(neededRam - freeRam).toFixed(2)}GB`);
    return;
  }

  // Kill existing helpers
  ns.tprint("Stopping any existing helper scripts...");
  let killedCount = 0;
  for (const helper of helpers) {
    try {
      if (ns.scriptRunning(helper, host)) {
        ns.kill(helper, host);
        killedCount++;
      }
    } catch (e) {
      // Ignore errors
    }
  }
  if (killedCount > 0) {
    ns.tprint(`✓ Stopped ${killedCount} helper script(s)`);
  }

  await ns.sleep(100);

  // Start helpers with explicit error checking
  ns.tprint("");
  ns.tprint("Starting helper scripts...");
  
  let startedCount = 0;
  let failedCount = 0;

  // Start weaken first (foundation)
  if (weakenThreads > 0) {
    const checkRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
    const neededWeakenRam = weakenThreads * weakenRam;
    
    if (checkRam >= neededWeakenRam) {
      const pid = ns.exec(weakenScript, host, weakenThreads, target);
      if (pid > 0) {
        ns.tprint(`✓ Started ${weakenScript} with ${weakenThreads} threads (pid: ${pid})`);
        startedCount++;
      } else {
        ns.tprint(`✗ FAILED to start ${weakenScript} (exec returned 0)`);
        failedCount++;
      }
    } else {
      ns.tprint(`✗ FAILED: Not enough RAM for ${weakenScript}`);
      ns.tprint(`  Needed: ${neededWeakenRam.toFixed(2)}GB, Available: ${checkRam.toFixed(2)}GB`);
      failedCount++;
    }
  }

  // Start grow (support)
  if (growThreads > 0) {
    const checkRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
    const neededGrowRam = growThreads * growRam;
    
    if (checkRam >= neededGrowRam) {
      const pid = ns.exec(growScript, host, growThreads, target);
      if (pid > 0) {
        ns.tprint(`✓ Started ${growScript} with ${growThreads} threads (pid: ${pid})`);
        startedCount++;
      } else {
        ns.tprint(`✗ FAILED to start ${growScript} (exec returned 0)`);
        failedCount++;
      }
    } else {
      ns.tprint(`✗ FAILED: Not enough RAM for ${growScript}`);
      ns.tprint(`  Needed: ${neededGrowRam.toFixed(2)}GB, Available: ${checkRam.toFixed(2)}GB`);
      failedCount++;
    }
  }

  // Start hack (money maker!)
  if (hackThreads > 0) {
    const checkRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
    const neededHackRam = hackThreads * hackRam;
    
    if (checkRam >= neededHackRam) {
      const pid = ns.exec(hackScript, host, hackThreads, target);
      if (pid > 0) {
        ns.tprint(`✓ Started ${hackScript} with ${hackThreads} threads (pid: ${pid})`);
        startedCount++;
      } else {
        ns.tprint(`✗ FAILED to start ${hackScript} (exec returned 0)`);
        failedCount++;
      }
    } else {
      ns.tprint(`✗ FAILED: Not enough RAM for ${hackScript}`);
      ns.tprint(`  Needed: ${neededHackRam.toFixed(2)}GB, Available: ${checkRam.toFixed(2)}GB`);
      failedCount++;
    }
  }

  ns.tprint("");
  ns.tprint(`═══════════════════════════════════════════════════`);
  if (failedCount === 0) {
    ns.tprint(`✓ SUCCESS: All ${startedCount} helper scripts started!`);
  } else {
    ns.tprint(`⚠ PARTIAL SUCCESS: ${startedCount} started, ${failedCount} failed`);
    ns.tprint(`  Without ALL three scripts, batching won't work properly!`);
    if (failedCount > 0) {
      ns.tprint(`  Consider killing other scripts or using batch-manager.js instead.`);
    }
  }
  ns.tprint(`═══════════════════════════════════════════════════`);
}
