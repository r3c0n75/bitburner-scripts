/** @param {NS} ns */
export async function main(ns) {
    // Deploys share-ram.js to all rooted servers and runs it
    // This maximizes faction reputation bonus by sharing RAM across your entire network
    
    const shareScript = "utils/share-ram.js";
    const shareRam = ns.getScriptRam(shareScript);
    
    if (!ns.fileExists(shareScript)) {
        ns.tprint(`ERROR: ${shareScript} not found! Make sure it exists on home.`);
        return;
    }
    
    // Get all servers in the network
    const servers = getAllServers(ns);
    
    let deployed = 0;
    let failed = 0;
    let totalThreads = 0;
    
    ns.tprint("=".repeat(60));
    ns.tprint("DEPLOYING RAM SHARING ACROSS NETWORK");
    ns.tprint("=".repeat(60));
    
    for (const server of servers) {
        // Skip servers we don't have root on
        if (!ns.hasRootAccess(server)) {
            continue;
        }
        
        // Calculate available RAM and threads
        const maxRam = ns.getServerMaxRam(server);
        const usedRam = ns.getServerUsedRam(server);
        const availableRam = maxRam - usedRam;
        
        // Calculate how many threads we can run
        let threads = Math.floor(availableRam / shareRam);
        
        // On home, reserve some RAM for other operations
        if (server === "home") {
            const reservedRam = 64; // Reserve 64GB for other scripts
            const homeAvailable = Math.max(0, availableRam - reservedRam);
            threads = Math.floor(homeAvailable / shareRam);
        }
        
        if (threads < 1) {
            continue; // Not enough RAM
        }
        
        // Kill any existing share-ram.js instances
        if (ns.scriptRunning(shareScript, server)) {
            ns.scriptKill(shareScript, server);
        }
        
        // Copy and run the script
        await ns.scp(shareScript, server);
        const pid = ns.exec(shareScript, server, threads);
        
        if (pid > 0) {
            deployed++;
            totalThreads += threads;
            ns.tprint(`✓ ${server.padEnd(20)} - ${threads} threads (${availableRam.toFixed(2)}GB available)`);
        } else {
            failed++;
            ns.tprint(`✗ ${server.padEnd(20)} - Failed to start`);
        }
    }
    
    ns.tprint("=".repeat(60));
    ns.tprint(`DEPLOYMENT COMPLETE`);
    ns.tprint(`Successfully deployed: ${deployed} servers`);
    ns.tprint(`Failed: ${failed} servers`);
    ns.tprint(`Total sharing threads: ${totalThreads}`);
    ns.tprint("=".repeat(60));
    ns.tprint(`\nYour faction reputation bonus should now be significantly increased!`);
    ns.tprint(`The bonus updates every 10 seconds and scales with shared RAM.`);
}

/**
 * Recursively scans the network and returns all server hostnames
 * @param {NS} ns
 * @returns {string[]}
 */
function getAllServers(ns) {
    const visited = new Set();
    const queue = ["home"];
    
    while (queue.length > 0) {
        const current = queue.shift();
        
        if (visited.has(current)) {
            continue;
        }
        
        visited.add(current);
        
        const neighbors = ns.scan(current);
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                queue.push(neighbor);
            }
        }
    }
    
    return Array.from(visited);
}

