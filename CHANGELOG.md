# Changelog

All notable changes to this Bitburner script collection are documented in this file.

## [1.0.0] - 2025-10-25 - Project Initialization

### 🎉 Initial Release - Complete Project Reorganization

#### Added

##### Project Structure
- **Organized directory structure** with logical categorization:
  - `core/` - Core attack scripts (hack, grow, weaken)
  - `batch/` - Batch management scripts
  - `analysis/` - Analysis and monitoring tools
  - `utils/` - Utility scripts for system management
  - `deploy/` - Deployment and server management
  - `config/` - Configuration files and presets
  - `docs/` - Comprehensive documentation

##### Documentation
- **README.md** - Main project overview with quick start guide
- **GETTING_STARTED.md** - Step-by-step getting started guide with game stage progression
- **SCRIPT_REFERENCE.md** - Complete script reference with usage examples
- **PROJECT_STRUCTURE.md** - Detailed directory structure overview
- **ERROR_HANDLING_IMPROVEMENTS.md** - Documentation of error handling enhancements
- **CHANGELOG.md** - This file

##### Configuration Files
- **config/default-targets.js** - Predefined target lists for different game stages:
  - Early game targets (n00dles, foodnstuff, etc.)
  - Mid game targets (joesguns, hong-fang-tea, etc.)
  - Late game targets (neo-net, silver-helix, etc.)
  - End game targets (omega-net, the-hub, etc.)
- Recommended settings for thread distribution and timing multipliers

##### New Utility Scripts
- **utils/server-info.js** - Display detailed server information with profitability analysis
- **utils/estimate-production.js** - Estimate production rates for different thread configurations
- **utils/global-kill.js** - Enhanced with better error handling
- **utils/list-procs.js** - Enhanced with formatted output
- **utils/list-pservs.js** - Enhanced with comprehensive server status

##### New Deployment Scripts
- **deploy/deploy-hack-joesguns.js** - Deploy with success/failure tracking
- **deploy/home-batcher.js** - Home server batch operations with validation

#### Enhanced

##### Core Scripts (`core/`)
All core attack scripts enhanced with:
- Better parameter validation
- Consistent error handling
- Improved documentation headers

##### Batch Management (`batch/`)

**simple-batcher.js** improvements:
- **Structured logging system** with quiet mode support
  - `log()` function respects `--quiet` flag
  - `logError()` for consistent error formatting
- **Enhanced error handling** with try-catch blocks:
  - SCP operations wrapped in error handling
  - Process management with failure recovery
  - RAM validation with detailed messages
- **Better validation**:
  - Helper script existence checks before deployment
  - RAM availability validation with formatted output
  - Thread calculation safety checks
- **Improved dry-run mode** with detailed output
- **Process cleanup** to avoid duplicate deployments

**batch-manager.js** improvements:
- **Three-level logging** (info, warn, error):
  - `info()` for normal operations (quiet-aware)
  - `warn()` for warnings (always visible)
  - `error()` for errors with detailed context
- **Enhanced SCP handling**:
  - Automatic retry on failure
  - Clear error messages with troubleshooting info
- **RAM validation** with formatted output:
  - Shows free vs required RAM
  - Suggests retry on insufficient resources
- **Detailed exec failure messages**:
  - Shows diagnostic information
  - Suggests possible causes
  - Displays debug data for troubleshooting

##### Analysis Scripts (`analysis/`)

**profit-scan.js** improvements:
- Better error handling for inaccessible servers
- Formatted output with currency display
- Shows top 30 targets instead of all
- Enhanced profitability calculations

**production-monitor.js** improvements:
- Better formatting with currency display
- Error handling for invalid durations
- Clear start/end status reporting

##### Deployment Scripts (`deploy/`)

**auto-deploy-all.js** improvements:
- **Pre-deployment validation**:
  - Checks script existence on home
  - Validates root access before attempt
- **Enhanced RAM checking**:
  - Formatted RAM display (GB)
  - Clear insufficient RAM messages
- **Better error messages**:
  - Specific failure reasons
  - Per-server status reporting

**purchase-server-8gb.js** improvements:
- **Pre-purchase validation**:
  - Server limit check before attempting purchase
  - Funds availability check with formatted cost display
  - Early return with clear error messages
- **Intelligent server naming**:
  - Automatic detection of next available name
  - Handles gaps in numbering (e.g., if pserv-2 is deleted)
  - Loop-based name finding
- **Success/failure feedback**:
  - Clear success message with server name and RAM
  - Explicit failure message if purchase fails
- **Better information display**:
  - Formatted cost display using ns.nFormat
  - Current/max server count display
  - All info shown before purchase attempt

**replace-pservs-no-copy.js** improvements:
- **Pre-operation summary**:
  - Total cost calculation and display
  - Server count reporting
  - Funds check before starting
- **Success/failure tracking**:
  - Counters for replaced and failed operations
  - Per-server status reporting
  - Final summary with totals
- **Enhanced error handling**:
  - Try-catch for each server operation
  - Continues on individual failures
  - Detailed error messages per operation

**deploy-hack-joesguns.js** (new script):
- **Comprehensive deployment tracking**:
  - Success and failure counters
  - Per-server deployment status
  - Final summary report
- **Enhanced validation**:
  - Script existence check
  - SCP success validation
  - RAM availability validation
  - Thread calculation validation
- **Detailed error messages**:
  - Formatted RAM comparisons
  - Specific failure reasons
  - Per-operation error context

