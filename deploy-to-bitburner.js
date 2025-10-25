/** deploy-to-bitburner.js
 * 
 * Auto-deploy script for Bitburner Remote File API
 * 
 * HOW TO USE:
 * 
 * 1. Host these scripts on GitHub/web server
 * 2. In Bitburner, create a file called "update.js" with this content:
 * 
 *    const baseUrl = "YOUR_GITHUB_RAW_URL";
 *    const files = [
 *      "attack-hack.js",
 *      "attack-grow.js",
 *      "attack-weaken.js",
 *      "simple-batcher.js",
 *      "batch-manager.js",
 *      "profit-scan.js",
 *      "production-monitor.js",
 *      // ... add more files as needed
 *    ];
 * 
 *    export async function main(ns) {
 *      for (const file of files) {
 *        const url = `${baseUrl}/${file}`;
 *        try {
 *          await ns.wget(url, file);
 *          ns.tprint(`✓ Downloaded: ${file}`);
 *        } catch (e) {
 *          ns.tprint(`✗ Failed: ${file} - ${e}`);
 *        }
 *      }
 *      ns.tprint("Update complete!");
 *    }
 * 
 * 3. Run: run update.js
 * 
 * GITHUB SETUP:
 * 1. Create a GitHub repository
 * 2. Upload all .js files from the organized folders to the repo root
 * 3. Get the "raw" URL (e.g., https://raw.githubusercontent.com/username/repo/main/)
 * 4. Use that as your baseUrl
 */

/** @param {NS} ns */
export async function main(ns) {
  ns.tprint("This is a template file.");
  ns.tprint("See the header comments for setup instructions.");
}
