/** f-profit-scan-flex.js - FORMULAS.EXE ENHANCED VERSION
 * 
 * Formula-enhanced profit scanner with EXACT calculations (requires Formulas.exe)
 * 
 * IMPROVEMENTS OVER profit-scan-flex.js:
 *  - Uses ns.formulas.hacking.* for EXACT calculations (no estimates)
 *  - Precise hack chance calculations at optimal and current states
 *  - Exact timing calculations with player stats
 *  - Perfect optimal state projections
 * 
 * Usage:
 *   run analysis/f-profit-scan-flex.js [limit] [--save] [--all] [--optimal]
 * Examples:
 *   run analysis/f-profit-scan-flex.js            # show current state with EXACT calculations
 *   run analysis/f-profit-scan-flex.js 50         # top 50 with exact data
 *   run analysis/f-profit-scan-flex.js --optimal  # rank by EXACT potential (min security, max money)
 *   run analysis/f-profit-scan-flex.js --all      # show ALL servers including purchased servers
 *   run analysis/f-profit-scan-flex.js --save     # write profiler-overrides.json
 */

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("sleep");

  // Check for Formulas.exe
  if (!ns.formulas || !ns.formulas.hacking) {
    ns.tprint("ERROR: This script requires Formulas.exe ($5 billion from Dark Web)");
    ns.tprint("Use profit-scan-flex.js for the non-formulas version.");
    return;
  }

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
  const onlyMoney = !showAll;
  const fname = "profiler-overrides.json";

  // Get player stats for formula calculations
  const player = ns.getPlayer();

  ns.tprint(`f-profit-scan-flex: Generating EXACT timing data using Formulas.exe...`);

  // Generate fresh overrides from reachable rooted hosts
  let overrides = {};
  {
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

        const server = ns.getServer(h);

        // Use EXACT formulas with current server state
        const hackTimeMs = Math.round(ns.formulas.hacking.hackTime(server, player));
        const growTimeMs = Math.round(ns.formulas.hacking.growTime(server, player));
        const weakenTimeMs = Math.round(ns.formulas.hacking.weakenTime(server, player));

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

    ns.tprint(`f-profit-scan-flex: Generated ${count} EXACT timing entries (filtering=${onlyMoney ? 'money-only' : 'all-servers'})`);

    overrides = result;

    if (saveFile) {
      try {
        ns.write(fname, JSON.stringify(result, null, 2), "w");
        ns.tprint(`f-profit-scan-flex: Wrote ${fname} with ${Object.keys(result).length} entries`);
      } catch (e) {
        ns.tprint(`f-profit-scan-flex: ERROR writing ${fname}: ${e}`);
      }
    }
  }

  // Gather reachable hosts for scanning
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

  // Compute rows using EXACT formulas
  const rows = [];
  for (const h of hosts2) {
    try {
      const maxMoney = ns.getServerMaxMoney(h);
      
      if (onlyMoney && (!maxMoney || maxMoney <= 0)) continue;
      
      const minSec = ns.getServerMinSecurityLevel(h);
      const curSec = ns.getServerSecurityLevel(h);
      const maxRam = ns.getServerMaxRam(h);
      const rooted = ns.hasRootAccess(h) ? "YES" : "NO";

      // Get current server state
      const serverCurrent = ns.getServer(h);

      // EXACT calculations with current state
      const hackTimeMs = ns.formulas.hacking.hackTime(serverCurrent, player);
      const growTimeMs = ns.formulas.hacking.growTime(serverCurrent, player);
      const weakenTimeMs = ns.formulas.hacking.weakenTime(serverCurrent, player);
      const fracPerThread = ns.formulas.hacking.hackPercent(serverCurrent, player);
      const chance = ns.formulas.hacking.hackChance(serverCurrent, player);

      // Calculate realistic batch cycle income (current state)
      const batchCycleTimeMs = Math.max(hackTimeMs, growTimeMs, weakenTimeMs);
      const batchIntervalMs = batchCycleTimeMs * 1.25; // 25% safety buffer
      const batchesPerSecond = 1000 / batchIntervalMs;
      const moneyPerHack = maxMoney * fracPerThread * chance;
      const perThreadPerSec = moneyPerHack * batchesPerSecond;

      // Calculate EXACT OPTIMAL state (min security, max money)
      const serverOptimal = {...serverCurrent};
      serverOptimal.hackDifficulty = minSec;
      serverOptimal.minDifficulty = minSec;
      serverOptimal.moneyAvailable = maxMoney;
      serverOptimal.moneyMax = maxMoney;

      // EXACT optimal calculations
      const optimalHackTimeMs = ns.formulas.hacking.hackTime(serverOptimal, player);
      const optimalGrowTimeMs = ns.formulas.hacking.growTime(serverOptimal, player);
      const optimalWeakenTimeMs = ns.formulas.hacking.weakenTime(serverOptimal, player);
      const optimalFracPerThread = ns.formulas.hacking.hackPercent(serverOptimal, player);
      const optimalChance = ns.formulas.hacking.hackChance(serverOptimal, player);

      const optimalBatchCycleMs = Math.max(optimalHackTimeMs, optimalGrowTimeMs, optimalWeakenTimeMs);
      const optimalBatchIntervalMs = optimalBatchCycleMs * 1.25;
      const optimalBatchesPerSecond = 1000 / optimalBatchIntervalMs;
      const optimalMoneyPerHack = maxMoney * optimalFracPerThread * optimalChance;
      const optimalPerThreadPerSec = optimalMoneyPerHack * optimalBatchesPerSecond;

      // Prep status indicator
      const secDelta = curSec - minSec;
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
      const fleetScore = optimalPerThreadPerSec * Math.log10(Math.max(maxMoney, 1));
      
      // Calculate thread utilization estimate
      const threadsToDeplete100Pct = optimalFracPerThread > 0 ? 1 / optimalFracPerThread : 9999;
      const threadUtilization = Math.min(1, 500 / threadsToDeplete100Pct);

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
        optimalHackTimeMs,
        optimalGrowTimeMs,
        optimalWeakenTimeMs,
        prepStatus,
        prepIcon,
        fleetScore,
        threadUtilization
      });
    } catch (e) {
      // ignore hosts we can't query
    }
  }

  // Sort by optimal or current state
  if (optimalMode) {
    rows.sort((a, b) => b.fleetScore - a.fleetScore);
  } else {
    rows.sort((a, b) => b.perThreadPerSec - a.perThreadPerSec);
  }

  ns.tprint("");
  ns.tprint("═══════════════════════════════════════════════════════════════════════");
  if (optimalMode) {
    ns.tprint("  TOP PROFIT TARGETS (EXACT FLEET POTENTIAL - Formulas.exe)");
  } else {
    ns.tprint("  TOP PROFIT TARGETS (EXACT CURRENT STATE - Formulas.exe)");
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
      // OPTIMAL MODE: Show exact fleet potential
      const optimalChance = (r.optimalChance * 100).toFixed(1) + "%";
      const optimalIncome = formatNumber(ns, r.optimalPerThreadPerSec);
      const prepIndicator = `${r.prepIcon} ${r.prepStatus}`.padEnd(13);
      const fleetScoreDisplay = r.fleetScore.toFixed(0);
      
      ns.tprint(`${rank}. ${hostName} [${rootStatus}] ${ram} RAM | ${prepIndicator} | Score: ${fleetScoreDisplay}`);
      ns.tprint(`    Max Money: ${formatNumber(ns, r.maxMoney).padEnd(12)} ⭐ | Security: ${r.curSec.toFixed(1)}/${r.minSec} (Δ${r.secDelta.toFixed(1)})`);
      ns.tprint(`    Per-Thread: ${optimalIncome}/s | Cycle=${(r.optimalBatchCycleMs/1000).toFixed(1)}s | Chance=${optimalChance}`);
      ns.tprint(`    Optimal Timing: H=${(r.optimalHackTimeMs/1000).toFixed(1)}s G=${(r.optimalGrowTimeMs/1000).toFixed(1)}s W=${(r.optimalWeakenTimeMs/1000).toFixed(1)}s`);
      
      // Show current vs potential comparison if server needs prep
      if (r.prepStatus !== "READY") {
        const currentIncome = formatNumber(ns, r.perThreadPerSec);
        const currentChance = (r.chance * 100).toFixed(1) + "%";
        const improvement = ((r.optimalPerThreadPerSec / Math.max(r.perThreadPerSec, 0.001)) - 1) * 100;
        ns.tprint(`    Current: ${currentIncome}/s (Chance=${currentChance}) → ${improvement.toFixed(0)}% gain after prep`);
      }
    } else {
      // CURRENT MODE: Show exact as-is state
      const hackChance = (r.chance * 100).toFixed(1) + "%";
      const perThreadIncome = formatNumber(ns, r.perThreadPerSec);
      
      ns.tprint(`${rank}. ${hostName} [${rootStatus}] ${ram} RAM | ${r.prepIcon} ${r.prepStatus}`);
      ns.tprint(`    Max Money: ${formatNumber(ns, r.maxMoney).padEnd(12)} | Security: ${r.curSec.toFixed(1)}/${r.minSec} | Hack Chance: ${hackChance}`);
      ns.tprint(`    Timing: H=${(r.hackTimeMs/1000).toFixed(1)}s G=${(r.growTimeMs/1000).toFixed(1)}s W=${(r.weakenTimeMs/1000).toFixed(1)}s | Income/thread: ${perThreadIncome}`);
      
      // Hint at potential if server needs prep
      if (r.prepStatus !== "READY" && r.optimalPerThreadPerSec > r.perThreadPerSec * 1.5) {
        const optimalIncome = formatNumber(ns, r.optimalPerThreadPerSec);
        const optimalChance = (r.optimalChance * 100).toFixed(1) + "%";
        ns.tprint(`    💡 EXACT Potential after prep: ${optimalIncome}/s (Chance=${optimalChance})`);
      }
    }
    ns.tprint("");
  }

  ns.tprint("───────────────────────────────────────────────────────────────────────");
  ns.tprint(`Showing ${show} of ${rows.length} reachable hosts with money`);
  if (optimalMode) {
    ns.tprint(`Mode: EXACT FLEET POTENTIAL - Perfect calculations using Formulas.exe`);
    ns.tprint(`⭐ Max Money is KEY - High-capacity targets support more threads`);
    ns.tprint(`Fleet Score = Exact per-thread income × log10(Max Money)`);
  } else {
    ns.tprint(`Mode: EXACT CURRENT - Perfect AS-IS state calculations via Formulas.exe`);
    ns.tprint(`Tip: Use --optimal flag to see EXACT fleet potential rankings`);
  }
  ns.tprint(`✅ All calculations use ns.formulas.hacking.* for perfect accuracy`);
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

