/** smart-batcher.js
 * Intelligent batch deployment with optimal thread ratios based on timing and security analysis.
 *
 * Usage:
 *   run smart-batcher.js <target> [hackPercent] [--include-home] [--quiet] [--dry]
 *
 * Features:
 *   - Calculates optimal hack/grow/weaken ratios based on target timing
 *   - Accounts for security impact of each operation
 *   - Balances thread allocation across all servers
 *   - Uses timing analysis to maximize throughput
 *
 * Examples:
 *   run smart-batcher.js joesguns           # auto-calculate optimal ratios
 *   run smart-batcher.js joesguns 0.10      # hack 10% per batch
 *   run smart-batcher.js joesguns --quiet   # quiet mode
 */

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("sleep");
  ns.disableLog("getServerMaxRam");
  ns.disableLog("getServerUsedRam");
  ns.disableLog("scp");
  ns.disableLog("exec");
  ns.disableLog("kill");
  ns.disableLog("scan");

  const args = ns.args.slice();
  const target = args.shift();
  if (!target) {
    ns.tprint("Usage: run smart-batcher.js <target> [hackPercent] [--include-home] [--quiet] [--dry]");
    ns.tprint("Example: run smart-batcher.js joesguns 0.05 --quiet");
    return;
  }

  // Parse hack percent (if present as next arg and not a flag)
  let hackPercent = 0.05; // Default to 5% per batch
  if (args.length && typeof args[0] === "number") {
    const maybeNum = Number(args[0]);
    if (!isNaN(maybeNum) && maybeNum > 0 && maybeNum <= 1) {
      hackPercent = maybeNum;
      args.shift();
    }
  }

  // Parse flags
  const includeHome = args.includes("--include-home") || args.includes("-H");
  const quiet = args.includes("--quiet") || args.includes("-q");
  const dryRun = args.includes("--dry") || args.includes("-n");

  const log = (...parts) => {
    const msg = parts.join(" ");
    if (quiet) ns.print(msg); else ns.tprint(msg);
  };
  const logError = (...parts) => ns.tprint(parts.join(" "));

  const host = ns.getHostname();
  const hackScript = "core/attack-hack.js";
  const growScript = "core/attack-grow.js";
  const weakenScript = "core/attack-weaken.js";
  const helpers = [hackScript, growScript, weakenScript];

  // Ensure helpers exist on the host running the batcher
  for (const f of helpers) {
    if (!ns.fileExists(f, host)) {
      logError(`ERROR: helper missing on ${host}: ${f}. Place the helper files on the server running this script and retry.`);
      return;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // SMART RATIO CALCULATION
  // ═══════════════════════════════════════════════════════════════
  
  // Get target server timings
  const hackTime = ns.getHackTime(target);
  const growTime = ns.getGrowTime(target);
  const weakenTime = ns.getWeakenTime(target);
  
  // Security constants (from game mechanics)
  const HACK_SECURITY = 0.002;   // Security added per hack thread
  const GROW_SECURITY = 0.004;   // Security added per grow thread
  const WEAKEN_AMOUNT = 0.05;    // Security removed per weaken thread
  
  // Calculate timing ratios (how many operations fit in the batch window)
  const batchWindow = Math.max(hackTime, growTime, weakenTime);
  const hackTimeRatio = weakenTime / hackTime;
  const growTimeRatio = weakenTime / growTime;
  
  // Calculate how many grow threads needed per hack thread
  // This is based on how much money we want to hack
  const hackThreadsBase = 1;
  const moneyPerHackThread = ns.getServerMaxMoney(target) * ns.hackAnalyze(target);
  
  // Estimate grow threads needed (simplified - actual varies with server state)
  // Rule of thumb: need ~2-3x more grow threads than hack threads for 5% steal
  const growMultiplier = Math.max(2, 1 / hackPercent);
  const growThreadsBase = Math.ceil(hackThreadsBase * growMultiplier);
  
  // Calculate weaken threads needed to counteract security
  const securityFromHack = hackThreadsBase * HACK_SECURITY;
  const securityFromGrow = growThreadsBase * GROW_SECURITY;
  const totalSecurity = securityFromHack + securityFromGrow;
  const weakenThreadsBase = Math.ceil(totalSecurity / WEAKEN_AMOUNT);
  
  // Calculate thread ratios (normalized to hack threads = 1)
  const totalThreadsBase = hackThreadsBase + growThreadsBase + weakenThreadsBase;
  const hackRatio = hackThreadsBase / totalThreadsBase;
  const growRatio = growThreadsBase / totalThreadsBase;
  const weakenRatio = weakenThreadsBase / totalThreadsBase;

  // Display analysis
  ns.tprint("");
  ns.tprint("═══════════════════════════════════════════════════════════════");
  ns.tprint(`  SMART BATCHER: ${target}`);
  ns.tprint("═══════════════════════════════════════════════════════════════");
  ns.tprint(`\n📊 Timing Analysis:`);
  ns.tprint(`  Hack Time:   ${(hackTime/1000).toFixed(2)}s`);
  ns.tprint(`  Grow Time:   ${(growTime/1000).toFixed(2)}s`);
  ns.tprint(`  Weaken Time: ${(weakenTime/1000).toFixed(2)}s (longest)`);
  ns.tprint(`  Batch Window: ${(batchWindow/1000).toFixed(2)}s`);
  ns.tprint(`\n⚖️  Optimal Thread Ratios:`);
  ns.tprint(`  Hack:   ${(hackRatio * 100).toFixed(1)}% (base: ${hackThreadsBase})`);
  ns.tprint(`  Grow:   ${(growRatio * 100).toFixed(1)}% (base: ${growThreadsBase})`);
  ns.tprint(`  Weaken: ${(weakenRatio * 100).toFixed(1)}% (base: ${weakenThreadsBase})`);
  ns.tprint(`\n🎯 Target: Hack ${(hackPercent * 100).toFixed(1)}% of server money per batch`);
  ns.tprint(`  Money per hack thread: ${formatNumber(ns, moneyPerHackThread)}`);
  ns.tprint(`  Timing efficiency: ${(batchWindow / (hackTime + growTime + weakenTime) * 100).toFixed(1)}%`);
  ns.tprint("");
  ns.tprint("═══════════════════════════════════════════════════════════════");
  
  if (dryRun) {
    ns.tprint("");
    ns.tprint("🔍 DRY RUN MODE - No scripts will be started");
    ns.tprint("");
  }

  await ns.sleep(100);

  // BFS to get all reachable hosts
  const visited = new Set();
  const q = ["home"];
  const hosts = [];
  while (q.length) {
    const h = q.shift();
    if (visited.has(h)) continue;
    visited.add(h);
    hosts.push(h);
    for (const n of ns.scan(h)) if (!visited.has(n)) q.push(n);
  }

  // Helper to attempt opening ports & nuke (best-effort)
  function tryOpenAndNuke(h) {
    try {
      if (!ns.hasRootAccess(h)) {
        if (ns.fileExists("BruteSSH.exe", host)) ns.brutessh(h);
        if (ns.fileExists("FTPCrack.exe", host)) ns.ftpcrack(h);
        if (ns.fileExists("relaySMTP.exe", host)) ns.relaysmtp(h);
        if (ns.fileExists("HTTPWorm.exe", host)) ns.httpworm(h);
        if (ns.fileExists("SQLInject.exe", host)) ns.sqlinject(h);
        try { ns.nuke(h); } catch (e) { /* ignore */ }
      }
    } catch (e) {
      // best-effort; ignore errors
    }
  }

  // Track totals for summary
  let totalHackThreads = 0;
  let totalGrowThreads = 0;
  let totalWeakenThreads = 0;
  let serversDeployed = 0;

  // Deploy loop
  for (const h of hosts) {
    // skip home unless explicitly included
    if (h === "home" && !includeHome) {
      continue;
    }

    // Check root & try nuke if needed
    if (!ns.hasRootAccess(h)) {
      tryOpenAndNuke(h);
    }

    if (!ns.hasRootAccess(h)) {
      log(`Info: ${h} - NO ROOT (skipped)`);
      continue;
    }

    // Ensure helpers exist on the target: copy from current host to target
    try {
      if (!dryRun) {
        const ok = ns.scp(helpers, h, host);
        if (!ok) {
          log(`WARN: scp failed for ${h} (helpers not copied).`);
        }
      }
    } catch (e) {
      log(`WARN: scp error to ${h}: ${e}`);
    }

    // Kill existing helper processes on the remote host
    try {
      const procs = ns.ps(h);
      for (const p of procs) {
        if (helpers.includes(p.filename)) {
          if (!dryRun) {
            try { ns.kill(p.filename, h); } catch (e) { /* ignore */ }
          }
        }
      }
      if (!dryRun) await ns.sleep(50);
    } catch (e) {
      log(`WARN: failed to inspect/kill procs on ${h}: ${e}`);
    }

    // Compute available RAM
    let maxRam = ns.getServerMaxRam(h);
    let usedRam = ns.getServerUsedRam(h);
    let freeRam = Math.max(0, maxRam - usedRam);

    // Get RAM cost for each script
    const hackRam = ns.getScriptRam(hackScript, h);
    const growRam = ns.getScriptRam(growScript, h);
    const weakenRam = ns.getScriptRam(weakenScript, h);

    if (!hackRam || !growRam || !weakenRam || isNaN(hackRam) || isNaN(growRam) || isNaN(weakenRam)) {
      logError(`ERROR: cannot determine script RAM on ${h}.`);
      continue;
    }

    // Calculate thread allocation based on available RAM and ratios
    // We need to solve for a scaling factor that maximizes threads while staying within RAM
    // Total RAM = hackThreads * hackRam + growThreads * growRam + weakenThreads * weakenRam
    // where hackThreads = scale * hackRatio, growThreads = scale * growRatio, etc.
    // So: freeRam = scale * (hackRatio * hackRam + growRatio * growRam + weakenRatio * weakenRam)
    const ramPerScaleUnit = (hackRatio * hackRam) + (growRatio * growRam) + (weakenRatio * weakenRam);
    const scale = Math.floor(freeRam / ramPerScaleUnit);

    // Calculate individual thread counts, ensuring at least 1 thread each
    let hackThreads = Math.max(1, Math.floor(scale * hackRatio));
    let growThreads = Math.max(1, Math.floor(scale * growRatio));
    let weakenThreads = Math.max(1, Math.floor(scale * weakenRatio));

    // Verify we don't exceed available RAM (adjust if needed due to rounding + Math.max)
    let totalRamNeeded = (hackThreads * hackRam) + (growThreads * growRam) + (weakenThreads * weakenRam);
    while (totalRamNeeded > freeRam && (hackThreads > 1 || growThreads > 1 || weakenThreads > 1)) {
      // Reduce the largest thread count by 1
      if (hackThreads * hackRam >= growThreads * growRam && hackThreads * hackRam >= weakenThreads * weakenRam && hackThreads > 1) {
        hackThreads--;
      } else if (growThreads * growRam >= weakenThreads * weakenRam && growThreads > 1) {
        growThreads--;
      } else if (weakenThreads > 1) {
        weakenThreads--;
      }
      totalRamNeeded = (hackThreads * hackRam) + (growThreads * growRam) + (weakenThreads * weakenRam);
    }

    // Skip if we can't fit minimum threads
    if (hackThreads < 1 || growThreads < 1 || weakenThreads < 1) {
      log(`${h}: insufficient RAM for minimum threads - Skipping.`);
      continue;
    }

    const totalThreads = hackThreads + growThreads + weakenThreads;
    log(`${h}: ${freeRam.toFixed(2)}GB free => ${totalThreads} threads => h${hackThreads}/g${growThreads}/w${weakenThreads}`);

    // Start helpers on remote host
    if (dryRun) {
      log(`DRY: would run on ${h}: ${weakenScript} x${weakenThreads}, ${growScript} x${growThreads}, ${hackScript} x${hackThreads}`);
      totalHackThreads += hackThreads;
      totalGrowThreads += growThreads;
      totalWeakenThreads += weakenThreads;
      serversDeployed++;
      continue;
    }

    try {
      if (weakenThreads > 0) {
        const pid = ns.exec(weakenScript, h, weakenThreads, target);
        if (pid === 0) log(`ERROR: failed to start ${weakenScript} on ${h}`);
        else {
          log(`✓ Started ${weakenScript} on ${h} (${weakenThreads} threads, pid ${pid})`);
          totalWeakenThreads += weakenThreads;
        }
        await ns.sleep(30);
      }
      if (growThreads > 0) {
        const pid = ns.exec(growScript, h, growThreads, target);
        if (pid === 0) log(`ERROR: failed to start ${growScript} on ${h}`);
        else {
          log(`✓ Started ${growScript} on ${h} (${growThreads} threads, pid ${pid})`);
          totalGrowThreads += growThreads;
        }
        await ns.sleep(30);
      }
      if (hackThreads > 0) {
        const pid = ns.exec(hackScript, h, hackThreads, target);
        if (pid === 0) log(`ERROR: failed to start ${hackScript} on ${h}`);
        else {
          log(`✓ Started ${hackScript} on ${h} (${hackThreads} threads, pid ${pid})`);
          totalHackThreads += hackThreads;
        }
      }
      serversDeployed++;
    } catch (e) {
      logError(`ERROR launching helpers on ${h}: ${e}`);
    }

    await ns.sleep(40);
  } // end for hosts

  // Final summary
  ns.tprint("");
  ns.tprint("═══════════════════════════════════════════════════════════════");
  ns.tprint("  DEPLOYMENT SUMMARY");
  ns.tprint("═══════════════════════════════════════════════════════════════");
  ns.tprint(`\n📍 Target Server: ${target}`);
  ns.tprint(`🖥️  Servers Deployed: ${serversDeployed}`);
  ns.tprint(`\n⚡ Total Thread Allocation:`);
  ns.tprint(`  Hack Threads:   ${totalHackThreads.toString().padStart(6)} (${(totalHackThreads / (totalHackThreads + totalGrowThreads + totalWeakenThreads) * 100).toFixed(1)}%)`);
  ns.tprint(`  Grow Threads:   ${totalGrowThreads.toString().padStart(6)} (${(totalGrowThreads / (totalHackThreads + totalGrowThreads + totalWeakenThreads) * 100).toFixed(1)}%)`);
  ns.tprint(`  Weaken Threads: ${totalWeakenThreads.toString().padStart(6)} (${(totalWeakenThreads / (totalHackThreads + totalGrowThreads + totalWeakenThreads) * 100).toFixed(1)}%)`);
  ns.tprint(`  Total Threads:  ${(totalHackThreads + totalGrowThreads + totalWeakenThreads).toString().padStart(6)}`);
  
  // Calculate expected production
  const batchesPerMinute = 60000 / (batchWindow * 1.25);
  const expectedPerSec = totalHackThreads * moneyPerHackThread * (1000 / (batchWindow * 1.25));
  
  ns.tprint(`\n💰 Expected Production (once server prepped):`);
  ns.tprint(`  Batches/min: ${batchesPerMinute.toFixed(2)}`);
  ns.tprint(`  Income rate: ${formatNumber(ns, expectedPerSec)}/s`);
  ns.tprint(`  Income rate: ${formatNumber(ns, expectedPerSec * 60)}/min`);
  ns.tprint(`  Income rate: ${formatNumber(ns, expectedPerSec * 3600)}/hr`);
  
  ns.tprint("");
  ns.tprint("═══════════════════════════════════════════════════════════════");
  ns.tprint("✅ smart-batcher deployment complete!");
  ns.tprint("═══════════════════════════════════════════════════════════════");
  ns.tprint("");
}

/**
 * Format number as currency with compatibility for both v2.x and v3.x
 * @param {NS} ns
 * @param {number} v - Value to format
 */
function formatNumber(ns, v) {
  // Try new format.number (v3.x) first
  try {
    if (ns.format && ns.format.number) {
      return ns.format.number(v, "$0.00a");
    }
  } catch (e) {
    // Fall through to old method
  }
  
  // Try old formatNumber (v2.x)
  try {
    return ns.formatNumber(v, 2);
  } catch (e) {
    // Manual fallback if both methods fail
    if (v >= 1e9) return `$${(v/1e9).toFixed(2)}b`;
    if (v >= 1e6) return `$${(v/1e6).toFixed(2)}m`;
    if (v >= 1e3) return `$${(v/1e3).toFixed(2)}k`;
    return `$${v.toFixed(2)}`;
  }
}
