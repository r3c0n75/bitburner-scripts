/** production-monitor.js
 * Measures player money change over a given interval (seconds).
 * Usage:
 *   run production-monitor.js 60    # measure for 60 seconds
 */

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("sleep");
  const secs = Number(ns.args[0]) || 60;
  const start = ns.getPlayer().money;
  ns.tprint(`Monitoring production for ${secs}s... start=${ns.nFormat ? ns.nFormat(start, "$0.00a") : start}`);
  for (let i = 0; i < secs; i++) {
    await ns.sleep(1000);
    // optional per-second print:
    // ns.tprint(`${i+1}s`);
  }
  const end = ns.getPlayer().money;
  const gained = end - start;
  const perSec = gained / secs;
  ns.tprint(`Done: gained ${ns.nFormat ? ns.nFormat(gained, "$0.00a") : gained} over ${secs}s (${ns.nFormat ? ns.nFormat(perSec, "$0.00a") : perSec}/s)`);
}
