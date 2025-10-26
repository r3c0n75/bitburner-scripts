/** auto-deploy-all.js
 * Deploy hack-joesguns.js to all rooted servers and run as many threads as possible.
 * Usage: run auto-deploy-all.js [capThreads]
 */

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("sleep");
  const script = "deploy/hack-joesguns.js";
  const capArg = ns.args.length > 0 ? Number(ns.args[0]) : Infinity;
  const capThreads = Number.isFinite(capArg) && capArg > 0 ? Math.floor(capArg) : Infinity;

  if (!ns.fileExists(script, "home")) {
    ns.tprint(`ERROR: ${script} not on home`);
    return;
  }

  // collect servers
  const visited = new Set();
  const q = ["home"];
  const servers = [];
  while (q.length) {
    const s = q.shift();
    if (visited.has(s)) continue;
    visited.add(s);
    servers.push(s);
    for (const n of ns.scan(s)) q.push(n);
  }

  for (const host of servers) {
    if (!ns.hasRootAccess(host)) continue;
    if (host === "home") continue;
    // copy if needed
    if (!ns.fileExists(script, host)) ns.scp(script, host);
    const ramPer = ns.getScriptRam(script, host);
    const free = Math.max(0, ns.getServerMaxRam(host) - ns.getServerUsedRam(host));
    if (free < ramPer) { ns.tprint(`${host}: insufficient RAM (${free} < ${ramPer})`); continue; }
    let threads = Math.floor(free / ramPer);
    threads = Math.min(threads, capThreads);
    const args = ["-t", String(threads)];
    const pid = ns.exec(script, host, threads, ...args);
    if (pid > 0) ns.tprint(`Started ${script} on ${host} threads=${threads} pid=${pid}`);
    else ns.tprint(`Failed to start on ${host}`);
    await ns.sleep(50);
  }
}
