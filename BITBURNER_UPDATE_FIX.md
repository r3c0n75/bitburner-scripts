# bitburner-update.js Path Fix

**Date**: November 12, 2025  
**Issue**: Bug in `bitburner-update.js` causing failed downloads for `f-estimate-production.js` and `stock-close-all.js`
**Reported By**: SkellyVamps (Issue #3: f-estimate-production.js )  
**Status**: ✅ Fixed

## Problem Description
User reported two download failures in `bitburner-update.js`:
1. `✗ utils/f-estimate-production.js - Download failed`
2. `✗ stocks/stock-close-all.js - Download failed`

## Root Cause Analysis

### Issue 1: f-estimate-production.js
- **Problem**: Script was listed under `utils` category in bitburner-update.js (line 58)
- **Actual Location**: File exists in `analysis/` folder
- **Root Cause**: File was moved to analysis/ folder but bitburner-update.js was not updated

### Issue 2: stock-close-all.js  
- **Problem**: Script was referenced as `stock-close-all.js` (line 80)
- **Actual Filename**: File is named `close-all-stock.js`
- **Root Cause**: Incorrect filename in bitburner-update.js

## Files Fixed

### Core Update Scripts (3 files)
1. `scripts/bitburner-update.js`
   - Removed `f-estimate-production.js` from utils array (line 58)
   - Added `f-estimate-production.js` to analysis array (line 50)
   - Changed `stock-close-all.js` to `close-all-stock.js` (line 80)

2. `bitburner-remote-api/src/bitburner-update.js`
   - Same changes as above

3. `bitburner-remote-api/dist/bitburner-update.js`
   - Same changes as above (compiled version)

### Documentation Updates (9 files)
1. `scripts/docs/SCRIPT_REFERENCE.md`
   - Line 326: `utils/f-estimate-production.js` → `analysis/f-estimate-production.js`
   - Line 589: `stock-close-all.js` → `close-all-stock.js`

2. `scripts/docs/FORMULAS_ENHANCED_SCRIPTS.md`
   - Line 61: `utils/f-estimate-production.js` → `analysis/f-estimate-production.js`
   - Lines 67-68: Updated run commands to use `analysis/`
   - Line 168: Updated example command

3. `scripts/docs/SCRIPTS_USING_FORMULAS.md`
   - Line 48: `utils/f-estimate-production.js` → `analysis/f-estimate-production.js`
   - Line 106: Updated run command

4. `scripts/docs/QUICK_REFERENCE.md`
   - Line 30: `utils/f-estimate-production.js` → `analysis/f-estimate-production.js`
   - Line 95: `utils/f-estimate-production.js` → `analysis/f-estimate-production.js`
   - Line 119: `stock-close-all.js` → `close-all-stock.js`

5. `scripts/docs/STOCK_TRADING_GUIDE.md`
   - Line 409: `stock-close-all.js` → `close-all-stock.js`
   - Lines 414, 417, 450: Updated run commands

6. `scripts/docs/NEW_GAME_QUICKSTART.md`
   - Line 402: `utils/f-estimate-production.js` → `analysis/f-estimate-production.js`

7. `scripts/README.md`
   - Line 429: Added `f-estimate-production.js` to analysis/ folder structure
   - Line 447: `stock-close-all.js` → `close-all-stock.js`
   - Line 601: `utils/f-estimate-production.js` → `analysis/f-estimate-production.js`

## Verification

### Correct File Locations
✅ `scripts/analysis/f-estimate-production.js` - EXISTS  
✅ `bitburner-remote-api/src/analysis/f-estimate-production.js` - EXISTS  
✅ `scripts/stocks/close-all-stock.js` - EXISTS  
✅ `bitburner-remote-api/src/stocks/close-all-stock.js` - EXISTS

### Updated References
✅ All `bitburner-update.js` files now point to correct paths  
✅ All documentation now references correct paths and filenames  
✅ No broken references remain

## Testing Instructions

Users should now be able to run:
```bash
run bitburner-update.js --all
```

And see:
```
✓ analysis/f-estimate-production.js
✓ stocks/close-all-stock.js
```

Instead of the previous download failures.

## Impact
- **User Impact**: Download failures resolved
- **Breaking Changes**: None (users just need to re-run update script)
- **Documentation**: Fully updated and consistent
- **Testing Required**: Verify GitHub deployment contains correct file paths

## Follow-up Actions
1. ✅ Update bitburner-update.js (all 3 versions)
2. ✅ Update all documentation references
3. ⚠️ User should test download after next GitHub push
4. ⚠️ Update Steam guide if it references these files

## Related Files
- Analysis scripts: `estimate-production.js`, `f-estimate-production.js`, `profit-scan-flex.js`, `f-profit-scan-flex.js`
- Stock scripts: `stock-info.js`, `stock-monitor.js`, `close-all-stock.js`, etc.

---

**Fix Date**: November 12, 2025  
**Issue Type**: File path mismatch in download script  
**Severity**: Medium (prevents script downloads)  
**Status**: ✅ RESOLVED

