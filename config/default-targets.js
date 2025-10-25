/** default-targets.js
 * Default target servers for different game stages.
 * Usage: Import this file to get predefined target configurations.
 */

export const TARGETS = {
  // Early game targets (low security, good money)
  EARLY: [
    "n00dles",
    "foodnstuff", 
    "sigma-cosmetics",
    "joesguns",
    "hong-fang-tea",
    "harakiri-sushi"
  ],

  // Mid game targets (moderate security, good money)
  MID: [
    "joesguns",
    "hong-fang-tea", 
    "harakiri-sushi",
    "iron-gym",
    "zer0",
    "max-hardware",
    "CSEC"
  ],

  // Late game targets (high security, excellent money)
  LATE: [
    "joesguns",
    "hong-fang-tea",
    "harakiri-sushi", 
    "iron-gym",
    "zer0",
    "max-hardware",
    "CSEC",
    "neo-net",
    "silver-helix",
    "omega-net",
    "the-hub",
    "comptek",
    "netlink",
    "crush-fitness",
    "johnson-ortho",
    "avmnite-02h",
    "I.I.I.I",
    "run4theh111z"
  ],

  // End game targets (maximum money)
  ENDGAME: [
    "omega-net",
    "the-hub", 
    "comptek",
    "netlink",
    "crush-fitness",
    "johnson-ortho",
    "avmnite-02h",
    "I.I.I.I",
    "run4theh111z"
  ]
};

export const RECOMMENDED_SETTINGS = {
  // Thread distribution for batch operations
  THREAD_DISTRIBUTION: {
    HACK_PERCENT: 0.25,    // 25% hack threads
    GROW_PERCENT: 0.45,    // 45% grow threads  
    WEAKEN_PERCENT: 0.30   // 30% weaken threads
  },

  // Batch timing multipliers
  TIMING_MULTIPLIERS: {
    CONSERVATIVE: 1.0,     // No multiplier
    BALANCED: 1.25,        // 25% buffer
    AGGRESSIVE: 1.5         // 50% buffer
  },

  // RAM thresholds for different operations
  RAM_THRESHOLDS: {
    MIN_FOR_BATCH: 1.0,    // Minimum RAM for batch operations
    RECOMMENDED_FOR_BATCH: 4.0, // Recommended RAM for batch operations
    IDEAL_FOR_BATCH: 8.0   // Ideal RAM for batch operations
  }
};
