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

  // Logging helpers: normal info -> ns.print (quiet); warnings/errors -> ns.tprint
  const info = (...parts) => {
    const msg = parts.join(" ");
    if (quiet) ns.print(msg); else ns.tprint(msg);
  };
  const important = (...parts) => ns.tprint(parts.join(" ")); // Always show, even in quiet mode
  const warn = (...parts) => ns.tprint("[WARN] " + parts.join(" "));
  const error = (...parts) => ns.tprint("[ERR] " + parts.join(" "));

  // Rooting function - scans network and roots accessible servers
  // Returns: { newlyRooted: number, totalRooted: number }
  async function rootNewServers() {
    if (!enableRooting) return { newlyRooted: 0, totalRooted: 0 };

    try {
      // Scan entire network
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

  info(`Batch manager: target=${target} interval=${(intervalMs/1000).toFixed(2)}s (hack=${(hackMs/1000).toFixed(2)}s)`);
  info(`Batch manager: ensure ${batcher} runs on ${pservHost}. Forwarding flags: ${JSON.stringify(forwardFlags)}`);
  if (enableRooting) {
    info(`Batch manager: auto-rooting ENABLED (scan every 10 cycles). Use --no-root to disable.`);
  } else {
    info(`Batch manager: auto-rooting DISABLED`);
  }

  // Track deployment state
  let initialDeploymentDone = false;
  let lastServerCount = 0;

  // Initial rooting scan on startup
  const initialRoot = await rootNewServers();
  lastServerCount = initialRoot.totalRooted;

  let cycleCount = 0;
  while (true) {
    try {
      // Periodic rooting scan (every 10 cycles)
      cycleCount++;
      let newServersFound = false;
      
      if (cycleCount % 10 === 0) {
        const rootResult = await rootNewServers();
        if (rootResult.newlyRooted > 0) {
          newServersFound = true;
          lastServerCount = rootResult.totalRooted;
        }
      }

      // Only deploy if: (1) initial deployment not done, or (2) new servers were found
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
        info(`New servers found - killing existing batcher to redeploy...`);
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
      const pid = ns.exec(batcher, pservHost, 1, ...args);
      if (pid > 0) {
        info(`Started ${batcher} on ${pservHost} pid=${pid} args=${JSON.stringify(args)}`);
        // Wait for smart-batcher to complete (it's a one-shot script)
        await ns.sleep(2000); // Give it time to start
        // Mark initial deployment as done
        if (!initialDeploymentDone) {
          initialDeploymentDone = true;
          info(`Initial deployment complete. Monitoring for new servers...`);
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
