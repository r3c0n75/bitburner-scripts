/** list-pservs.js
 * List all purchased servers and their status.
 * Usage: run list-pservs.js
 */

/**
 * Format number for both v2.x and v3.x compatibility
 * @param {NS} ns
 * @param {number} value
 * @param {string} format
 */
function formatMoney(ns, value, format) {
  // Try old nFormat (v2.x) - it exists in v3.x but throws error when called
  try {
    return ns.nFormat(value, format);
  } catch (e) {
    // nFormat removed or errored, use custom formatting for v3.x
    const units = ['', 'k', 'm', 'b', 't', 'q', 'Q', 's', 'S', 'o', 'n'];
    let unitIndex = 0;
    let num = Math.abs(value);
    
    while (num >= 1000 && unitIndex < units.length - 1) {
      num /= 1000;
      unitIndex++;
    }
    
    const decimals = format.includes('.00') ? 2 : format.includes('.000') ? 3 : 0;
    const formatted = num.toFixed(decimals) + units[unitIndex];
    return (value < 0 ? '-$' : '$') + formatted;
  }
}

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
      
      ns.tprint(`${pserv} | ${maxRam}GB | ${usedRam.toFixed(2)}GB | ${freeRam.toFixed(2)}GB | ${hasRoot ? "YES" : "NO"} | ${formatMoney(ns, money, "$0.00a")}`);
    } catch (e) {
      ns.tprint(`${pserv} | ERROR: ${e}`);
    }
  }
}
