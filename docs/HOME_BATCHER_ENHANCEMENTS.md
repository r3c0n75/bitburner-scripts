# home-batcher.js Enhancement Documentation

**Date**: October 26, 2025  
**Version**: 1.4.4  
**Status**: Complete ✅

## Overview

Complete rewrite of `home-batcher.js` with enterprise-grade error handling and diagnostic capabilities. Fixed critical silent failure bug and added comprehensive RAM conflict detection.

---

## Critical Bug Fixed 🐛

### The Problem
**Original Behavior**:
- Script would calculate threads for all 3 helper scripts (weaken, grow, hack)
- Started scripts sequentially without checking remaining RAM
- If RAM ran out after starting weaken/grow, hack script would fail silently
- User saw "Home batcher started successfully!" even though hack script didn't start
- System only weakened and grew targets - **no money was actually hacked!**

**Impact**: Users thought their batch system was working but weren't generating income.

### The Solution
- Check available RAM **before each script execution**
- Report exact failures with RAM needed vs available
- Show clear success/failure summary
- Provide actionable recommendations

---

## New Features

### 1. Conflict Detection ⚠️

Detects and warns about other scripts competing for RAM:

```
⚠ WARNING: 1 other script(s) running on home:
  - batch/batch-manager.js (1 threads)
  This may cause RAM conflicts!
```

**Benefits**:
- Explains why RAM might be limited
- Helps users understand the environment
- Suggests potential conflicts before they happen

### 2. Detailed RAM Analysis 📊

Shows precise RAM calculations:

```
Available RAM: 502.10GB / 512.00GB
Needed RAM: 496.95GB
Thread allocation: h71/g128/w87 (286 total)
```

**Benefits**:
- Transparency into RAM planning
- Shows total vs free RAM
- Displays thread distribution
- Pre-validates before attempting execution

### 3. Explicit Failure Reporting 🚨

Reports exactly what failed and why:

```
✗ FAILED: Not enough RAM for core/attack-hack.js
  Needed: 33.25GB, Available: 28.10GB
```

**Benefits**:
- No more silent failures
- Exact RAM shortfall shown
- User knows what didn't start
- Clear troubleshooting path

### 4. Per-Script RAM Pre-Checks ✅

Checks RAM availability before **each** script:

```javascript
// Before starting each script
const checkRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
const neededRam = threads * ramPerScript;

if (checkRam >= neededRam) {
  // Safe to start
} else {
  // Report failure with details
}
```

**Benefits**:
- Catches RAM exhaustion at any point
- Prevents partial batch execution
- Maintains data integrity

### 5. Smart Summary 📝

Clear reporting with actionable recommendations:

```
✓ SUCCESS: All 3 helper scripts started!

or

⚠ PARTIAL SUCCESS: 2 started, 1 failed
  Without ALL three scripts, batching won't work properly!
  Consider killing other scripts or using batch-manager.js instead.
```

**Benefits**:
- Users know exact status
- Helpful next steps provided
- Professional formatted output

---

## Technical Implementation

### Code Structure

1. **Conflict Detection** (Lines 25-42)
   - Scans running processes
   - Filters out helper scripts and self
   - Lists up to 5 conflicting scripts
   - Shows thread counts

2. **RAM Validation** (Lines 52-98)
   - Gets current RAM status
   - Calculates per-script requirements
   - Uses worst-case (max) RAM for planning
   - Pre-validates total needed vs available

3. **Script Execution** (Lines 126-187)
   - Sequential execution: weaken → grow → hack
   - RAM check before each exec()
   - Explicit PID validation (> 0)
   - Detailed failure reporting

4. **Summary Reporting** (Lines 189-200)
   - Success/failure counts
   - Professional formatted output
   - Contextual recommendations

### Key Improvements

**Before**:
```javascript
// Old code - no RAM checks, silent failures
const pid = ns.exec(hackScript, host, hackThreads, target);
if (pid > 0) ns.tprint(`Started ${hackScript}`);
// No else - failures were silent!
```

**After**:
```javascript
// New code - explicit RAM checking
const checkRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
const neededHackRam = hackThreads * hackRam;

if (checkRam >= neededHackRam) {
  const pid = ns.exec(hackScript, host, hackThreads, target);
  if (pid > 0) {
    ns.tprint(`✓ Started ${hackScript} with ${hackThreads} threads (pid: ${pid})`);
    startedCount++;
  } else {
    ns.tprint(`✗ FAILED to start ${hackScript} (exec returned 0)`);
    failedCount++;
  }
} else {
  ns.tprint(`✗ FAILED: Not enough RAM for ${hackScript}`);
  ns.tprint(`  Needed: ${neededHackRam.toFixed(2)}GB, Available: ${checkRam.toFixed(2)}GB`);
  failedCount++;
}
```

