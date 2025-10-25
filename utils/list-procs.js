/** list-procs.js
 * List all running processes across all servers.
 * Usage: run list-procs.js
 */

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("sleep");
  ns.disableLog("scan");

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

  ns.tprint("Running processes across all servers:");
  ns.tprint("Server | Script | Threads | RAM | PID");
  ns.tprint("-------|--------|---------|-----|-----");

  for (const host of servers) {
    try {
      const procs = ns.ps(host);
      for (const proc of procs) {
        const ram = ns.getScriptRam(proc.filename, host) * proc.threads;
        ns.tprint(`${host} | ${proc.filename} | ${proc.threads} | ${ram.toFixed(2)}GB | ${proc.pid}`);
      }
    } catch (e) {
      // Ignore errors for servers we can't access
    }
  }
}
