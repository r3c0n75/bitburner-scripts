# Error Handling and Logging Improvements

This document details the specific improvements made to error handling and logging throughout the Bitburner script collection.

## 📋 Overview of Improvements

### 1. **Structured Logging System**
### 2. **Try-Catch Error Handling**
### 3. **Validation and Early Returns**
### 4. **Detailed Error Messages**
### 5. **Success/Failure Tracking**

---

## 1. Structured Logging System

### Simple Batcher (`batch/simple-batcher.js`)

**Before** (implicit):
```javascript
ns.tprint("something happened");
```

**After** (structured):
```javascript
const log = (...parts) => {
  const msg = parts.join(" ");
  if (quiet) ns.print(msg); else ns.tprint(msg);
};
const logError = (...parts) => ns.tprint(parts.join(" "));

log(`simple-batcher: target=${target} cap=${isFinite(capThreads) ? capThreads : "none"}`);
logError(`ERROR: helper missing on ${host}: ${f}`);
```

**Benefits**:
- Supports `--quiet` flag for reduced output
- Consistent error formatting
- Separates info logs from error logs

### Batch Manager (`batch/batch-manager.js`)

**Improvement**:
```javascript
const info = (...parts) => ns.print(parts.join(" "));
const warn = (...parts) => ns.tprint("[WARN] " + parts.join(" "));
const error = (...parts) => ns.tprint("[ERR] " + parts.join(" "));

error(`scp failed. ${batcher} not present on ${pservHost} and cannot be copied.`);
error(`Insufficient RAM on ${pservHost}: free=${freeRam.toFixed(2)}GB need=${scriptRam.toFixed(2)}GB`);
```

**Benefits**:
- Three-level logging (info, warn, error)
- Clear severity indicators
- Quiet-aware logging

---

## 2. Try-Catch Error Handling

### Deploy Hack Joesguns (`deploy/deploy-hack-joesguns.js`)

**Improvement**:
```javascript
for (const host of servers) {
  if (!ns.hasRootAccess(host)) continue;
  if (host === "home") continue;

  try {
    // Copy script if needed
    if (!ns.fileExists(script, host)) {
      const copied = ns.scp(script, host);
      if (!copied) {
        ns.tprint(`Failed to copy ${script} to ${host}`);
        failed++;
        continue;
      }
    }

    // Check RAM
    const ramPer = ns.getScriptRam(script, host);
    const free = Math.max(0, ns.getServerMaxRam(host) - ns.getServerUsedRam(host));
    
    if (free < ramPer) {
      ns.tprint(`${host}: insufficient RAM (${free.toFixed(2)}GB < ${ramPer.toFixed(2)}GB)`);
      failed++;
      continue;
    }
    
    // ... deployment logic ...
    
  } catch (e) {
    ns.tprint(`Error deploying to ${host}: ${e}`);
    failed++;
  }
}
```

**Benefits**:
- Catches unexpected errors
- Continues execution on failure
- Tracks failed operations
- Provides specific error context

### Server Info (`utils/server-info.js`)

**Improvement**:
```javascript
try {
  const info = {
    name: target,
    maxMoney: ns.getServerMaxMoney(target),
    currentMoney: ns.getServerMoneyAvailable(target),
    // ... more properties ...
  };

  ns.tprint(`\n=== Server Information: ${target} ===`);
  ns.tprint(`Money: ${ns.nFormat(info.currentMoney, "$0.00a")} / ${ns.nFormat(info.maxMoney, "$0.00a")}`);
  // ... more output ...
  
} catch (e) {
  ns.tprint(`Error getting server info for ${target}: ${e}`);
}
```

**Benefits**:
- Graceful failure on invalid server
- User-friendly error message
- Prevents script crash

---

## 3. Validation and Early Returns

### Simple Batcher (`batch/simple-batcher.js`)

