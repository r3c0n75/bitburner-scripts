/** simple-batcher.js
 * Deploy attack helpers across reachable servers.
 *
 * Usage:
 *   run simple-batcher.js <target> [capThreads] [--include-home] [--quiet] [--dry]
 *
 * Notes:
 * - This script copies helper scripts from the host it is run on to targets.
 * - Helpers required on the running host:
 *     attack-hack.js, attack-grow.js, attack-weaken.js
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
    ns.tprint("Usage: run simple-batcher.js <target> [capThreads] [--include-home] [--quiet] [--dry]");
    return;
  }

  // parse numeric cap (if present as next arg and not a flag)
  let capThreads = Infinity;
  if (args.length && typeof args[0] === "number") {
    const maybeNum = Number(args[0]);
    if (!isNaN(maybeNum) && isFinite(maybeNum)) {
      capThreads = Math.floor(maybeNum);
      args.shift();
    }
  }

  // parse flags
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

  // Ensure helpers exist on the host running the batcher (source for scp)
  for (const f of helpers) {
    if (!ns.fileExists(f, host)) {
      logError(`ERROR: helper missing on ${host}: ${f}. Place the helper files on the server running this script and retry.`);
      return;
    }
  }

  log(`simple-batcher: target=${target} cap=${isFinite(capThreads) ? capThreads : "none"} includeHome=${includeHome} quiet=${quiet} dry=${dryRun}`);
  await ns.sleep(20);

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
        if (ns.fileExists("NUKE.exe", host)) {
          try { ns.nuke(h); } catch (e) { /* ignore */ }
        } else {
          // NUKE.exe is a script on home in older versions; use ns.nuke if possible
          try { ns.nuke(h); } catch (e) { /* ignore */ }
        }
      }
    } catch (e) {
      // best-effort; ignore errors
    }
  }

  // Deploy loop
  for (const h of hosts) {
    // skip home unless explicitly included
    if (h === "home" && !includeHome) {
      continue;
    }

    // Dry-run: just show what would happen
    if (dryRun) {
      log(`DRY: would process host=${h}`);
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
      } else {
        log(`DRY: would scp helpers to ${h}`);
      }
    } catch (e) {
      log(`WARN: scp error to ${h}: ${e}`);
    }

    // Kill existing helper processes on the remote host to avoid duplication
    try {
      const procs = ns.ps(h);
      let found = false;
      for (const p of procs) {
        if (helpers.includes(p.filename)) {
          found = true;
          if (!dryRun) {
            try { ns.kill(p.filename, h); } catch (e) { /* ignore */ }
          }
        }
      }
      if (found) {
        log(`Info: ${h} - attempted kill of existing helper processes.`);
        if (!dryRun) await ns.sleep(80);
      }
    } catch (e) {
      log(`WARN: failed to inspect/kill procs on ${h}: ${e}`);
    }

    // Compute available RAM and how many threads we can run
    let maxRam = ns.getServerMaxRam(h);
    let usedRam = ns.getServerUsedRam(h);
    let freeRam = Math.max(0, maxRam - usedRam);

    const ramPerThread = ns.getScriptRam(hackScript, h); // scriptRam on target
    if (!ramPerThread || isNaN(ramPerThread) || ramPerThread <= 0) {
      logError(`ERROR: cannot determine script RAM for ${hackScript} on ${h}.`);
      continue;
    }

    // thread calculation uses caller cap (capThreads) per host
    let threads = Math.floor(freeRam / ramPerThread);
    if (isFinite(capThreads)) threads = Math.min(threads, capThreads);

    if (threads < 1) {
      log(`${h}: insufficient RAM (${freeRam.toFixed(2)}GB < ${ramPerThread.toFixed(2)}GB) - Skipping.`);
      continue;
    }

    // split threads into hack/grow/weaken (simple heuristic)
    const hackThreads = Math.max(1, Math.floor(threads * 0.25));
    const growThreads = Math.max(1, Math.floor(threads * 0.45));
    const weakenThreads = Math.max(1, threads - hackThreads - growThreads);

    log(`${h}: free=${freeRam.toFixed(2)}GB threads=${threads} => h${hackThreads}/g${growThreads}/w${weakenThreads}`);

    // Start helpers on remote host
    if (dryRun) {
      log(`DRY: would run on ${h}: ${weakenScript} x${weakenThreads}, ${growScript} x${growThreads}, ${hackScript} x${hackThreads}`);
      continue;
    }

    try {
      if (weakenThreads > 0) {
        const pid = ns.exec(weakenScript, h, weakenThreads, target);
        if (pid === 0) log(`ERROR: failed to start ${weakenScript} on ${h}`);
        else log(`Started ${weakenScript} on ${h} threads=${weakenThreads} pid=${pid}`);
        await ns.sleep(50);
      }
      if (growThreads > 0) {
        const pid = ns.exec(growScript, h, growThreads, target);
        if (pid === 0) log(`ERROR: failed to start ${growScript} on ${h}`);
        else log(`Started ${growScript} on ${h} threads=${growThreads} pid=${pid}`);
        await ns.sleep(50);
      }
      if (hackThreads > 0) {
        const pid = ns.exec(hackScript, h, hackThreads, target);
        if (pid === 0) log(`ERROR: failed to start ${hackScript} on ${h}`);
        else log(`Started ${hackScript} on ${h} threads=${hackThreads} pid=${pid}`);
      }
    } catch (e) {
      logError(`ERROR launching helpers on ${h}: ${e}`);
    }

    // small pause so remote host stats update before next host
    await ns.sleep(60);
  } // end for hosts

  log("simple-batcher finished.");
}
