/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0];
  if (!target) return;
  
  // Continuous loop for batch operations
  while (true) {
    await ns.hack(target);
  }
}
