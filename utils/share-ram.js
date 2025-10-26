/** @param {NS} ns */
export async function main(ns) {
    // Simple RAM sharing script for faction reputation bonus
    // Runs ns.share() continuously to maintain 10-second bonus
    
    ns.disableLog("ALL");
    ns.clearLog();
    
    const hostname = ns.getHostname();
    const startTime = Date.now();
    
    ns.print(`[${hostname}] Starting RAM sharing for faction reputation bonus...`);
    
    let cycles = 0;
    
    while (true) {
        await ns.share();
        cycles++;
        
        // Log status every 10 cycles (roughly every 100 seconds)
        if (cycles % 10 === 0) {
            const runtime = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
            ns.print(`[${hostname}] Sharing RAM - Runtime: ${runtime}m, Cycles: ${cycles}`);
        }
    }
}

