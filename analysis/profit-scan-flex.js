/** profit-scan-flex.js
 * One-step profit scanner:
 *  - always generates fresh timing data from rooted hosts (no caching)
 *  - by default, filters out zero-money servers (purchased servers, home, darkweb)
 *  - use --save to write profiler-overrides.json for manual use
 *
 * Usage:
 *   run profit-scan-flex.js [limit] [--save] [--all] [--optimal]
 * Examples:
 *   run profit-scan-flex.js            # default: show current state ranking
 *   run profit-scan-flex.js 50         # print top 50 with fresh timings
 *   run profit-scan-flex.js --optimal  # rank by FLEET POTENTIAL (capacity + efficiency)
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
  const optimalMode = flags.has("--optimal");
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

      // per-thread hack fraction & success chance (CURRENT state)
      const fracPerThread = ns.hackAnalyze(h);
      const chance = ns.hackAnalyzeChance(h);

      // Calculate realistic batch cycle income (not theoretical continuous hack)
      const batchCycleTimeMs = Math.max(hackTimeMs, growTimeMs, weakenTimeMs);
      const batchIntervalMs = batchCycleTimeMs * 1.25; // 25% safety buffer
      const batchesPerSecond = 1000 / batchIntervalMs;
      const moneyPerHack = maxMoney * fracPerThread * chance;
      
      // per-thread expected money per second (realistic batch cycle)
      const perThreadPerSec = moneyPerHack * batchesPerSecond;

      // Calculate OPTIMAL state (min security) estimates
      // Security affects timing by roughly: time * (1 + (curSec - minSec) / minSec)
      // So optimal time = current time / (1 + secDelta / minSec)
      const secDelta = curSec - minSec;
      const secFactor = 1 + (secDelta / Math.max(minSec, 1));
      
      const optimalHackTimeMs = hackTimeMs / secFactor;
      const optimalGrowTimeMs = growTimeMs / secFactor;
      const optimalWeakenTimeMs = weakenTimeMs / secFactor;
      const optimalBatchCycleMs = Math.max(optimalHackTimeMs, optimalGrowTimeMs, optimalWeakenTimeMs);
      const optimalBatchIntervalMs = optimalBatchCycleMs * 1.25;
      const optimalBatchesPerSecond = 1000 / optimalBatchIntervalMs;
      
      // At min security, hack chance is much higher (estimate ~90% for prepped servers)
      // Actual calculation would require server skills, but we can estimate improvement
      const optimalChance = Math.min(0.95, chance * (1 + secDelta / minSec));
      const optimalMoneyPerHack = maxMoney * fracPerThread * optimalChance;
      const optimalPerThreadPerSec = optimalMoneyPerHack * optimalBatchesPerSecond;

      // Prep status indicator
      let prepStatus = "READY";
      let prepIcon = "✓";
      if (secDelta > minSec * 2) {
        prepStatus = "HEAVY PREP";
        prepIcon = "⚠";
      } else if (secDelta > minSec * 0.5) {
        prepStatus = "LIGHT PREP";
        prepIcon = "◐";
      }

      // Calculate "Fleet Potential Score" for optimal rankings
      // Combines per-thread efficiency with max money capacity
      // Uses logarithmic scale to reward high-capacity targets without complete domination
      // Formula: perThreadIncome * log10(maxMoney) - rewards both efficiency AND capacity
      const fleetScore = optimalPerThreadPerSec * Math.log10(Math.max(maxMoney, 1));
      
      // Calculate what % of threads would be useful (rough estimate)
      // If fracPerThread is 0.005 (0.5%), you'd need 200 threads to drain 100%
      // Most fleets have 100-2000 threads, so we estimate thread utilization
      const threadsToDeplete100Pct = fracPerThread > 0 ? 1 / fracPerThread : 9999;
      const threadUtilization = Math.min(1, 500 / threadsToDeplete100Pct); // assume 500 threads available

      rows.push({
        host: h,
        rooted,
        maxRam,
        maxMoney,
        minSec,
        curSec,
        secDelta,
        hackTimeMs,
        growTimeMs,
        weakenTimeMs,
        fracPerThread,
        chance,
        perThreadPerSec,
        optimalPerThreadPerSec,
        optimalChance,
        optimalBatchCycleMs,
        prepStatus,
        prepIcon,
        fleetScore,
        threadUtilization
      });
    } catch (e) {
      // ignore hosts we can't query
    }
  }

  // sort by optimal or current state
  if (optimalMode) {
    // Sort by Fleet Score (combines per-thread efficiency + max money capacity)
    rows.sort((a, b) => b.fleetScore - a.fleetScore);
  } else {
    rows.sort((a, b) => b.perThreadPerSec - a.perThreadPerSec);
  }

  ns.tprint("");
  ns.tprint("═══════════════════════════════════════════════════════════════════════");
  if (optimalMode) {
    ns.tprint("  TOP PROFIT TARGETS (by FLEET POTENTIAL - capacity + efficiency)");
  } else {
    ns.tprint("  TOP PROFIT TARGETS (by CURRENT $/sec - as-is state)");
  }
  ns.tprint("═══════════════════════════════════════════════════════════════════════");
  ns.tprint("");

  const show = Math.min(limit, rows.length);
  for (let i = 0; i < show; ++i) {
    const r = rows[i];
    const rank = String(i + 1).padStart(2, ' ');
    const hostName = r.host.padEnd(20);
    const rootStatus = r.rooted === "YES" ? "✓" : "✗";
    const ram = String(r.maxRam + "GB").padStart(6);
    
    if (optimalMode) {
      // OPTIMAL MODE: Show fleet potential (capacity + efficiency)
      const optimalChance = (r.optimalChance * 100).toFixed(1) + "%";
      const optimalIncome = formatNumber(ns, r.optimalPerThreadPerSec);
      const prepIndicator = `${r.prepIcon} ${r.prepStatus}`.padEnd(13);
      const fleetScoreDisplay = r.fleetScore.toFixed(0);
      
      ns.tprint(`${rank}. ${hostName} [${rootStatus}] ${ram} RAM | ${prepIndicator} | Score: ${fleetScoreDisplay}`);
      ns.tprint(`    Max Money: ${formatNumber(ns, r.maxMoney).padEnd(12)} ⭐ | Security: ${r.curSec.toFixed(1)}/${r.minSec} (Δ${r.secDelta.toFixed(1)})`);
      ns.tprint(`    Per-Thread: ${optimalIncome}/s | Cycle=${(r.optimalBatchCycleMs/1000).toFixed(1)}s | Chance=${optimalChance}`);
      
      // Show current vs potential comparison if server needs prep
      if (r.prepStatus !== "READY") {
        const currentIncome = formatNumber(ns, r.perThreadPerSec);
        const improvement = ((r.optimalPerThreadPerSec / r.perThreadPerSec) - 1) * 100;
        ns.tprint(`    Current: ${currentIncome}/s (${improvement.toFixed(0)}% gain possible after prep)`);
      }
    } else {
      // CURRENT MODE: Show as-is state with prep hints
      const hackChance = (r.chance * 100).toFixed(1) + "%";
      const perThreadIncome = formatNumber(ns, r.perThreadPerSec);
      
      ns.tprint(`${rank}. ${hostName} [${rootStatus}] ${ram} RAM | ${r.prepIcon} ${r.prepStatus}`);
      ns.tprint(`    Max Money: ${formatNumber(ns, r.maxMoney).padEnd(12)} | Security: ${r.curSec.toFixed(1)}/${r.minSec} | Hack Chance: ${hackChance}`);
      ns.tprint(`    Timing: H=${(r.hackTimeMs/1000).toFixed(1)}s G=${(r.growTimeMs/1000).toFixed(1)}s W=${(r.weakenTimeMs/1000).toFixed(1)}s | Income/thread: ${perThreadIncome}`);
      
      // Hint at potential if server needs prep
      if (r.prepStatus !== "READY" && r.optimalPerThreadPerSec > r.perThreadPerSec * 2) {
        const optimalIncome = formatNumber(ns, r.optimalPerThreadPerSec);
        ns.tprint(`    💡 Potential after prep: ${optimalIncome}/s`);
      }
    }
    ns.tprint("");
  }

  ns.tprint("───────────────────────────────────────────────────────────────────────");
  ns.tprint(`Showing ${show} of ${rows.length} reachable hosts with money`);
  if (optimalMode) {
    ns.tprint(`Mode: FLEET POTENTIAL - Ranks by capacity + efficiency for large fleets`);
    ns.tprint(`⭐ Max Money is KEY - High-capacity targets support more threads`);
    ns.tprint(`Fleet Score = Per-thread income × log10(Max Money)`);
    ns.tprint(`Tip: Use without --optimal flag to see current state rankings`);
  } else {
    ns.tprint(`Mode: CURRENT - Rankings show AS-IS state (current security/money)`);
    ns.tprint(`Tip: Use --optimal flag to see rankings by FLEET POTENTIAL`);
  }
  ns.tprint(`Note: Income values account for realistic batch cycles (grow/weaken overhead).`);
  ns.tprint("═══════════════════════════════════════════════════════════════════════");
}

/**
 * Format number for both v2.x and v3.x compatibility
 * @param {NS} ns
 * @param {number} v - Value to format
 */
function formatNumber(ns, v) {
  // Try old nFormat (v2.x) first
  try {
    return ns.nFormat(v, "$0.00a");
  } catch (e) {
    // nFormat removed, use custom formatting for v3.x
    if (v >= 1e9) return `$${(v/1e9).toFixed(2)}b`;
    if (v >= 1e6) return `$${(v/1e6).toFixed(2)}m`;
    if (v >= 1e3) return `$${(v/1e3).toFixed(2)}k`;
    return `$${v.toFixed(2)}`;
  }
}
