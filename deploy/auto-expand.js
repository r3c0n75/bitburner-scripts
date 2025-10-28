/** auto-expand.js
 * Automatically root all accessible servers and deploy hack scripts to them.
 * Usage: run auto-expand.js [target] [capThreads]
 * 
 * Examples:
 *   run auto-expand.js                    # Defaults to joesguns
 *   run auto-expand.js n00dles           # Deploy hack-n00dles.js
 *   run auto-expand.js foodnstuff 50     # Deploy with max 50 threads per server
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
  ns.disableLog("ALL");
  
  // Parse arguments
  const target = ns.args[0] || "joesguns";
  const capArg = ns.args.length > 1 ? Number(ns.args[1]) : Infinity;
  const capThreads = Number.isFinite(capArg) && capArg > 0 ? Math.floor(capArg) : Infinity;
  
  const script = "deploy/hack-universal.js";
  
  // Check if the hack script exists
  if (!ns.fileExists(script, "home")) {
    ns.tprint(`ERROR: ${script} not found on home server!`);
    ns.tprint(`Download it first with: run bitburner-update.js --deploy`);
    return;
  }
  
  // Verify target server exists
  if (!ns.serverExists(target)) {
    ns.tprint(`ERROR: Target server "${target}" does not exist!`);
    return;
  }
  
  ns.tprint(`═══════════════════════════════════════════════════`);
  ns.tprint(`  AUTO-EXPAND: Rooting & Deploying to ${target}`);
  ns.tprint(`═══════════════════════════════════════════════════`);
  
  // Check available port-opening programs
  const programs = [
    { name: "BruteSSH.exe", fn: ns.brutessh },
    { name: "FTPCrack.exe", fn: ns.ftpcrack },
    { name: "relaySMTP.exe", fn: ns.relaysmtp },
    { name: "HTTPWorm.exe", fn: ns.httpworm },
    { name: "SQLInject.exe", fn: ns.sqlinject }
  ];
  
  const available = programs.filter(p => ns.fileExists(p.name, "home"));
  const portCount = available.length;
  
  ns.tprint(`Available port openers: ${portCount}`);
  available.forEach(p => ns.tprint(`  ✓ ${p.name}`));
  ns.tprint("");
  
  // Scan entire network
  const visited = new Set();
  const queue = ["home"];
  const servers = [];
  
  while (queue.length > 0) {
    const host = queue.shift();
    if (visited.has(host)) continue;
    visited.add(host);
    servers.push(host);
    
    const neighbors = ns.scan(host);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }
  
  ns.tprint(`Found ${servers.length} servers in network`);
  ns.tprint("");
  
  // Root servers
  let rootedCount = 0;
  let alreadyRooted = 0;
  let cannotRoot = 0;
  
  ns.tprint("─── ROOTING PHASE ───");
  
  for (const host of servers) {
    // Skip home
    if (host === "home") continue;
    
    // Check if already rooted
    if (ns.hasRootAccess(host)) {
      alreadyRooted++;
      continue;
    }
    
    // Check requirements
    const reqPorts = ns.getServerNumPortsRequired(host);
    const reqHack = ns.getServerRequiredHackingLevel(host);
    const playerHack = ns.getHackingLevel();
    
    // Can we root it?
    if (reqPorts > portCount || reqHack > playerHack) {
      cannotRoot++;
      continue;
    }
    
    // Open ports
    try {
      for (const prog of available) {
        prog.fn(host);
      }
      
      // Nuke it!
      ns.nuke(host);
      
      if (ns.hasRootAccess(host)) {
        ns.tprint(`✓ Rooted: ${host} (${formatMoney(ns, ns.getServerMaxMoney(host), "$0.00a")} max)`);
        rootedCount++;
      }
    } catch (e) {
      ns.tprint(`✗ Failed to root ${host}: ${e}`);
    }
  }
  
  ns.tprint("");
  ns.tprint(`Newly rooted: ${rootedCount}`);
  ns.tprint(`Already rooted: ${alreadyRooted}`);
  ns.tprint(`Cannot root yet: ${cannotRoot}`);
  ns.tprint("");
  
  // Deploy phase
  ns.tprint("─── DEPLOYMENT PHASE ───");
  
  let deployedCount = 0;
  let skippedCount = 0;
  
  for (const host of servers) {
    // Skip home - don't deploy to it
    if (host === "home") continue;
    
    // Only deploy to rooted servers
    if (!ns.hasRootAccess(host)) continue;
    
    // Copy script if needed
    if (!ns.fileExists(script, host)) {
      await ns.scp(script, host);
    }
    
    // Calculate threads
    const ramPer = ns.getScriptRam(script, host);
    const maxRam = ns.getServerMaxRam(host);
    const usedRam = ns.getServerUsedRam(host);
    const freeRam = Math.max(0, maxRam - usedRam);
    
    if (freeRam < ramPer) {
      skippedCount++;
      continue;
    }
    
    let threads = Math.floor(freeRam / ramPer);
    threads = Math.min(threads, capThreads);
    
    if (threads < 1) {
      skippedCount++;
      continue;
    }
    
    // Kill any existing instances first
    ns.killall(host);
    
    // Deploy with target as argument
    const pid = ns.exec(script, host, threads, target);
    
    if (pid > 0) {
      ns.tprint(`✓ Deployed ${script} on ${host} targeting ${target} (${threads} threads, PID: ${pid})`);
      deployedCount++;
    } else {
      ns.tprint(`✗ Failed to deploy on ${host}`);
    }
    
    await ns.sleep(50); // Small delay between deployments
  }
  
  ns.tprint("");
  ns.tprint(`═══════════════════════════════════════════════════`);
  ns.tprint(`  SUMMARY`);
  ns.tprint(`═══════════════════════════════════════════════════`);
  ns.tprint(`Target: ${target}`);
  ns.tprint(`Newly rooted: ${rootedCount} servers`);
  ns.tprint(`Deployed to: ${deployedCount} servers`);
  ns.tprint(`Skipped: ${skippedCount} servers (insufficient RAM)`);
  ns.tprint(`═══════════════════════════════════════════════════`);
}

