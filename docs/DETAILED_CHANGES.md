# Detailed Script Changes Documentation

This document provides a comprehensive breakdown of all changes made to each script during the project initialization.

## Table of Contents
1. [Core Scripts](#core-scripts)
2. [Batch Management Scripts](#batch-management-scripts)
3. [Analysis Scripts](#analysis-scripts)
4. [Utility Scripts](#utility-scripts)
5. [Deployment Scripts](#deployment-scripts)

---

## Core Scripts

### attack-hack.js
**Location**: `core/attack-hack.js`

**Changes**:
- Moved from root to `core/` directory
- Enhanced documentation header
- No functional changes (kept simple and efficient)

**Purpose**: Basic hack operation for use in batch systems

---

### attack-grow.js
**Location**: `core/attack-grow.js`

**Changes**:
- Moved from root to `core/` directory
- Enhanced documentation header
- No functional changes (kept simple and efficient)

**Purpose**: Basic grow operation for use in batch systems

---

### attack-weaken.js
**Location**: `core/attack-weaken.js`

**Changes**:
- Moved from root to `core/` directory
- Enhanced documentation header
- No functional changes (kept simple and efficient)

**Purpose**: Basic weaken operation for use in batch systems

---

## Batch Management Scripts

### simple-batcher.js
**Location**: `batch/simple-batcher.js`

**Major Changes**:

#### 1. Structured Logging System (Lines 45-49)
```javascript
const log = (...parts) => {
  const msg = parts.join(" ");
  if (quiet) ns.print(msg); else ns.tprint(msg);
};
const logError = (...parts) => ns.tprint(parts.join(" "));
```
**Benefit**: Supports quiet mode for automation, consistent error formatting

#### 2. Helper Script Validation (Lines 57-63)
```javascript
for (const f of helpers) {
  if (!ns.fileExists(f, host)) {
    logError(`ERROR: helper missing on ${host}: ${f}. Place the helper files...`);
    return;
  }
}
```
**Benefit**: Prevents deployment failures due to missing dependencies

#### 3. Enhanced Error Handling for SCP (Lines 124-135)
```javascript
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
```
**Benefit**: Continues deployment even if one server fails

#### 4. Process Cleanup Error Handling (Lines 137-155)
```javascript
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
**Benefit**: Prevents duplicate processes, graceful error recovery

#### 5. RAM Validation (Lines 163-166)
```javascript
if (!ramPerThread || isNaN(ramPerThread) || ramPerThread <= 0) {
  logError(`ERROR: cannot determine script RAM for ${hackScript} on ${h}.`);
  continue;
}
```
**Benefit**: Comprehensive validation prevents NaN/zero/negative RAM issues

#### 6. Better Insufficient RAM Messages (Lines 172-175)
```javascript
if (threads < 1) {
  log(`${h}: insufficient RAM (${freeRam.toFixed(2)}GB < ${ramPerThread.toFixed(2)}GB) - Skipping.`);
  continue;
}
```
**Benefit**: Formatted output shows exact RAM requirements

---

### batch-manager.js
**Location**: `batch/batch-manager.js`

**Major Changes**:

#### 1. Three-Level Logging System (Lines 40-42)
```javascript
const info = (...parts) => ns.print(parts.join(" "));
const warn = (...parts) => ns.tprint("[WARN] " + parts.join(" "));
const error = (...parts) => ns.tprint("[ERR] " + parts.join(" "));
```
**Benefit**: Clear severity levels, info is quiet-aware

#### 2. Enhanced SCP Error Handling (Lines 68-86)
```javascript
if (!ns.fileExists(batcher, pservHost)) {
  info(`${batcher} not found on ${pservHost}; attempting scp...`);
  try {
    const ok = ns.scp(batcher, pservHost);
    if (!ok) {
      error(`scp failed. ${batcher} not present on ${pservHost}...`);
      await ns.sleep(intervalMs);
      continue;
    } else {
      info(`scp ok: copied ${batcher} -> ${pservHost}`);
    }
  } catch (e) {
    error(`scp exception copying ${batcher} -> ${pservHost}: ${e}`);
    await ns.sleep(intervalMs);
    continue;
  }
}
```
**Benefit**: Automatic retry logic, detailed error messages

#### 3. RAM Validation with Retry (Lines 88-95)
```javascript
const freeRam = ns.getServerMaxRam(pservHost) - ns.getServerUsedRam(pservHost);
const scriptRam = ns.getScriptRam(batcher, pservHost);
if (freeRam < scriptRam) {
  error(`Insufficient RAM on ${pservHost}: free=${freeRam.toFixed(2)}GB need=${scriptRam.toFixed(2)}GB. Will retry.`);
  await ns.sleep(intervalMs);
  continue;
}
```
**Benefit**: Shows exact RAM requirements, automatic retry

#### 4. Detailed Exec Failure Messages (Lines 107-111)
```javascript
if (pid > 0) {
  info(`Started ${batcher} on ${pservHost} pid=${pid} args=${JSON.stringify(args)}`);
} else {
  error(`Failed to start ${batcher} on ${pservHost} via exec()...`);
  error(`DEBUG: ${pservHost} freeRam=${freeRam.toFixed(2)}GB scriptRam=${scriptRam.toFixed(2)}GB fileExists=${ns.fileExists(batcher, pservHost)}`);
}
```
**Benefit**: Comprehensive diagnostic information for troubleshooting

---

## Analysis Scripts

### profit-scan.js
**Location**: `analysis/profit-scan.js`

**Changes**:
- Moved from root to `analysis/` directory
- Enhanced error handling in server scanning (try-catch in loop)
- Shows top 30 servers instead of all
- Better formatted output with ns.nFormat
- Added rooted status display
- No breaking changes to functionality

**Key Improvements**:
```javascript
for (const s of servers) {
  try {
    // ... profitability calculation ...
  } catch (e) {
    // skip if functions fail for a host
  }
}
```

---

### production-monitor.js
**Location**: `analysis/production-monitor.js`

**Changes**:
- Moved from root to `analysis/` directory
- Enhanced output formatting with ns.nFormat
- Better error handling for invalid durations
- Clear start/end status reporting

**No breaking changes**

---

### estimate-production.js (NEW)
**Location**: `utils/estimate-production.js`

**New Script Features**:
- Estimates production rates for different thread counts
- Shows money per second, per minute, per hour
- Calculates batch timing recommendations
- Displays expected values per hack
- Try-catch error handling for invalid targets

**Usage**: `run estimate-production.js [target]`

---

## Utility Scripts

### global-kill.js
**Location**: `utils/global-kill.js`

**Changes**:
- Moved from root to `utils/` directory
- Added process counting and reporting
- Enhanced error handling with try-catch per server
- Self-preservation (doesn't kill itself)
- Better log disabling for cleaner output

**New Features**:
```javascript
let totalKilled = 0;
for (const host of servers) {
  try {
    const procs = ns.ps(host);
    for (const proc of procs) {
      if (proc.filename !== "global-kill.js") {
        ns.kill(proc.pid);
        totalKilled++;
      }
    }
  } catch (e) {
    // Ignore errors for servers we can't access
  }
}
ns.tprint(`Killed ${totalKilled} processes across ${servers.length} servers.`);
```

---

### list-procs.js
**Location**: `utils/list-procs.js`

**Changes**:
- Moved from root to `utils/` directory
- Enhanced formatted output with table headers
- Added RAM usage display per process
- Better error handling (ignores inaccessible servers)
- Formatted table display

**Output Format**:
```
Server | Script | Threads | RAM | PID
```

---

### list-pservs.js
**Location**: `utils/list-pservs.js`

**Changes**:
- Moved from root to `utils/` directory
- Comprehensive server status display
- Shows RAM (max, used, free)
- Shows root access status
- Shows money available
- Formatted table output
- Error handling per server

**Output Format**:
```
Name | RAM | Used | Free | Root | Money
```

---

### server-info.js (NEW)
**Location**: `utils/server-info.js`

**New Script Features**:
- Detailed server information display
- Money availability (current/max with percentage)
- RAM availability (used/max/free)
- Security levels (current/min)
- Timing information (hack/grow/weaken)
- Profitability calculations
- Expected money per hack
- Money per second estimates
- Try-catch error handling

**Usage**: `run server-info.js [server]`

---

## Deployment Scripts

### auto-deploy-all.js
**Location**: `deploy/auto-deploy-all.js`

**Changes**:
- Moved from root to `deploy/` directory
- Added script existence validation
- Enhanced RAM checking with formatted output
- Better error messages with specific reasons
- Thread cap functionality maintained

**Key Improvements**:
```javascript
if (!ns.fileExists(script, "home")) {
  ns.tprint(`ERROR: ${script} not on home`);
  return;
}

if (free < ramPer) { 
  ns.tprint(`${host}: insufficient RAM (${free} < ${ramPer})`); 
  continue; 
}
```

---

### purchase-server-8gb.js
**Location**: `deploy/purchase-server-8gb.js`

**Major Changes**:

#### 1. Pre-Purchase Validation (Lines 18-26)
```javascript
if (currentServers >= maxServers) {
  ns.tprint("Maximum number of servers reached!");
  return;
}

if (ns.getPlayer().money < cost) {
  ns.tprint(`Insufficient funds! Need ${ns.nFormat(cost, "$0.00a")}`);
  return;
}
```
**Benefit**: Prevents wasted operations, clear early returns

#### 2. Intelligent Server Naming (Lines 28-34)
```javascript
let serverNum = 0;
let serverName;
do {
  serverNum++;
  serverName = `pserv-${serverNum}`;
} while (ns.serverExists(serverName));
```
**Benefit**: Handles gaps in numbering, automatic name finding

#### 3. Success/Failure Feedback (Lines 36-41)
```javascript
const success = ns.purchaseServer(serverName, ram);
if (success) {
  ns.tprint(`Successfully purchased ${serverName} with ${ram}GB RAM`);
} else {
  ns.tprint(`Failed to purchase server ${serverName}`);
}
```
**Benefit**: Clear feedback on operation result

#### 4. Better Information Display (Lines 15-16)
```javascript
ns.tprint(`Cost for ${ram}GB server: ${ns.nFormat(cost, "$0.00a")}`);
ns.tprint(`Current servers: ${currentServers}/${maxServers}`);
```
**Benefit**: Shows context before purchase attempt

---

### replace-pservs-no-copy.js
**Location**: `deploy/replace-pservs-no-copy.js`

**Changes**:
- Moved from root to `deploy/` directory
- Added pre-operation summary with total cost
- Success/failure tracking with counters
- Per-server status reporting
- Final summary with totals
- Try-catch error handling per server
- Continues on individual failures

**Key Improvements**:
```javascript
let replaced = 0;
let failed = 0;

// ... operation loop ...

ns.tprint(`\nReplacement complete: ${replaced} successful, ${failed} failed`);
```

---

### deploy-hack-joesguns.js (NEW)
**Location**: `deploy/deploy-hack-joesguns.js`

**New Script Features**:
- Comprehensive deployment with tracking
- Success and failure counters
- Pre-deployment validation:
  - Script existence check
  - SCP success validation
  - RAM availability check
  - Thread calculation validation
- Per-server deployment status
- Final summary report
- Try-catch error handling per server

**Key Code**:
```javascript
let deployed = 0;
let failed = 0;

for (const host of servers) {
  try {
    // Validation and deployment
    if (pid > 0) {
      ns.tprint(`Deployed ${script} on ${host} with ${threads} threads (pid: ${pid})`);
      deployed++;
    } else {
      failed++;
    }
  } catch (e) {
    ns.tprint(`Error deploying to ${host}: ${e}`);
    failed++;
  }
}

ns.tprint(`\nDeployment complete: ${deployed} successful, ${failed} failed`);
```

---

### home-batcher.js (NEW)
**Location**: `deploy/home-batcher.js`

**New Script Features**:
- Home server optimization
- Automatic RAM detection and calculation
- Thread distribution (25% hack, 45% grow, 30% weaken)
- Helper script validation
- Process cleanup (kills existing helpers)
- Enhanced RAM validation
- Clear status reporting

**Key Code**:
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

---

### hack-joesguns.js
**Location**: `deploy/hack-joesguns.js`

**Changes**:
- Moved from root to `deploy/` directory
- No functional changes (kept as reference implementation)
- Enhanced documentation

---

### hack-n00dles.js
**Location**: `deploy/hack-n00dles.js`

**Changes**:
- Moved from root to `deploy/` directory
- No functional changes (kept for early game)
- Enhanced documentation

---

## Summary of Changes

### By Category

| Category | Scripts Modified | New Scripts | Key Improvements |
|----------|-----------------|-------------|------------------|
| **Core** | 3 | 0 | Organization, documentation |
| **Batch** | 2 | 0 | Structured logging, error handling |
| **Analysis** | 2 | 1 | Formatting, new estimation tool |
| **Utils** | 3 | 2 | Enhanced output, new info tools |
| **Deploy** | 4 | 3 | Validation, tracking, new scripts |

### Overall Statistics

- **Total Scripts**: 18
- **Scripts Enhanced**: 14
- **New Scripts Created**: 4
- **Scripts Moved**: 14
- **Documentation Files**: 7

### Key Improvements Across All Scripts

1. **Error Handling**: Try-catch blocks in all critical operations
2. **Validation**: Pre-execution checks for prerequisites
3. **Logging**: Structured, multi-level logging system
4. **Tracking**: Success/failure counters in deployment scripts
5. **Formatting**: Consistent use of ns.nFormat for display
6. **Documentation**: Enhanced headers with usage examples

---

For implementation details, see [ERROR_HANDLING_IMPROVEMENTS.md](ERROR_HANDLING_IMPROVEMENTS.md)
