/** batch-manager.js
 * Quiet-aware batch manager that ensures simple-batcher.js runs on a purchased server.
 *
 * Usage:
 *   run batch-manager.js [target] [capPerHost] [multiplier] [pservHost] [flags...]
 *
 * Examples:
 *   run batch-manager.js joesguns 12 1.25 home --quiet
 *   run batch-manager.js joesguns --quiet                 # flags tolerated anywhere
 *   run batch-manager.js --quiet                           # uses defaults, quiet
 */

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("sleep");
  ns.disableLog("getServerMaxRam");
  ns.disableLog("getServerUsedRam");
  ns.disableLog("scan");

  // Raw args as provided
  const raw = ns.args.slice().map(a => (typeof a === "string" ? a : String(a)));

  // Extract flags (strings that start with --) anywhere in the args
  const flags = raw.filter(a => typeof a === "string" && a.startsWith("--"));
  // Positional args are the ones that are not flags
  const pos = raw.filter(a => !(typeof a === "string" && a.startsWith("--")));

  // Parse positionals with safe fallbacks
  const target = pos.length > 0 && pos[0] !== undefined ? String(pos[0]) : "joesguns";
  const capPerHost = pos.length > 1 ? Number(pos[1]) : Infinity;
  const mult = pos.length > 2 ? Number(pos[2]) : 1.25;
  const pservHost = pos.length > 3 ? String(pos[3]) : "home";

  // Forward these flags to simple-batcher.js when launching it
  const forwardFlags = flags.slice(); // array of strings like '--quiet'

  const batcher = "simple-batcher.js";

  // Logging helpers: normal info -> ns.print (quiet); warnings/errors -> ns.tprint
  const info = (...parts) => ns.print(parts.join(" "));
  const warn = (...parts) => ns.tprint("[WARN] " + parts.join(" "));
  const error = (...parts) => ns.tprint("[ERR] " + parts.join(" "));

  // compute safe interval from target timings
  let hackMs = 10000, growMs = 10000, weakenMs = 10000;
  try { hackMs = Math.max(1, ns.getHackTime(target)); } catch (_) {}
  try { growMs = Math.max(1, ns.getGrowTime(target)); } catch (_) { growMs = hackMs; }
  try { weakenMs = Math.max(1, ns.getWeakenTime(target)); } catch (_) { weakenMs = hackMs; }
  const baseMs = Math.max(hackMs, growMs, weakenMs);
  const intervalMs = Math.max(2000, Math.round(baseMs * (Number.isFinite(mult) ? mult : 1.25)));

  info(`Batch manager: target=${target} interval=${(intervalMs/1000).toFixed(2)}s (hack=${(hackMs/1000).toFixed(2)}s)`);
  info(`Batch manager: ensure ${batcher} runs on ${pservHost}. Forwarding flags: ${JSON.stringify(forwardFlags)}`);

  while (true) {
    try {
      // See if batcher already running on the chosen pserv
      let procs = [];
      try { procs = ns.ps(pservHost); } catch (e) { procs = []; }
      const already = procs.find(p => p.filename === batcher);
      if (already) {
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

      // Build args to pass to simple-batcher.js: target, capPerHost (if numeric), then forward flags
      const args = [];
      args.push(target);
      if (isFinite(capPerHost)) args.push(String(capPerHost));
      // append forwarded flags (strings)
      for (const f of forwardFlags) args.push(f);

      // Exec the batcher on the pservHost (1 thread for the manager)
      const pid = ns.exec(batcher, pservHost, 1, ...args);
      if (pid > 0) {
        info(`Started ${batcher} on ${pservHost} pid=${pid} args=${JSON.stringify(args)}`);
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
