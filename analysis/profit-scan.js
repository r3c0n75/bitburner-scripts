/** profit-scan.js
 * Print a ranked list of servers by estimated profit/sec.
 * Usage: run profit-scan.js
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
  const host = ns.getHostname();
  const visited = new Set();
  const q = ["home"];
  const servers = [];

  // BFS scan to collect servers
  while (q.length) {
    const s = q.shift();
    if (visited.has(s)) continue;
    visited.add(s);
    servers.push(s);
    for (const n of ns.scan(s)) {
      if (!visited.has(n)) q.push(n);
    }
  }

  // Compute profitability for each server
  const rows = [];
  for (const s of servers) {
    try {
      const maxMoney = ns.getServerMaxMoney(s);
      const minSec = ns.getServerMinSecurityLevel(s);
      const hackTime = ns.getHackTime(s);
      const hackChance = ns.hackAnalyzeChance(s);
      const singleHackPct = ns.hackAnalyze(s); // fraction of money stolen by 1 thread
      // estimate money per thread per hack (expected)
      const expectedPerThread = maxMoney * singleHackPct * hackChance;
      // money/sec per thread approx:
      const mpsThread = hackTime > 0 ? expectedPerThread / (hackTime / 1000) : 0;
      // if host is not root or has no money, it will still show low values
      rows.push({
        server: s,
        maxMoney,
        minSec,
        hackTimeMs: Math.round(hackTime),
        hackChance: Number(hackChance.toFixed(3)),
        perThreadPerSec: Number(mpsThread.toFixed(6)),
        rooted: ns.hasRootAccess(s),
        ram: ns.getServerMaxRam(s),
      });
    } catch (e) {
      // skip if functions fail for a host
    }
  }

  // sort: highest perThreadPerSec first
  rows.sort((a, b) => b.perThreadPerSec - a.perThreadPerSec);

  ns.tprint("Top targets by expected money/sec per thread:");
  ns.tprint("server | rooted | RAM | maxMoney | minSec | hackTime(ms) | hackChance | $/s/thread");
  for (const r of rows.slice(0, 30)) {
    ns.tprint(`${r.server} | ${r.rooted ? "YES" : "NO " } | ${r.ram}GB | ${formatMoney(ns, r.maxMoney, "$0.00a")} | ${r.minSec} | ${r.hackTimeMs} | ${r.hackChance} | ${formatMoney(ns, r.perThreadPerSec, "$0.000a")}`);
  }
}
