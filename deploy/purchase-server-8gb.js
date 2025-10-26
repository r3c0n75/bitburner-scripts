/** purchase-server-8gb.js
 * Purchase servers with 8GB RAM (or custom amount).
 * 
 * Usage:
 *   run purchase-server-8gb.js              # Buy all affordable 8GB servers
 *   run purchase-server-8gb.js 5            # Buy exactly 5 servers (8GB)
 *   run purchase-server-8gb.js 10 16        # Buy 10 servers with 16GB each
 *   run purchase-server-8gb.js --all        # Buy until you hit the 25 server limit
 *   run purchase-server-8gb.js --all 32     # Buy max servers with 32GB each
 */

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("sleep");

  // Parse arguments
  const buyAll = ns.args.includes("--all");
  let countToBuy = buyAll ? Infinity : (ns.args[0] && !isNaN(ns.args[0]) ? Number(ns.args[0]) : Infinity);
  const ram = ns.args[1] && !isNaN(ns.args[1]) ? Number(ns.args[1]) : 
               (ns.args[0] && !isNaN(ns.args[0]) && ns.args.length === 1 ? 8 : 
               (ns.args[0] === "--all" && ns.args[1] ? Number(ns.args[1]) : 8));

  const cost = ns.getPurchasedServerCost(ram);
  const maxServers = ns.getPurchasedServerLimit();
  const currentServers = ns.getPurchasedServers().length;
  const availableSlots = maxServers - currentServers;

  ns.tprint("═══════════════════════════════════════════════════");
  ns.tprint("  SERVER PURCHASE");
  ns.tprint("═══════════════════════════════════════════════════");
  ns.tprint(`RAM per server: ${ram}GB`);
  ns.tprint(`Cost per server: ${ns.nFormat(cost, "$0.00a")}`);
  ns.tprint(`Current servers: ${currentServers}/${maxServers}`);
  ns.tprint(`Available slots: ${availableSlots}`);
  ns.tprint("");

  if (currentServers >= maxServers) {
    ns.tprint("✗ Maximum number of servers reached (25/25)!");
    return;
  }

  // Calculate how many we can actually buy
  const playerMoney = ns.getPlayer().money;
  const affordableCount = Math.floor(playerMoney / cost);
  
  ns.tprint(`Your money: ${ns.nFormat(playerMoney, "$0.00a")}`);
  ns.tprint(`Can afford: ${affordableCount} servers`);
  ns.tprint("");

  if (affordableCount === 0) {
    ns.tprint(`✗ Insufficient funds! Need ${ns.nFormat(cost, "$0.00a")} for one server.`);
    return;
  }

  // Determine actual number to buy
  const actualCount = Math.min(countToBuy, affordableCount, availableSlots);
  
  if (actualCount === 0) {
    ns.tprint("✗ No servers to purchase!");
    return;
  }

  ns.tprint(`Purchasing ${actualCount} server(s)...`);
  ns.tprint("─── PURCHASE PHASE ───");
  
  let purchased = 0;
  let failed = 0;

  for (let i = 0; i < actualCount; i++) {
    // Check if we still have money
    if (ns.getPlayer().money < cost) {
      ns.tprint(`✗ Ran out of money after ${purchased} purchases`);
      break;
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
      ns.tprint(`✓ Purchased ${serverName} (${ram}GB) - ${ns.nFormat(cost, "$0.00a")}`);
      purchased++;
    } else {
      ns.tprint(`✗ Failed to purchase ${serverName}`);
      failed++;
    }
    
    await ns.sleep(50); // Small delay between purchases
  }

  const newTotal = ns.getPurchasedServers().length;
  const spent = purchased * cost;

  ns.tprint("");
  ns.tprint("═══════════════════════════════════════════════════");
  ns.tprint("  SUMMARY");
  ns.tprint("═══════════════════════════════════════════════════");
  ns.tprint(`Purchased: ${purchased} servers`);
  ns.tprint(`Failed: ${failed}`);
  ns.tprint(`Total spent: ${ns.nFormat(spent, "$0.00a")}`);
  ns.tprint(`Remaining money: ${ns.nFormat(ns.getPlayer().money, "$0.00a")}`);
  ns.tprint(`Total servers: ${newTotal}/${maxServers}`);
  ns.tprint("═══════════════════════════════════════════════════");
  
  if (newTotal < maxServers && ns.getPlayer().money >= cost) {
    ns.tprint(`\n💡 TIP: You can afford ${Math.floor(ns.getPlayer().money / cost)} more server(s)!`);
  }
}