**home-batcher.js** (new script):
- **Home server optimization**:
  - Automatic RAM detection
  - Thread distribution calculation
  - Helper script validation
- **Process cleanup**:
  - Kills existing helpers before starting
  - Prevents duplicate processes
- **Enhanced validation**:
  - RAM requirement checks
  - Script RAM calculation validation
  - Thread availability validation

#### Error Handling & Logging Improvements

##### 1. Structured Logging System
- **Multi-level logging** (info, warn, error) in all scripts
- **Quiet mode support** for automated operations
- **Consistent formatting** across all log messages
- **Context-aware logging** with script names and operations

##### 2. Try-Catch Error Handling
- **Comprehensive error wrapping** for all critical operations
- **Graceful failure recovery** - scripts continue on individual errors
- **Error context preservation** - shows what operation failed
- **Nested error handling** - independent operation protection

##### 3. Validation and Early Returns
- **Pre-execution validation** for all prerequisites
- **Early return patterns** prevent downstream errors
- **Parameter validation** with usage messages
- **Resource validation** (RAM, scripts, access) before operations

##### 4. Detailed Error Messages
- **Specific error descriptions** instead of generic messages
- **Diagnostic information** included in error output
- **Formatted values** (RAM, money) for readability
- **Actionable suggestions** for error resolution

##### 5. Success/Failure Tracking
- **Operation counters** in deployment scripts
- **Final summaries** showing success/failure counts
- **Per-operation status** reporting
- **Overall completion status** for monitoring

##### 6. RAM Validation Enhancements
- **Multiple validation conditions** (NaN, zero, negative)
- **Formatted comparisons** (available vs required)
- **Clear error messages** with specific values
- **Safety checks** before thread calculations

##### 7. Enhanced User Feedback
- **Progress indicators** during long operations
- **Status updates** for each server/operation
- **Summary reports** at completion
- **Cost/benefit information** before operations

#### Changed

##### File Organization
- **Moved all scripts** from root to organized directories
- **Cleaned up root directory** - removed duplicate/old scripts
- **Created logical categories** for easier navigation
- **Maintained backward compatibility** with script names

##### Script Improvements
- **All scripts** now have consistent headers with usage examples
- **Enhanced documentation** in script comments
- **Standardized parameter handling** across all scripts
- **Improved output formatting** with ns.nFormat

##### Documentation Updates
- **Comprehensive README** with all features documented
- **Getting started guide** with game stage progression
- **Complete script reference** with examples
- **Error handling documentation** with before/after comparisons

#### Removed

##### Cleanup
- **Deleted duplicate scripts** from root directory after reorganization:
  - attack-hack.js, attack-grow.js, attack-weaken.js (moved to core/)
  - batch-manager.js, simple-batcher.js (moved to batch/)
  - profit-scan.js, production-monitor.js (moved to analysis/)
  - global-kill.js, list-procs.js, list-pservs.js (moved to utils/)
  - auto-deploy-all.js, purchase-server-8gb.js, etc. (moved to deploy/)
- **Removed obsolete scripts**:
  - early-hack-template.js (replaced by organized deployment scripts)
  - pserv-0_batch-manager.js (functionality integrated into batch-manager.js)
  - profiler-overrides.json (not needed for this collection)

### Technical Details

#### Logging System Architecture
```javascript
// Three-level logging with quiet mode support
const info = (...parts) => ns.print(parts.join(" "));           // Quiet-aware
const warn = (...parts) => ns.tprint("[WARN] " + parts.join(" ")); // Always visible
const error = (...parts) => ns.tprint("[ERR] " + parts.join(" "));  // Always visible
```

#### Error Handling Pattern
```javascript
try {
  // Critical operation
  const result = performOperation();
  if (!result) {
    error(`Operation failed: specific reason`);
    failureCounter++;
    continue;
  }
  successCounter++;
} catch (e) {
  error(`Exception during operation: ${e}`);
  failureCounter++;
}
```

#### Validation Pattern
```javascript
// Early validation with informative messages
if (!prerequisiteCheck()) {
  ns.tprint("ERROR: Prerequisite not met. Do this to fix it.");
  return;
}

// Resource validation with formatted output
if (available < required) {
  ns.tprint(`Insufficient resources: ${available.toFixed(2)} < ${required.toFixed(2)}`);
  return;
}
```

### Migration Notes

#### For Existing Users
1. **Backup your current scripts** before updating
2. **Copy scripts from organized directories** to your game home directory
3. **Update any custom scripts** that reference the old script names
4. **Test batch operations** in dry-run mode first (`--dry` flag)

#### Script Path Changes
All scripts have moved to subdirectories but can still be run from home:
```bash
# Old: run attack-hack.js target
# New: run attack-hack.js target  (still works if copied to home)
```

#### Breaking Changes
None - all script names and interfaces remain the same.

### Performance Improvements
- **Reduced log spam** with quiet mode support
- **Better error recovery** prevents script restarts
- **Efficient validation** prevents wasted operations
- **Smart retry logic** in batch manager

### Known Issues
None identified in this release.

### Future Enhancements
- Additional target presets for specific servers
- Advanced batch timing optimization
- Integration with game statistics API
- Automated target selection based on current stats
- Multi-target batch operations
- Performance metrics dashboard

---

## Version History

- **1.0.0** (2025-10-25) - Initial organized release with comprehensive error handling

---

For detailed script-by-script changes, see [ERROR_HANDLING_IMPROVEMENTS.md](docs/ERROR_HANDLING_IMPROVEMENTS.md)
