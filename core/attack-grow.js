/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0];
  if (!target) return;
  await ns.grow(target);
}
