# Quick Reference Guide

Fast reference for common operations and documentation locations.

## 🚀 Quick Start Commands

**🆕 New Game or Post-Augmentation?** See [NEW_GAME_QUICKSTART.md](NEW_GAME_QUICKSTART.md) for fastest recovery path!

```bash
# Find profitable targets
run analysis/profit-scan.js

# Deploy batch operations
run batch/simple-batcher.js joesguns

# Monitor production
run analysis/production-monitor.js 60

# Check system status
run utils/list-procs.js
```

## 📁 File Locations

| What You Need | File Location | Lines |
|---------------|---------------|-------|
| Fresh start / augmentation recovery | NEW_GAME_QUICKSTART.md | All 🆕 |
| Project overview | README.md | Top |
| Getting started | docs/GETTING_STARTED.md | All |
| Script usage | docs/SCRIPT_REFERENCE.md | Find script |
| Error handling | docs/ERROR_HANDLING_IMPROVEMENTS.md | All |
| Changes made | docs/DETAILED_CHANGES.md | Find script |
| Version history | CHANGELOG.md | All |
| Doc index | docs/DOCUMENTATION_INDEX.md | All |

## 🔧 Script Locations by Purpose

### Core Operations
```
core/attack-hack.js       # Basic hack
core/attack-grow.js       # Basic grow  
core/attack-weaken.js     # Basic weaken
```

### Batch Management
```
batch/simple-batcher.js   # Deploy to all servers
batch/batch-manager.js    # Manage pserv batching
```

### Analysis
```
analysis/profit-scan.js          # Find best targets
analysis/production-monitor.js   # Track production
```

### Utilities
```
utils/global-kill.js       # Kill all scripts
utils/list-procs.js        # List processes
utils/list-pservs.js       # List pservs
utils/server-info.js       # Server details
utils/estimate-production.js  # Production estimates
```

### Deployment
```
deploy/auto-deploy-all.js        # Deploy to all rooted
deploy/purchase-server-8gb.js    # Buy server
deploy/replace-pservs-no-copy.js # Replace pservs
deploy/home-batcher.js           # Home batching
deploy/deploy-hack-joesguns.js   # Deploy joesguns
deploy/hack-joesguns.js          # Joesguns script
deploy/hack-n00dles.js           # N00dles script
```

## 📊 Key Improvements Reference

| Improvement | Example Location |
|-------------|------------------|
| Structured logging | batch/simple-batcher.js:45-49 |
| Error handling | deploy/deploy-hack-joesguns.js:43-79 |
| Validation | batch/simple-batcher.js:58-63 |
| Success tracking | deploy/deploy-hack-joesguns.js:36-37 |
| RAM validation | batch/simple-batcher.js:163-166 |

## 🎯 Common Tasks

### Setup
```bash
1. Read README.md
2. Follow docs/GETTING_STARTED.md
3. Copy scripts to game
```

### Find Best Target
```bash
run analysis/profit-scan.js
# Look at top results
```

### Deploy Batch System
```bash
run batch/simple-batcher.js joesguns
# Or with options:
run batch/simple-batcher.js joesguns 100 --quiet
```

### Monitor Performance
```bash
run analysis/production-monitor.js 300
run utils/list-procs.js
```

### Troubleshoot
```bash
run utils/list-procs.js        # See what's running
run utils/global-kill.js       # Stop everything
run batch/simple-batcher.js target  # Restart
```

## 📖 Documentation Quick Links

| Need | File | Section |
|------|------|---------|
| Setup | docs/GETTING_STARTED.md | Quick Setup |
| Script usage | docs/SCRIPT_REFERENCE.md | Find script name |
| Error fix | docs/ERROR_HANDLING_IMPROVEMENTS.md | Search error type |
| Code change | docs/DETAILED_CHANGES.md | Find script name |
| Version info | CHANGELOG.md | v1.0.0 |

## 🔍 Error Handling Locations

| Script | Logging Lines | Error Handling Lines |
|--------|--------------|---------------------|
| simple-batcher.js | 45-49 | 124-135, 137-155 |
| batch-manager.js | 40-42 | 68-86, 88-95 |
| purchase-server-8gb.js | 15-16 | 18-26, 36-41 |
| deploy-hack-joesguns.js | N/A | 43-79 |

## 📝 Documentation Statistics

- **Total Docs**: 9 files
- **Total Lines**: ~4,400
- **Scripts Documented**: 18
- **Code Examples**: 50+
- **Status**: ✅ Complete

## 🎉 Quick Wins

### New Users
1. README.md (5 min read)
2. Run analysis/profit-scan.js
3. Run batch/simple-batcher.js target
4. Watch analysis/production-monitor.js

### Experienced Users
1. docs/SCRIPT_REFERENCE.md for lookups
2. Use quiet mode: --quiet
3. Check docs/ERROR_HANDLING_IMPROVEMENTS.md for debugging

### Developers
1. docs/DETAILED_CHANGES.md for implementation
2. docs/ERROR_HANDLING_IMPROVEMENTS.md for patterns
3. CHANGELOG.md for history

---

**Version**: 1.1.0  
**Last Updated**: 2025-10-26  
**Note**: All commands updated for organized folder structure (Remote API v1.4.1)
