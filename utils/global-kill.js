/** global-kill.js
 * Kill all running scripts across all servers.
 * Usage: run global-kill.js
 */

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("sleep");
  ns.disableLog("scan");
  ns.disableLog("killall");

  const visited = new Set();
  const q = ["home"];
  const servers = [];
  const currentHost = ns.getHostname();

  // BFS to get all reachable hosts
  while (q.length) {
    const s = q.shift();
    if (visited.has(s)) continue;
    visited.add(s);
    servers.push(s);
    for (const n of ns.scan(s)) if (!visited.has(n)) q.push(n);
  }

  let totalKilled = 0;
  let serversProcessed = 0;

  // Kill all processes on other servers first
  for (const host of servers) {
    if (host === currentHost) continue; // Save current host for last
    
    try {
      const procs = ns.ps(host);
      const killed = ns.killall(host);
      if (killed) {
        totalKilled += procs.length;
        serversProcessed++;
        await ns.sleep(50); // Small delay to ensure kills are processed
      }
    } catch (e) {
      // Ignore errors for servers we can't access
    }
  }

  // Finally, kill everything on current host except this script
  try {
    const procs = ns.ps(currentHost);
    for (const proc of procs) {
      if (proc.filename !== "global-kill.js" && proc.pid !== ns.pid) {
        ns.kill(proc.pid);
        totalKilled++;
        await ns.sleep(10); // Small delay between kills
      }
    }
  } catch (e) {
    // Ignore errors
  }

  ns.tprint(`✓ Killed ${totalKilled} processes across ${serversProcessed + 1} servers.`);
}
