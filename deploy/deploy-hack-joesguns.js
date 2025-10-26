/** deploy-hack-joesguns.js
 * Deploy hack-joesguns.js to all rooted servers.
 * Usage: run deploy-hack-joesguns.js [target]
 */

/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0] || "joesguns";
  const script = "deploy/hack-joesguns.js";
  
  ns.disableLog("sleep");
  ns.disableLog("scan");
  ns.disableLog("scp");
  ns.disableLog("exec");

  if (!ns.fileExists(script, "home")) {
    ns.tprint(`ERROR: ${script} not found on home`);
    return;
  }

  // Collect all servers
  const visited = new Set();
  const q = ["home"];
  const servers = [];
  
  while (q.length) {
    const s = q.shift();
    if (visited.has(s)) continue;
    visited.add(s);
    servers.push(s);
    for (const n of ns.scan(s)) {
      if (!visited.has(n)) q.push(n);
    }
  }

  let deployed = 0;
  let failed = 0;

  for (const host of servers) {
    if (!ns.hasRootAccess(host)) continue;
    if (host === "home") continue;

    try {
      // Copy script if needed
      if (!ns.fileExists(script, host)) {
        const copied = ns.scp(script, host);
        if (!copied) {
          ns.tprint(`Failed to copy ${script} to ${host}`);
          failed++;
          continue;
        }
      }

      // Check RAM
      const ramPer = ns.getScriptRam(script, host);
      const free = Math.max(0, ns.getServerMaxRam(host) - ns.getServerUsedRam(host));
      
      if (free < ramPer) {
        ns.tprint(`${host}: insufficient RAM (${free.toFixed(2)}GB < ${ramPer.toFixed(2)}GB)`);
        failed++;
        continue;
      }

      // Calculate threads
      const threads = Math.floor(free / ramPer);
      if (threads < 1) {
        ns.tprint(`${host}: cannot run with ${threads} threads`);
        failed++;
        continue;
      }

      // Start script
      const pid = ns.exec(script, host, threads);
      if (pid > 0) {
        ns.tprint(`Deployed ${script} on ${host} with ${threads} threads (pid: ${pid})`);
        deployed++;
      } else {
        ns.tprint(`Failed to start ${script} on ${host}`);
        failed++;
      }

      await ns.sleep(50);
    } catch (e) {
      ns.tprint(`Error deploying to ${host}: ${e}`);
      failed++;
    }
  }

  ns.tprint(`\nDeployment complete: ${deployed} successful, ${failed} failed`);
}
