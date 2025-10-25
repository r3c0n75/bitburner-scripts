/** replace-pservs-no-copy.js
 * Replace purchased servers without copying scripts.
 * Usage: run replace-pservs-no-copy.js
 */

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("sleep");
  ns.disableLog("kill");

  const pservs = ns.getPurchasedServers();
  const ram = 8; // 8GB RAM
  const cost = ns.getPurchasedServerCost(ram);

  ns.tprint(`Replacing ${pservs.length} purchased servers with ${ram}GB RAM`);
  ns.tprint(`Cost per server: ${ns.nFormat(cost, "$0.00a")}`);
  ns.tprint(`Total cost: ${ns.nFormat(cost * pservs.length, "$0.00a")}`);

  if (ns.getPlayer().money < cost * pservs.length) {
    ns.tprint(`Insufficient funds! Need ${ns.nFormat(cost * pservs.length, "$0.00a")}`);
    return;
  }

  let replaced = 0;
  let failed = 0;

  for (const pserv of pservs) {
    try {
      // Kill any running scripts
      ns.killall(pserv);
      
      // Delete the server
      const deleted = ns.deleteServer(pserv);
      if (!deleted) {
        ns.tprint(`Failed to delete ${pserv}`);
        failed++;
        continue;
      }

      // Purchase new server with same name
      const purchased = ns.purchaseServer(pserv, ram);
      if (purchased) {
        ns.tprint(`Replaced ${pserv} with ${ram}GB RAM`);
        replaced++;
      } else {
        ns.tprint(`Failed to purchase new ${pserv}`);
        failed++;
      }

      await ns.sleep(100);
    } catch (e) {
      ns.tprint(`Error replacing ${pserv}: ${e}`);
      failed++;
    }
  }

  ns.tprint(`\nReplacement complete: ${replaced} successful, ${failed} failed`);
}