**Improvement**:
```javascript
// Validate target parameter
const target = args.shift();
if (!target) {
  ns.tprint("Usage: run simple-batcher.js <target> [capThreads] [--include-home] [--quiet] [--dry]");
  return;
}

// Ensure helpers exist on the host running the batcher
for (const f of helpers) {
  if (!ns.fileExists(f, host)) {
    logError(`ERROR: helper missing on ${host}: ${f}. Place the helper files on the server running this script and retry.`);
    return;
  }
}

// Validate RAM requirements
const ramPerThread = ns.getScriptRam(hackScript, h);
if (!ramPerThread || isNaN(ramPerThread) || ramPerThread <= 0) {
  logError(`ERROR: cannot determine script RAM for ${hackScript} on ${h}.`);
  continue;
}

// Check thread availability
if (threads < 1) {
  log(`${h}: insufficient RAM (${freeRam.toFixed(2)}GB < ${ramPerThread.toFixed(2)}GB) - Skipping.`);
  continue;
}
```

**Benefits**:
- Early validation prevents downstream errors
- Clear usage message
- Specific error conditions identified
- Skips problematic servers gracefully

### Auto Deploy All (`deploy/auto-deploy-all.js`)

**Improvement**:
```javascript
if (!ns.fileExists(script, "home")) {
  ns.tprint(`ERROR: ${script} not on home`);
  return;
}

// ... later in loop ...

if (free < ramPer) { 
  ns.tprint(`${host}: insufficient RAM (${free} < ${ramPer})`); 
  continue; 
}
```

**Benefits**:
- Validates prerequisites before execution
- Clear error messages
- Continues to next server on failure

---

## 4. Detailed Error Messages

### Batch Manager (`batch/batch-manager.js`)

**Improvement**:
```javascript
// Detailed SCP failure message
if (!ok) {
  error(`scp failed. ${batcher} not present on ${pservHost} and cannot be copied.`);
  await ns.sleep(intervalMs);
  continue;
}

// Detailed RAM check failure
if (freeRam < scriptRam) {
  error(`Insufficient RAM on ${pservHost}: free=${freeRam.toFixed(2)}GB need=${scriptRam.toFixed(2)}GB. Will retry.`);
  await ns.sleep(intervalMs);
  continue;
}

// Detailed exec failure message
if (pid > 0) {
  info(`Started ${batcher} on ${pservHost} pid=${pid} args=${JSON.stringify(args)}`);
} else {
  error(`Failed to start ${batcher} on ${pservHost} via exec(). Possible causes: insufficient RAM, invalid args, or file missing.`);
  error(`DEBUG: ${pservHost} freeRam=${freeRam.toFixed(2)}GB scriptRam=${scriptRam.toFixed(2)}GB fileExists=${ns.fileExists(batcher, pservHost)}`);
}
```

**Benefits**:
- Explains what went wrong
- Provides diagnostic information
- Suggests next steps
- Shows exact values for debugging

### Replace Purchased Servers (`deploy/replace-pservs-no-copy.js`)

**Improvement**:
```javascript
ns.tprint(`Replacing ${pservs.length} purchased servers with ${ram}GB RAM`);
ns.tprint(`Cost per server: ${ns.nFormat(cost, "$0.00a")}`);
ns.tprint(`Total cost: ${ns.nFormat(cost * pservs.length, "$0.00a")}`);

if (ns.getPlayer().money < cost * pservs.length) {
  ns.tprint(`Insufficient funds! Need ${ns.nFormat(cost * pservs.length, "$0.00a")}`);
  return;
}

// ... later ...

if (!deleted) {
  ns.tprint(`Failed to delete ${pserv}`);
  failed++;
  continue;
}

if (purchased) {
  ns.tprint(`Replaced ${pserv} with ${ram}GB RAM`);
  replaced++;
} else {
  ns.tprint(`Failed to purchase new ${pserv}`);
  failed++;
}
```

**Benefits**:
- Pre-operation summary
- Cost calculation displayed
- Clear success/failure per operation
- Final summary with counts

---

## 5. Success/Failure Tracking

### Deploy Hack Joesguns (`deploy/deploy-hack-joesguns.js`)

