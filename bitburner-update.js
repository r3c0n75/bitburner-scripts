/** bitburner-update.js
 * 
 * Automatic update script for Bitburner Remote File API
 * Works with organized GitHub folder structure
 * Copy this file into Bitburner and customize the baseUrl
 * 
 * Usage: run bitburner-update.js [--all] [--essential] [--utils]
 */

/** @param {NS} ns */
export async function main(ns) {
  // ============================================
  // CONFIGURATION - UPDATE THIS URL
  // ============================================
  const baseUrl = "https://raw.githubusercontent.com/r3c0n75/bitburner-scripts/main";
  
  // Folder paths in your GitHub repo (scripts/ folder IS the repo root)
  const folders = {
    core: { url: `${baseUrl}/core`, local: "core" },
    batch: { url: `${baseUrl}/batch`, local: "batch" },
    analysis: { url: `${baseUrl}/analysis`, local: "analysis" },
    utils: { url: `${baseUrl}/utils`, local: "utils" },
    deploy: { url: `${baseUrl}/deploy`, local: "deploy" },
    stocks: { url: `${baseUrl}/stocks`, local: "stocks" }
  };
  
  // Define script categories with their folder locations
  const scripts = {
    essential: [
      { file: "attack-hack.js", folder: folders.core },
      { file: "attack-grow.js", folder: folders.core },
      { file: "attack-weaken.js", folder: folders.core },
      { file: "simple-batcher.js", folder: folders.batch },
      { file: "smart-batcher.js", folder: folders.batch },
      { file: "profit-scan.js", folder: folders.analysis },
      { file: "profit-scan-flex.js", folder: folders.analysis },
      { file: "f-profit-scan-flex.js", folder: folders.analysis },
      { file: "production-monitor.js", folder: folders.analysis },
      { file: "estimate-production.js", folder: folders.analysis }
    ],
    
    batch: [
      { file: "smart-batcher.js", folder: folders.batch },
      { file: "batch-manager.js", folder: folders.batch },
      { file: "home-batcher.js", folder: folders.batch }
    ],
    
    analysis: [
      { file: "estimate-production.js", folder: folders.analysis },
      { file: "f-estimate-production.js", folder: folders.analysis }
    ],
    
    utils: [
      { file: "global-kill.js", folder: folders.utils },
      { file: "list-procs.js", folder: folders.utils },
      { file: "list-pservs.js", folder: folders.utils },
      { file: "server-info.js", folder: folders.utils },
      { file: "share-ram.js", folder: folders.utils }
    ],
    
    deploy: [
      { file: "auto-expand.js", folder: folders.deploy },
      { file: "hack-universal.js", folder: folders.deploy },
      { file: "purchase-server-8gb.js", folder: folders.deploy },
      { file: "replace-pservs-no-copy.js", folder: folders.deploy },
      { file: "deploy-hack-joesguns.js", folder: folders.deploy },
      { file: "hack-joesguns.js", folder: folders.deploy },
      { file: "hack-n00dles.js", folder: folders.deploy },
      { file: "deploy-share-all.js", folder: folders.deploy }
    ],
    
    stocks: [
      { file: "check-stock-api.js", folder: folders.stocks },
      { file: "stock-info.js", folder: folders.stocks },
      { file: "stock-trader-basic.js", folder: folders.stocks },
      { file: "stock-trader-advanced.js", folder: folders.stocks },
      { file: "stock-trader-momentum.js", folder: folders.stocks },
      { file: "stock-momentum-analyzer.js", folder: folders.stocks },
      { file: "stock-monitor.js", folder: folders.stocks },
      { file: "close-all-stock.js", folder: folders.stocks }
    ]
  };

  // Parse arguments
  const args = ns.args;
  const downloadAll = args.includes("--all");
  const downloadEssential = args.includes("--essential") || args.length === 0;
  const downloadAnalysis = args.includes("--analysis");
  const downloadUtils = args.includes("--utils");
  const downloadBatch = args.includes("--batch");
  const downloadDeploy = args.includes("--deploy");
  const downloadStocks = args.includes("--stocks");

  // Determine which files to download
  let filesToDownload = [];
  
  if (downloadAll) {
    filesToDownload = [
      ...scripts.essential,
      ...scripts.batch,
      ...scripts.analysis,
      ...scripts.utils,
      ...scripts.deploy,
      ...scripts.stocks
    ];
  } else {
    if (downloadEssential) filesToDownload.push(...scripts.essential);
    if (downloadBatch) filesToDownload.push(...scripts.batch);
    if (downloadAnalysis) filesToDownload.push(...scripts.analysis);
    if (downloadUtils) filesToDownload.push(...scripts.utils);
    if (downloadDeploy) filesToDownload.push(...scripts.deploy);
    if (downloadStocks) filesToDownload.push(...scripts.stocks);
  }

  // Download files
  ns.tprint("\n=== Bitburner Script Update ===");
  ns.tprint(`Base URL: ${baseUrl}`);
  ns.tprint(`Organized folder structure maintained on GitHub`);
  ns.tprint(`Files to download: ${filesToDownload.length}\n`);

  let successful = 0;
  let failed = 0;

  for (const script of filesToDownload) {
    const url = `${script.folder.url}/${script.file}`;
    const tempFile = `temp_${script.file}`;
    const finalPath = `${script.folder.local}/${script.file}`;
    try {
      // Download to temp file first
      const success = await ns.wget(url, tempFile);
      if (success) {
        // Read temp file content
        const content = ns.read(tempFile);
        // Write to final path (creates folder automatically in v3.x)
        ns.write(finalPath, content, "w");
        // Delete temp file
        ns.rm(tempFile);
        ns.tprint(`✓ ${finalPath}`);
        successful++;
      } else {
        ns.tprint(`✗ ${finalPath} - Download failed`);
        failed++;
      }
      await ns.sleep(100); // Small delay between downloads
    } catch (e) {
      ns.tprint(`✗ ${finalPath} - Error: ${e}`);
      failed++;
    }
  }

  // Summary
  ns.tprint(`\n=== Update Complete ===`);
  ns.tprint(`Successful: ${successful}`);
  ns.tprint(`Failed: ${failed}`);
  ns.tprint(`Total: ${filesToDownload.length}`);
  
  if (failed > 0) {
    ns.tprint("\nTroubleshooting:");
    ns.tprint("1. Check your baseUrl is correct");
    ns.tprint("2. Ensure files are in the repository root");
    ns.tprint("3. Verify the repository is public");
    ns.tprint("4. Check file names match exactly (case-sensitive)");
  }
}

// Usage examples:
// run bitburner-update.js                  # Download essential scripts (default)
// run bitburner-update.js --all            # Download all scripts
// run bitburner-update.js --essential      # Download essential scripts only
// run bitburner-update.js --analysis       # Download analysis scripts
// run bitburner-update.js --utils          # Download utility scripts
// run bitburner-update.js --batch          # Download batch scripts
// run bitburner-update.js --deploy         # Download deployment scripts
// run bitburner-update.js --stocks         # Download stock trading scripts
// run bitburner-update.js --essential --utils  # Download multiple categories
//
// Note: Scripts are downloaded from GitHub and organized into local folders:
// core/, batch/, analysis/, utils/, deploy/, stocks/
// Folders are created automatically using read/write file operations
