/** check-stock-api.js
 * Check what stock market API access you currently have
 */

/** @param {NS} ns */
export async function main(ns) {
  ns.tprint("═".repeat(50));
  ns.tprint("STOCK MARKET API ACCESS CHECK");
  ns.tprint("═".repeat(50));
  
  const hasWSE = ns.stock.hasWSEAccount();
  const hasTIX = ns.stock.hasTIXAPIAccess();
  const has4SData = ns.stock.has4SDataTIXAPI();
  
  ns.tprint(`\n✓ WSE Account: ${hasWSE ? "YES" : "NO"}`);
  ns.tprint(`✓ TIX API Access: ${hasTIX ? "YES" : "NO"}`);
  ns.tprint(`✓ 4S Market Data TIX API: ${has4SData ? "YES" : "NO"}`);
  
  // Check if short functions exist
  ns.tprint("\n--- Testing Short Functions ---");
  try {
    // Try to check if we can short (this will tell us if the function exists)
    const testSymbol = ns.stock.getSymbols()[0];
    const position = ns.stock.getPosition(testSymbol);
    const [longShares, longPrice, shortShares, shortPrice] = position;
    
    ns.tprint(`✓ Short position data accessible: YES`);
    ns.tprint(`  (Can read: longShares=${longShares}, shortShares=${shortShares})`);
    
    // Test if buyShort function exists
    if (typeof ns.stock.buyShort === 'function') {
      ns.tprint(`✓ buyShort() function exists: YES`);
    } else {
      ns.tprint(`✗ buyShort() function exists: NO`);
    }
    
    if (typeof ns.stock.sellShort === 'function') {
      ns.tprint(`✓ sellShort() function exists: YES`);
    } else {
      ns.tprint(`✗ sellShort() function exists: NO`);
    }
    
  } catch (error) {
    ns.tprint(`✗ Error accessing short functions: ${error.message}`);
  }
  
  ns.tprint("\n" + "═".repeat(50));
  ns.tprint("SUMMARY:");
  ns.tprint("═".repeat(50));
  
  if (!hasWSE) {
    ns.tprint("❌ You need WSE Account first!");
  } else if (!hasTIX) {
    ns.tprint("❌ You need TIX API Access!");
  } else if (!has4SData) {
    ns.tprint("❌ You need 4S Market Data TIX API for forecasts!");
  } else {
    ns.tprint("✅ You have all basic stock market access!");
    ns.tprint("\nCan you short stocks? Check game UI for:");
    ns.tprint("- 'Buy Short' button in stock interface");
    ns.tprint("- Or additional upgrade option in stock market");
  }
  
  ns.tprint("═".repeat(50));
}

