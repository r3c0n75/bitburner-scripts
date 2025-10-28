/** production-monitor.js
 * Measures player money change over a given interval (seconds).
 * Usage:
 *   run production-monitor.js 60    # measure for 60 seconds
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
  const secs = Number(ns.args[0]) || 60;
  const start = ns.getPlayer().money;
  ns.tprint(`Monitoring production for ${secs}s... start=${formatMoney(ns, start, "$0.00a")}`);
  for (let i = 0; i < secs; i++) {
    await ns.sleep(1000);
    // optional per-second print:
    // ns.tprint(`${i+1}s`);
  }
  const end = ns.getPlayer().money;
  const gained = end - start;
  const perSec = gained / secs;
  ns.tprint(`Done: gained ${formatMoney(ns, gained, "$0.00a")} over ${secs}s (${formatMoney(ns, perSec, "$0.00a")}/s)`);
}
