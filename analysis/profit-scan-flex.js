/** profit-scan-flex.js
 * One-step profit scanner:
 *  - always generates fresh timing data from rooted hosts (no caching)
 *  - by default, filters out zero-money servers (purchased servers, home, darkweb)
 *  - use --save to write profiler-overrides.json for manual use
 *
 * Usage:
 *   run profit-scan-flex.js [limit] [--save] [--all]
 * Examples:
 *   run profit-scan-flex.js            # default: show only money servers, print top 30 with fresh timings
 *   run profit-scan-flex.js 50         # print top 50 with fresh timings
 *   run profit-scan-flex.js --all      # show ALL servers including purchased servers
 *   run profit-scan-flex.js --save     # write profiler-overrides.json for manual use
 */

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("sleep");

  const args = ns.args.slice();
  let limit = 30;
  const flags = new Set();

  // parse args: numeric limit first (if present), rest are flags
  if (args.length && typeof args[0] === "number") {
    const n = Number(args[0]);
    if (Number.isFinite(n) && n > 0) {
      limit = Math.floor(n);
      args.shift();
    }
  }
  for (const a of args) flags.add(String(a));

  const saveFile = flags.has("--save");
  const showAll = flags.has("--all");
  // Default behavior: filter out zero-money servers (unless --all is specified)
  const onlyMoney = !showAll;
  const fname = "profiler-overrides.json";

  // Always generate fresh timing data (no caching)
  ns.tprint(`profit-scan-flex: generating fresh timing data from rooted hosts...`);

  // Generate fresh overrides from reachable rooted hosts
  let overrides = {};
  {
    // BFS reachable hosts from "home"
    const visited = new Set();
    const q = ["home"];
    const hosts = [];
    while (q.length) {
      const h = q.shift();
      if (visited.has(h)) continue;
      visited.add(h);
      hosts.push(h);
      try {
        for (const n of ns.scan(h)) if (!visited.has(n)) q.push(n);
      } catch (_) {}
    }

    const result = {};
    let count = 0;
    for (const h of hosts) {
      try {
        if (!ns.hasRootAccess(h)) continue;
        const maxMoney = ns.getServerMaxMoney(h);
        if (onlyMoney && (!maxMoney || maxMoney <= 0)) continue;

        // Use Netscript timing APIs and store ms integers
        const hackTimeMs = Math.round(ns.getHackTime(h));
        const growTimeMs = Math.round(ns.getGrowTime(h));
        const weakenTimeMs = Math.round(ns.getWeakenTime(h));

        if (!Number.isFinite(hackTimeMs) || !Number.isFinite(growTimeMs) || !Number.isFinite(weakenTimeMs)) {
          ns.tprint(`Skipping ${h}: non-finite timing value(s).`);
          continue;
        }

        result[h] = { hackTimeMs, growTimeMs, weakenTimeMs };
        count++;
      } catch (e) {
        // skip problematic hosts
      }
    }

    ns.tprint(`profit-scan-flex: generated ${count} timing entries from rooted hosts (filtering=${onlyMoney ? 'money-only' : 'all-servers'})`);

    // Use fresh data in-memory
    overrides = result;

    // Optionally save to file if --save flag is used
    if (saveFile) {
      try {
        ns.write(fname, JSON.stringify(result, null, 2), "w");
        ns.tprint(`profit-scan-flex: Wrote ${fname} with ${Object.keys(result).length} entries on ${ns.getHostname()}`);
      } catch (e) {
        ns.tprint(`profit-scan-flex: ERROR writing ${fname}: ${e}`);
      }
    }
  }

  // Gather reachable hosts again for scanning and reporting
  const visited2 = new Set();
  const q2 = ["home"];
  const hosts2 = [];
  while (q2.length) {
    const h = q2.shift();
    if (visited2.has(h)) continue;
    visited2.add(h);
    hosts2.push(h);
    for (const n of ns.scan(h)) if (!visited2.has(n)) q2.push(n);
  }

  // Compute rows using overrides (if present) or fallback to NS API
  const rows = [];
  for (const h of hosts2) {
    try {
      const maxMoney = ns.getServerMaxMoney(h);
      
      // Apply --only-money filter to display output
      if (onlyMoney && (!maxMoney || maxMoney <= 0)) continue;
      
      const minSec = ns.getServerMinSecurityLevel(h);
      const curSec = ns.getServerSecurityLevel(h);
      const maxRam = ns.getServerMaxRam(h);
      const rooted = ns.hasRootAccess(h) ? "YES" : "NO";

      // Use fresh timing data from generated overrides
      let hackTimeMs, growTimeMs, weakenTimeMs;
      if (overrides && Object.prototype.hasOwnProperty.call(overrides, h)) {
        const o = overrides[h];
        hackTimeMs = Number(o.hackTimeMs);
        growTimeMs = Number(o.growTimeMs);
        weakenTimeMs = Number(o.weakenTimeMs);
      } else {
        // Fallback to NS API if not in generated data (shouldn't happen)
        hackTimeMs = ns.getHackTime(h);
        growTimeMs = ns.getGrowTime(h);
        weakenTimeMs = ns.getWeakenTime(h);
      }

      // per-thread hack fraction & success chance
      const fracPerThread = ns.hackAnalyze(h);
      const chance = ns.hackAnalyzeChance(h);

      // per-thread expected money per second (idealized)
      const perThreadPerSec = (maxMoney * fracPerThread * chance) / (hackTimeMs / 1000);

      rows.push({
        host: h,
        rooted,
        maxRam,
        maxMoney,
        minSec,
        curSec,
        hackTimeMs,
        growTimeMs,
        weakenTimeMs,
        fracPerThread,
        chance,
        perThreadPerSec
      });
    } catch (e) {
      // ignore hosts we can't query
    }
  }

  // sort & print
  rows.sort((a, b) => b.perThreadPerSec - a.perThreadPerSec);

  ns.tprint("");
  ns.tprint("═══════════════════════════════════════════════════════════════════════");
  ns.tprint("  TOP PROFIT TARGETS (by expected $/sec per thread - fresh data)");
  ns.tprint("═══════════════════════════════════════════════════════════════════════");
  ns.tprint("");

  const show = Math.min(limit, rows.length);
  for (let i = 0; i < show; ++i) {
    const r = rows[i];
    const rank = String(i + 1).padStart(2, ' ');
    const hostName = r.host.padEnd(20);
    const rootStatus = r.rooted === "YES" ? "✓" : "✗";
    const ram = String(r.maxRam + "GB").padStart(6);
    const hackChance = (r.chance * 100).toFixed(1) + "%";
    const perThreadIncome = formatNumber(ns, r.perThreadPerSec);
    
    ns.tprint(`${rank}. ${hostName} [${rootStatus}] ${ram} RAM`);
    ns.tprint(`    Max Money: ${formatNumber(ns, r.maxMoney).padEnd(12)} | Security: ${r.curSec.toFixed(1)}/${r.minSec} | Hack Chance: ${hackChance}`);
    ns.tprint(`    Timing: H=${(r.hackTimeMs/1000).toFixed(1)}s G=${(r.growTimeMs/1000).toFixed(1)}s W=${(r.weakenTimeMs/1000).toFixed(1)}s | Income/thread: ${perThreadIncome}`);
    ns.tprint("");
  }

  ns.tprint("───────────────────────────────────────────────────────────────────────");
  ns.tprint(`Showing ${show} of ${rows.length} reachable hosts with money`);
  ns.tprint(`Note: Income values are idealized. Use timing-aware batcher for actual results.`);
  ns.tprint("═══════════════════════════════════════════════════════════════════════");
}

/** helper formatting */
function formatNumber(ns, v) {
  if (ns.formatNumber) return ns.formatNumber(v, 2);
  if (v >= 1e9) return `$${(v/1e9).toFixed(2)}b`;
  if (v >= 1e6) return `$${(v/1e6).toFixed(2)}m`;
  if (v >= 1e3) return `$${(v/1e3).toFixed(2)}k`;
  return `$${v.toFixed(2)}`;
}