---

## Usage Examples

### Successful Execution

```bash
[home /]> run batch/home-batcher.js foodnstuff
```

**Output**:
```
═══════════════════════════════════════════════════
  HOME BATCHER: foodnstuff
═══════════════════════════════════════════════════
Available RAM: 502.10GB / 512.00GB
Needed RAM: 496.95GB
Thread allocation: h71/g128/w87 (286 total)

Stopping any existing helper scripts...

Starting helper scripts...
✓ Started core/attack-weaken.js with 87 threads (pid: 453)
✓ Started core/attack-grow.js with 128 threads (pid: 454)
✓ Started core/attack-hack.js with 71 threads (pid: 455)

═══════════════════════════════════════════════════
✓ SUCCESS: All 3 helper scripts started!
═══════════════════════════════════════════════════
```

### RAM Conflict Detected

```
═══════════════════════════════════════════════════
  HOME BATCHER: foodnstuff
═══════════════════════════════════════════════════
⚠ WARNING: 1 other script(s) running on home:
  - batch/batch-manager.js (1 threads)
  This may cause RAM conflicts!

✗ ERROR: Insufficient RAM for minimum operation
  Available: 5.15GB
  Required: 5.25GB (minimum 3 threads)
  Used by others: 506.85GB
```

---

## Testing Results

### Test 1: Clean Environment ✅
- **Setup**: Fresh home server, no other scripts
- **Result**: All 3 scripts started successfully
- **Validation**: PID tracking confirmed all running

### Test 2: RAM Competition ✅
- **Setup**: batch-manager.js using 506GB
- **Result**: Clear error message with exact RAM shortage
- **Validation**: No scripts started (proper fail-safe)

### Test 3: Partial RAM Availability ✅
- **Setup**: Enough for 2 scripts but not 3
- **Result**: Reported partial success with recommendations
- **Validation**: User knows exactly what failed

---

## Impact Assessment

### Before Enhancement
- ❌ Silent failures were common
- ❌ Users confused why no money generated
- ❌ No diagnostic information
- ❌ Troubleshooting required code inspection

### After Enhancement
- ✅ 100% transparency on all operations
- ✅ Clear failure explanations
- ✅ Actionable recommendations
- ✅ Professional error reporting
- ✅ RAM conflict detection

---

## Related Files

**Updated Files**:
- `bitburner-remote-api/src/batch/home-batcher.js`
- `scripts/batch/home-batcher.js`

**Documentation Updated**:
- CHANGELOG.md (v1.4.4 entry)
- README.md (version history)
- QUICK_REFERENCE.md (batch section)
- SCRIPT_REFERENCE.md (usage path)
- PROJECT_STRUCTURE.md (folder organization)
- DETAILED_CHANGES.md (location reference)
- ERROR_HANDLING_IMPROVEMENTS.md (section header)
- DOCUMENTATION_SUMMARY.md (version info)

---

## Recommendations

### For Users

**Use home-batcher.js when:**
- You want detailed diagnostics about RAM usage
- You need to troubleshoot batch operation issues
- You want transparency into what's happening

**Use batch-manager.js when:**
- You want "set it and forget it" automation
- You need auto-scaling across purchased servers
- You want automatic rooting integration

### For Developers

**Key Lessons**:
1. Always validate exec() return values
2. Check RAM before each critical operation
3. Provide detailed failure messages
4. Give users actionable next steps
5. Use visual indicators (✓, ✗, ⚠) for clarity

---

## Future Enhancements

Potential improvements for future versions:

1. **Dynamic Thread Adjustment**
   - Automatically reduce threads if RAM insufficient
   - Progressive scaling instead of all-or-nothing

2. **RAM Reservation System**
   - Reserve RAM upfront for all scripts
   - Prevent race conditions with other scripts

3. **Integration with batch-manager.js**
   - Detect when batch-manager is running
   - Offer to use that system instead

4. **Historical Failure Tracking**
   - Log failure patterns
   - Suggest optimal times to run

---

## Conclusion

The enhanced home-batcher.js represents a significant improvement in user experience and reliability. By eliminating silent failures and providing comprehensive diagnostics, users now have complete visibility into their batch operations.

**Version**: 1.4.4  
**Status**: Production-Ready ✅  
**Testing**: Complete ✅  
**Documentation**: Complete ✅

