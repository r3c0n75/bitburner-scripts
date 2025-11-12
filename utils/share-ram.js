/** @param {NS} ns */
export async function main(ns) {
    // Minimal RAM sharing script for faction reputation bonus
    // Optimized to use exactly 4.00GB for perfect memory utilization
    // Runs ns.share() continuously to maintain the 10-second bonus
    
    ns.disableLog("ALL");
    
    while (true) {
        await ns.share();
    }
}