**Improvement**:
```javascript
let deployed = 0;
let failed = 0;

for (const host of servers) {
  // ... deployment logic ...
  
  const pid = ns.exec(script, host, threads);
  if (pid > 0) {
    ns.tprint(`Deployed ${script} on ${host} with ${threads} threads (pid: ${pid})`);
    deployed++;
  } else {
    ns.tprint(`Failed to start ${script} on ${host}`);
    failed++;
  }
}

ns.tprint(`\nDeployment complete: ${deployed} successful, ${failed} failed`);
```

**Benefits**:
- Tracks operation statistics
- Final summary shows success rate
- Easy to identify problematic servers
- Clear completion status

### Replace Purchased Servers (`deploy/replace-pservs-no-copy.js`)

**Improvement**:
```javascript
let replaced = 0;
let failed = 0;

for (const pserv of pservs) {
  try {
    // ... replacement logic ...
    if (purchased) {
      ns.tprint(`Replaced ${pserv} with ${ram}GB RAM`);
      replaced++;
    } else {
      ns.tprint(`Failed to purchase new ${pserv}`);
      failed++;
    }
  } catch (e) {
    ns.tprint(`Error replacing ${pserv}: ${e}`);
    failed++;
  }
}

ns.tprint(`\nReplacement complete: ${replaced} successful, ${failed} failed`);
```

**Benefits**:
- Completion summary
- Clear success metrics
- Easy troubleshooting

---

## 6. Nested Error Handling

### Simple Batcher (`batch/simple-batcher.js`)

**Improvement**:
```javascript
// Outer try for scp
try {
  if (!dryRun) {
    const ok = ns.scp(helpers, h, host);
    if (!ok) {
      log(`WARN: scp failed for ${h} (helpers not copied).`);
    }
  }
} catch (e) {
  log(`WARN: scp error to ${h}: ${e}`);
}

// Separate try for process management
try {
  const procs = ns.ps(h);
  let found = false;
  for (const p of procs) {
    if (helpers.includes(p.filename)) {
      found = true;
      if (!dryRun) {
        try { ns.kill(p.filename, h); } catch (e) { /* ignore */ }
      }
    }
  }
  if (found) {
    log(`Info: ${h} - attempted kill of existing helper processes.`);
  }
} catch (e) {
  log(`WARN: failed to inspect/kill procs on ${h}: ${e}`);
}
```

**Benefits**:
- Independent error handling for each operation
- One failure doesn't cascade
- Specific error messages per operation
- Continues execution despite individual failures

---

## 7. Enhanced RAM Validation

### Home Batcher (`deploy/home-batcher.js`)

**Improvement**:
```javascript
const ramPerThread = ns.getScriptRam(hackScript, host);
if (!ramPerThread || isNaN(ramPerThread) || ramPerThread <= 0) {
  ns.tprint(`ERROR: cannot determine script RAM for ${hackScript}`);
  return;
}

const threads = Math.floor(freeRam / ramPerThread);
if (threads < 1) {
  ns.tprint(`Insufficient RAM: ${freeRam.toFixed(2)}GB < ${ramPerThread.toFixed(2)}GB`);
  return;
}
```

**Benefits**:
- Multiple validation conditions
- Formatted numbers for readability
- Clear comparison of available vs required

---

## Summary of Improvements

### ✅ Before vs After

| Aspect | Before | After |
|--------|--------|-------|
| **Error Messages** | Generic or missing | Specific with context |
| **Logging** | Inconsistent | Structured with levels |
| **Validation** | Basic | Comprehensive with early returns |
| **Error Recovery** | Script crashes | Graceful continuation |
| **Debugging** | Difficult | Detailed diagnostic info |
| **Success Tracking** | None | Counters and summaries |
| **User Feedback** | Minimal | Clear, actionable messages |

### 🎯 Key Benefits

1. **Better Debugging** - Detailed error messages with context
2. **Graceful Failures** - Scripts continue despite individual errors
3. **User-Friendly** - Clear messages explaining what went wrong
4. **Production-Ready** - Comprehensive error handling prevents crashes
5. **Quiet Mode** - Supports automation with reduced output
6. **Statistics** - Success/failure tracking for monitoring

---

This comprehensive error handling makes the script collection production-ready and significantly easier to debug and maintain!
