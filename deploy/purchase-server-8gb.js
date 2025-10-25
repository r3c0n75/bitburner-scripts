/** purchase-server-8gb.js
 * Purchase servers with 8GB RAM.
 * Usage: run purchase-server-8gb.js
 */

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("sleep");

  const ram = 8;
  const cost = ns.getPurchasedServerCost(ram);
  const maxServers = ns.getPurchasedServerLimit();
  const currentServers = ns.getPurchasedServers().length;

  ns.tprint(`Cost for ${ram}GB server: ${ns.nFormat(cost, "$0.00a")}`);
  ns.tprint(`Current servers: ${currentServers}/${maxServers}`);

  if (currentServers >= maxServers) {
    ns.tprint("Maximum number of servers reached!");
    return;
  }

  if (ns.getPlayer().money < cost) {
    ns.tprint(`Insufficient funds! Need ${ns.nFormat(cost, "$0.00a")}`);
    return;
  }

  // Find next available server name
  let serverNum = 0;
  let serverName;
  do {
    serverNum++;
    serverName = `pserv-${serverNum}`;
  } while (ns.serverExists(serverName));

  const success = ns.purchaseServer(serverName, ram);
  if (success) {
    ns.tprint(`Successfully purchased ${serverName} with ${ram}GB RAM`);
  } else {
    ns.tprint(`Failed to purchase server ${serverName}`);
  }
}
