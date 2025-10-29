/** batch-manager.js
 * Enhanced batch manager that roots servers and ensures smart-batcher.js runs on a purchased server.
 *
 * Usage:
 *   run batch-manager.js [target] [hackPercent] [multiplier] [pservHost] [flags...]
 *
 * Examples:
 *   run batch-manager.js joesguns 0.05 1.25 home --quiet
 *   run batch-manager.js joesguns --quiet                 # flags tolerated anywhere
 *   run batch-manager.js --quiet                           # uses defaults, quiet
 *   run batch-manager.js --quiet --no-root                # disable auto-rooting
 *
 * Features:
 *   - Periodically scans and roots new servers (every 10 cycles by default)
 *   - Manages smart-batcher.js on specified host with optimal timing-based ratios
 *   - Auto-restarts batcher if it stops
 */

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("sleep");
  ns.disableLog("getServerMaxRam");
  ns.disableLog("getServerUsedRam");
  ns.disableLog("scan");
  ns.disableLog("brutessh");
  ns.disableLog("ftpcrack");
  ns.disableLog("relaysmtp");
  ns.disableLog("httpworm");
  ns.disableLog("sqlinject");
  ns.disableLog("nuke");
  ns.disableLog("getServerNumPortsRequired");
  ns.disableLog("getServerRequiredHackingLevel");
  ns.disableLog("getHackingLevel");
  ns.disableLog("hasRootAccess");
  ns.disableLog("fileExists");
  ns.disableLog("scp");
  ns.disableLog("getScriptRam");
  ns.disableLog("exec");
  ns.disableLog("getHackTime");
  ns.disableLog("getGrowTime");
  ns.disableLog("getWeakenTime");
  ns.disableLog("ps");
  ns.disableLog("kill");

  // Raw args as provided
  const raw = ns.args.slice().map(a => (typeof a === "string" ? a : String(a)));

  // Extract flags (strings that start with --) anywhere in the args
  const flags = raw.filter(a => typeof a === "string" && a.startsWith("--"));
  // Positional args are the ones that are not flags
  const pos = raw.filter(a => !(typeof a === "string" && a.startsWith("--")));

  // Parse positionals with safe fallbacks
  const target = pos.length > 0 && pos[0] !== undefined ? String(pos[0]) : "joesguns";
  const hackPercent = pos.length > 1 ? Number(pos[1]) : 0.05; // Default 5% hack per batch
  const mult = pos.length > 2 ? Number(pos[2]) : 1.25;
  const pservHost = pos.length > 3 ? String(pos[3]) : "home";

  // Parse flags
  const enableRooting = !flags.includes("--no-root");
  const quiet = flags.includes("--quiet");

  // Forward these flags to smart-batcher.js when launching it
  const forwardFlags = flags.filter(f => f !== "--no-root"); // Don't forward --no-root

  const batcher = "batch/smart-batcher.js";

  // Logging helpers:
  // - info: Always to log window (ns.print), optionally to terminal (ns.tprint) if not quiet
  // - important: Always to both log window and terminal
  // - warn/error: Always to both log window and terminal
  const info = (...parts) => {
    const msg = parts.join(" ");
    ns.print(msg); // Always show in log window
    if (!quiet) ns.tprint(msg); // Also show in terminal unless quiet
  };
  const important = (...parts) => {
    const msg = parts.join(" ");
    ns.print(msg);
    ns.tprint(msg); // Always show in both places
  };
  const warn = (...parts) => {
    const msg = "[WARN] " + parts.join(" ");
    ns.print(msg);
    ns.tprint(msg);
  };
  const error = (...parts) => {
    const msg = "[ERR] " + parts.join(" ");
    ns.print(msg);
    ns.tprint(msg);
  };

  // Get all servers on network
  function getAllServers() {
    const visited = new Set();
    const queue = ["home"];
    const servers = [];
    
    while (queue.length > 0) {
      const host = queue.shift();
      if (visited.has(host)) continue;
      visited.add(host);
      servers.push(host);
      
      const neighbors = ns.scan(host);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
        }
      }
    }
    return servers;
  }

  // Calculate total network RAM (useful for detecting upgrades)
  function getTotalNetworkRAM() {
    const servers = getAllServers();
    let totalRAM = 0;
    for (const host of servers) {
      if (ns.hasRootAccess(host)) {
        totalRAM += ns.getServerMaxRam(host);
      }
    }
    return totalRAM;
  }

  // Rooting function - scans network and roots accessible servers
  // Returns: { newlyRooted: number, totalRooted: number }
  async function rootNewServers() {
    if (!enableRooting) return { newlyRooted: 0, totalRooted: 0 };

    try {
      const servers = getAllServers();

      // Check available port-opening programs
      const programs = [
        { name: "BruteSSH.exe", fn: ns.brutessh },
        { name: "FTPCrack.exe", fn: ns.ftpcrack },
        { name: "relaySMTP.exe", fn: ns.relaysmtp },
        { name: "HTTPWorm.exe", fn: ns.httpworm },
        { name: "SQLInject.exe", fn: ns.sqlinject }
      ];
      
      const available = programs.filter(p => ns.fileExists(p.name, "home"));
      const portCount = available.length;

      // Attempt to root servers
      let newlyRooted = 0;
      let totalRooted = 0;
      
      for (const host of servers) {
        // Skip home
        if (host === "home") continue;
        
        // Count already rooted
        if (ns.hasRootAccess(host)) {
          totalRooted++;
          continue;
        }
        
        // Check requirements
        const reqPorts = ns.getServerNumPortsRequired(host);
        const reqHack = ns.getServerRequiredHackingLevel(host);
        const playerHack = ns.getHackingLevel();
        
        // Can we root it?
        if (reqPorts > portCount || reqHack > playerHack) continue;
        
        try {
          // Open ports
          for (const prog of available) {
            prog.fn(host);
          }
          
          // Nuke it!
          ns.nuke(host);
          
          if (ns.hasRootAccess(host)) {
            important(`✓ Rooted: ${host} (Level ${reqHack}, ${reqPorts} ports)`);
            newlyRooted++;
            totalRooted++;
          }
        } catch (e) {
          // Silently ignore failures - server might not be ready yet
        }
      }

      if (newlyRooted > 0) {
        important(`Rooting scan complete: ${newlyRooted} new server(s) rooted`);
      }
      
      return { newlyRooted, totalRooted };
    } catch (e) {
      error(`Rooting scan error: ${e}`);
      return { newlyRooted: 0, totalRooted: 0 };
    }
  }

  // compute safe interval from target timings
  let hackMs = 10000, growMs = 10000, weakenMs = 10000;
  try { hackMs = Math.max(1, ns.getHackTime(target)); } catch (_) {}
  try { growMs = Math.max(1, ns.getGrowTime(target)); } catch (_) { growMs = hackMs; }
  try { weakenMs = Math.max(1, ns.getWeakenTime(target)); } catch (_) { weakenMs = hackMs; }
  const baseMs = Math.max(hackMs, growMs, weakenMs);
  const intervalMs = Math.max(2000, Math.round(baseMs * (Number.isFinite(mult) ? mult : 1.25)));

  // Startup banner - always visible in both log and terminal
  const banner = "=".repeat(60);
  ns.print(banner);
  ns.tprint(banner);
  ns.print("BATCH MANAGER v1.8.10 - Starting...");
  ns.tprint("BATCH MANAGER v1.8.10 - Starting...");
  ns.print(banner);
  ns.tprint(banner);
  info(`Target: ${target} | Host: ${pservHost} | HackPercent: ${(hackPercent*100).toFixed(1)}%`);
  info(`Interval: ${(intervalMs/1000).toFixed(2)}s | Hack Time: ${(hackMs/1000).toFixed(2)}s`);
  info(`Auto-rooting: ${enableRooting ? "ENABLED (scan every 10 cycles)" : "DISABLED"}`);
  info(`Quiet mode: ${quiet ? "ON (terminal suppressed)" : "OFF (terminal + log)"}`);
  ns.print(banner);
  ns.tprint(banner);

  // Track deployment state
  let initialDeploymentDone = false;
  let lastServerCount = 0;
  let lastTotalRAM = 0;

  // Initial rooting scan on startup
  if (enableRooting) {
    info(`Running initial server scan...`);
  }
  const initialRoot = await rootNewServers();
  lastServerCount = initialRoot.totalRooted;
  lastTotalRAM = getTotalNetworkRAM();
  if (enableRooting) {
    info(`Initial scan complete: ${initialRoot.totalRooted} server(s) rooted (${initialRoot.newlyRooted} new)`);
    info(`Total network RAM: ${lastTotalRAM.toFixed(0)}GB across rooted servers`);
  }

  let cycleCount = 0;
  while (true) {
    try {
      // Periodic rooting scan (every 10 cycles)
      cycleCount++;
      let newServersFound = false;
      
      // Quick RAM check every cycle (cheap operation)
      const currentTotalRAM = getTotalNetworkRAM();
      const ramChanged = currentTotalRAM !== lastTotalRAM;
      
      if (ramChanged && initialDeploymentDone) {
        const ramDiff = currentTotalRAM - lastTotalRAM;
        important(`✓ Network RAM changed: ${lastTotalRAM.toFixed(0)}GB → ${currentTotalRAM.toFixed(0)}GB (+${ramDiff.toFixed(0)}GB)`);
        
        // Estimate per-server breakdown for purchased servers
        const servers = getAllServers();
        const pservs = servers.filter(s => s.startsWith("pserv-"));
        const pservCount = pservs.length;
        if (pservCount > 0 && ramDiff > 0) {
          const avgIncrease = ramDiff / pservCount;
          // Calculate average current RAM per purchased server
          let totalPservRAM = 0;
          for (const pserv of pservs) {
            totalPservRAM += ns.getServerMaxRam(pserv);
          }
          const avgCurrentRAM = totalPservRAM / pservCount;
          info(`  Estimated: ${pservCount} purchased server${pservCount !== 1 ? 's' : ''} (~${avgIncrease.toFixed(0)}GB increase each, now ~${avgCurrentRAM.toFixed(0)}GB per server)`);
        }
        
        lastTotalRAM = currentTotalRAM;
        newServersFound = true; // Trigger immediate redeployment
      }
      
      // Show heartbeat every cycle if interval is long (>60s), otherwise every 5 cycles
      const heartbeatFrequency = intervalMs > 60000 ? 1 : 5;
      if (initialDeploymentDone && !ramChanged && cycleCount % heartbeatFrequency === 0 && cycleCount % 10 !== 0) {
        const nextScanIn = 10 - (cycleCount % 10);
        info(`[Cycle ${cycleCount}] Waiting... (next scan in ${nextScanIn} cycle${nextScanIn !== 1 ? 's' : ''})`);
      }
      
      // Full rooting scan every 10 cycles (expensive operation)
      if (cycleCount % 10 === 0 && enableRooting) {
        info(`[Cycle ${cycleCount}] Running server scan...`);
        const rootResult = await rootNewServers();
        
        info(`[Cycle ${cycleCount}] Scan complete: ${rootResult.totalRooted} total rooted (${rootResult.newlyRooted} new)`);
        
        // Update RAM if scan changed it
        const postScanRAM = getTotalNetworkRAM();
        if (postScanRAM !== currentTotalRAM) {
          const ramDiff = postScanRAM - currentTotalRAM;
          important(`✓ New servers rooted: +${ramDiff.toFixed(0)}GB RAM from rooting scan`);
          lastTotalRAM = postScanRAM;
        } else {
          lastTotalRAM = currentTotalRAM;
        }
        
        if (rootResult.newlyRooted > 0) {
          newServersFound = true;
          lastServerCount = rootResult.totalRooted;
        }
      } else if (!ramChanged) {
        // Update lastTotalRAM on non-scan cycles if no change detected
        lastTotalRAM = currentTotalRAM;
      }

      // Only deploy if: (1) initial deployment not done, or (2) new servers were found or (3) RAM upgraded
      const shouldDeploy = !initialDeploymentDone || newServersFound;
      
      if (!shouldDeploy) {
        // Nothing new, just wait
        await ns.sleep(intervalMs);
        continue;
      }

      // See if batcher already running on the chosen pserv - kill it if we're redeploying
      let procs = [];
      try { procs = ns.ps(pservHost); } catch (e) { procs = []; }
      const already = procs.find(p => p.filename === batcher);
      if (already && newServersFound) {
        info(`Network changes detected - killing existing batcher to redeploy...`);
        try { ns.kill(already.pid); } catch (e) { /* ignore */ }
        await ns.sleep(100);
      } else if (already && !initialDeploymentDone) {
        info(`${batcher} already running on ${pservHost} (pid ${already.pid}).`);
        await ns.sleep(intervalMs);
        continue;
      }

      // Ensure the batcher file exists on the pserv; try to scp if missing
      if (!ns.fileExists(batcher, pservHost)) {
        info(`${batcher} not found on ${pservHost}; attempting scp from ${ns.getHostname()}...`);
        try {
          // copy from current host to pservHost
          const ok = ns.scp(batcher, pservHost);
          if (!ok) {
            error(`scp failed. ${batcher} not present on ${pservHost} and cannot be copied.`);
            await ns.sleep(intervalMs);
            continue;
          } else {
            info(`scp ok: copied ${batcher} -> ${pservHost}`);
            await ns.sleep(100);
          }
        } catch (e) {
          error(`scp exception copying ${batcher} -> ${pservHost}: ${e}`);
          await ns.sleep(intervalMs);
          continue;
        }
      }

      // Check RAM on pservHost before attempting to start
      const freeRam = ns.getServerMaxRam(pservHost) - ns.getServerUsedRam(pservHost);
      const scriptRam = ns.getScriptRam(batcher, pservHost);
      if (freeRam < scriptRam) {
        error(`Insufficient RAM on ${pservHost}: free=${freeRam.toFixed(2)}GB need=${scriptRam.toFixed(2)}GB. Will retry.`);
        await ns.sleep(intervalMs);
        continue;
      }

      // Build args to pass to smart-batcher.js: target, hackPercent (if valid), then forward flags
      const args = [];
      args.push(target);
      if (isFinite(hackPercent) && hackPercent > 0 && hackPercent <= 1) {
        args.push(hackPercent);
      }
      // append forwarded flags (strings)
      for (const f of forwardFlags) args.push(f);

      // Exec the batcher on the pservHost (1 thread for the manager)
      info(`Deploying ${batcher} on ${pservHost}...`);
      const pid = ns.exec(batcher, pservHost, 1, ...args);
      if (pid > 0) {
        important(`✓ Deployed ${batcher} on ${pservHost} (pid=${pid})`);
        info(`  Target: ${target}, HackPercent: ${hackPercent}, Args: ${JSON.stringify(args)}`);
        // Wait for smart-batcher to complete (it's a one-shot script)
        await ns.sleep(2000); // Give it time to start
        // Mark initial deployment as done
        if (!initialDeploymentDone) {
          initialDeploymentDone = true;
          info(`Initial deployment complete. Monitoring for new servers...`);
          info(`Monitoring mode: interval=${(intervalMs/1000).toFixed(0)}s, scan every 10 cycles (~${((intervalMs*10)/60000).toFixed(1)} min)`);
        }
      } else {
        error(`Failed to start ${batcher} on ${pservHost} via exec(). Possible causes: insufficient RAM, invalid args, or file missing.`);
        error(`DEBUG: ${pservHost} freeRam=${freeRam.toFixed(2)}GB scriptRam=${scriptRam.toFixed(2)}GB fileExists=${ns.fileExists(batcher, pservHost)}`);
      }
    } catch (e) {
      error(`batch-manager exception: ${e}`);
    }

    await ns.sleep(intervalMs);
  }
}
