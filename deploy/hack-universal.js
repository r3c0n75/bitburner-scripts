/** hack-universal.js
 * Universal hacking script that works with any target server.
 * Usage: run hack-universal.js [target]
 * 
 * Examples:
 *   run hack-universal.js n00dles
 *   run hack-universal.js joesguns
 *   run hack-universal.js foodnstuff
 */

/** @param {NS} ns */
export async function main(ns) {
    // Get target from arguments
    const target = ns.args[0];
    
    if (!target) {
        ns.tprint("ERROR: No target specified!");
        ns.tprint("Usage: run hack-universal.js [target]");
        ns.tprint("Example: run hack-universal.js joesguns");
        return;
    }
    
    // Verify target exists
    if (!ns.serverExists(target)) {
        ns.tprint(`ERROR: Server "${target}" does not exist!`);
        return;
    }

    // Defines how much money a server should have before we hack it
    // In this case, it is set to the maximum amount of money.
    const moneyThresh = ns.getServerMaxMoney(target);

    // Defines the minimum security level the target server can
    // have. If the target's security level is higher than this,
    // we'll weaken it before doing anything else
    const securityThresh = ns.getServerMinSecurityLevel(target);

    // Try to root the target if we haven't already
    if (!ns.hasRootAccess(target)) {
        // If we have the BruteSSH.exe program, use it to open the SSH Port
        if (ns.fileExists("BruteSSH.exe", "home")) {
            ns.brutessh(target);
        }
        if (ns.fileExists("FTPCrack.exe", "home")) {
            ns.ftpcrack(target);
        }
        if (ns.fileExists("relaySMTP.exe", "home")) {
            ns.relaysmtp(target);
        }
        if (ns.fileExists("HTTPWorm.exe", "home")) {
            ns.httpworm(target);
        }
        if (ns.fileExists("SQLInject.exe", "home")) {
            ns.sqlinject(target);
        }

        // Get root access to target server
        try {
            ns.nuke(target);
        } catch (e) {
            ns.tprint(`ERROR: Cannot nuke ${target}: ${e}`);
            return;
        }
    }

    // Infinite loop that continously hacks/grows/weakens the target server
    while(true) {
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            // If the server's security level is above our threshold, weaken it
            await ns.weaken(target);
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            // If the server's money is less than our threshold, grow it
            await ns.grow(target);
        } else {
            // Otherwise, hack it
            await ns.hack(target);
        }
    }
}

