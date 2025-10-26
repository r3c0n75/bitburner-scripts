/** profit-scan-flex.js
 * One-step profit scanner:
 *  - uses profiler-overrides.json if present
 *  - if not present, auto-generates overrides for rooted hosts and writes profiler-overrides.json
 *
 * Usage:
 *   run profit-scan-flex.js [limit] [--dry] [--only-money]
 * Examples:
 *   run profit-scan-flex.js            # default: write overrides if missing, print top 30
 *   run profit-scan-flex.js 50 --dry   # don't write file, print top 50 using live timings
 *   run profit-scan-flex.js --only-money
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

  const dry = flags.has("--dry");
  const onlyMoney = flags.has("--only-money");
  const fname = "profiler-overrides.json";

  // Try to read existing overrides from the local host
  let overrides = {};
  let usedOverridesFile = false;
  try {
    if (ns.fileExists(fname, ns.getHostname())) {
      const raw = ns.read(fname);
      if (raw && raw.trim()) {
        overrides = JSON.parse(raw);
        usedOverridesFile = true;
        ns.tprint(`profit-scan-flex: using overrides from ${fname}`);
      } else {
        ns.tprint(`profit-scan-flex: ${fname} present but empty — will regenerate if needed`);
      }
    } else {
      ns.tprint(`profit-scan-flex: ${fname} not found on ${ns.getHostname()} — will generate overrides now`);
    }
  } catch (e) {
    ns.tprint(`profit-scan-flex: error reading/parsing ${fname}: ${e} — will regenerate`);
    overrides = {};
  }

  // If no overrides present (or empty), generate them from reachable rooted hosts
  if (!usedOverridesFile) {
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

    ns.tprint(`profit-scan-flex: generated ${count} override entries from rooted hosts (onlyMoney=${onlyMoney})`);

    if (!dry) {
      try {
        ns.write(fname, JSON.stringify(result, null, 2), "w");
        ns.tprint(`profit-scan-flex: Wrote ${fname} with ${Object.keys(result).length} entries on ${ns.getHostname()}`);
        overrides = result;
        usedOverridesFile = true;
      } catch (e) {
        ns.tprint(`profit-scan-flex: ERROR writing ${fname}: ${e}`);
        // fall back to using the generated object in-memory (don't require file)
        overrides = result;
        usedOverridesFile = true;
      }
    } else {
      overrides = result;
      usedOverridesFile = true;
      ns.tprint("profit-scan-flex: dry run — not writing file, using generated timings in-memory for this run");
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

      // prefer override values if present for host
      let hackTimeMs, growTimeMs, weakenTimeMs;
      const hasOverride = overrides && Object.prototype.hasOwnProperty.call(overrides, h);
      if (hasOverride) {
        const o = overrides[h];
        hackTimeMs = Number(o.hackTimeMs) || ns.getHackTime(h);
        growTimeMs = Number(o.growTimeMs) || ns.getGrowTime(h);
        weakenTimeMs = Number(o.weakenTimeMs) || ns.getWeakenTime(h);
      } else {
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
        perThreadPerSec,
        usedOverride: !!hasOverride
      });
    } catch (e) {
      // ignore hosts we can't query
    }
  }

  // sort & print
  rows.sort((a, b) => b.perThreadPerSec - a.perThreadPerSec);

  ns.tprint("Top targets by expected money/sec per thread (idealized):");
  ns.tprint("OVR | server | rooted | RAM | maxMoney | minSec | curSec | hackTime(s) | growTime(s) | weakenTime(s) | hackChance | $/s/thread");

  const show = Math.min(limit, rows.length);
  for (let i = 0; i < show; ++i) {
    const r = rows[i];
    const ovr = r.usedOverride ? "YES" : "   ";
    ns.tprint(
      `${ovr} | ${r.host} | ${r.rooted} | ${r.maxRam}GB | ${formatNumber(ns, r.maxMoney)} | ${r.minSec} | ${r.curSec} | ` +
      `${(r.hackTimeMs/1000).toFixed(3)} | ${(r.growTimeMs/1000).toFixed(3)} | ${(r.weakenTimeMs/1000).toFixed(3)} | ` +
      `${(r.chance*100).toFixed(2)}% | ${formatNumber(ns, r.perThreadPerSec)}`
    );
  }

  ns.tprint(`(showing ${show} of ${rows.length} reachable hosts)`);
  ns.tprint("");
  ns.tprint(`Notes: - This per-thread $/s is idealized. Use with a timing-aware batcher for realized income.`);
}

/** helper formatting */
function formatNumber(ns, v) {
  if (ns.formatNumber) return ns.formatNumber(v, 2);
  if (v >= 1e9) return `$${(v/1e9).toFixed(2)}b`;
  if (v >= 1e6) return `$${(v/1e6).toFixed(2)}m`;
  if (v >= 1e3) return `$${(v/1e3).toFixed(2)}k`;
  return `$${v.toFixed(2)}`;
}

