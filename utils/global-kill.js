/** global-kill.js
 * Kill all running scripts across all servers.
 * Usage: run global-kill.js
 */

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("sleep");
  ns.disableLog("scan");
  ns.disableLog("kill");

  const visited = new Set();
  const q = ["home"];
  const servers = [];

  // BFS to get all reachable hosts
  while (q.length) {
    const s = q.shift();
    if (visited.has(s)) continue;
    visited.add(s);
    servers.push(s);
    for (const n of ns.scan(s)) if (!visited.has(n)) q.push(n);
  }

  let totalKilled = 0;
  for (const host of servers) {
    try {
      const procs = ns.ps(host);
      for (const proc of procs) {
        if (proc.filename !== "global-kill.js") { // Don't kill ourselves
          ns.kill(proc.pid);
          totalKilled++;
        }
      }
    } catch (e) {
      // Ignore errors for servers we can't access
    }
  }

  ns.tprint(`Killed ${totalKilled} processes across ${servers.length} servers.`);
}
