/** list-pservs.js
 * List all purchased servers and their status.
 * Usage: run list-pservs.js
 */

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("sleep");

  const pservs = ns.getPurchasedServers();
  
  ns.tprint("Purchased Servers:");
  ns.tprint("Name | RAM | Used | Free | Root | Money");
  ns.tprint("-----|-----|------|------|------|------");

  for (const pserv of pservs) {
    try {
      const maxRam = ns.getServerMaxRam(pserv);
      const usedRam = ns.getServerUsedRam(pserv);
      const freeRam = maxRam - usedRam;
      const hasRoot = ns.hasRootAccess(pserv);
      const money = ns.getServerMoneyAvailable(pserv);
      
      ns.tprint(`${pserv} | ${maxRam}GB | ${usedRam.toFixed(2)}GB | ${freeRam.toFixed(2)}GB | ${hasRoot ? "YES" : "NO"} | ${ns.nFormat(money, "$0.00a")}`);
    } catch (e) {
      ns.tprint(`${pserv} | ERROR: ${e}`);
    }
  }
}
