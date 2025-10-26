# Bitburner Scripts Collection

A comprehensive collection of Bitburner automation scripts for efficient hacking, server management, and resource optimization.

## 🚀 Quick Start

### 🎮 New to the Game or Just Augmented?
**See [NEW_GAME_QUICKSTART.md](NEW_GAME_QUICKSTART.md)** for a fast-track guide on:
- Starting a brand new game from scratch
- Recovering quickly after augmentation installation
- Copy-paste commands to get running in under 5 minutes!

### Installation Options

**Option 1: Remote API Development (Fastest Development)** ⚡ NEW!
1. Install Remote API tool (TypeScript Template or Viteburner)
2. Edit scripts in VS Code with full IntelliSense
3. Save → Instant sync to Bitburner (2 seconds)
4. See **[Remote API Setup Guide](docs/REMOTE_API_SETUP.md)** for details

**Why Remote API?**
- ✅ Instant sync on save (no manual deployment!)
- ✅ Full VS Code IntelliSense & autocomplete
- ✅ TypeScript support (optional)
- ✅ Professional development workflow
- ✅ Keep organized folder structure

**Option 2: PowerShell + GitHub (Best for Distribution)** 🌟
1. Run `.\Push-ToGitHub.ps1` to push organized structure to GitHub
2. Configure `bitburner-update.js` with your GitHub URL
3. Use `bitburner-update.js` in-game for automatic updates
4. See **[PowerShell GitHub Workflow](POWERSHELL_GITHUB_WORKFLOW.md)** for details

**Why PowerShell Method?**
- ✅ Keep organized folders (no flattening!)
- ✅ One command to push updates
- ✅ Full Git version control
- ✅ Auto-flatten in Bitburner
- ✅ Easy sharing via GitHub URLs

**Option 3: Manual Copy**
- Copy all `.js` files to Bitburner home directory (no folders needed)
- Bitburner doesn't support folder structures in-game

**💡 Pro Tip:** Use Remote API for daily development + GitHub for version control and sharing!

## 🎯 Dual Workflow (Recommended Setup)

**Active Development** → Remote API (instant sync)  
**Version Control** → GitHub (backups & sharing)

### Quick Start:
```powershell
# Setup (one-time)
.\Setup-RemoteAPI-Workspace.ps1

# Daily use
cd bitburner-remote-api
npm run watch
# In Bitburner: Options → Remote API → Connect

# End of day (backup)
.\Sync-ToGitHub.ps1  # (or manually copy stable changes)
```

See **[Remote API Daily Workflow](REMOTE_API_DAILY_WORKFLOW.md)** for complete guide.

### Basic Usage
```bash
# Find profitable targets (basic)
run profit-scan.js

# Find profitable targets (advanced, DEFAULT: only money servers)
run profit-scan-flex.js

# Find targets by POTENTIAL (find hidden gems with massive upside!)
run profit-scan-flex.js --optimal

# Show ALL servers including purchased servers
run profit-scan-flex.js --all

# Deploy smart batcher with optimal ratios (490x faster!)
run batch/smart-batcher.js sigma-cosmetics

# Monitor production
run production-monitor.js 60

# Root and deploy to all accessible servers
run deploy/auto-expand.js
```

## 📁 Script Categories

### Core Attack Scripts
- `attack-hack.js` - Basic hack operation
- `attack-grow.js` - Basic grow operation  
- `attack-weaken.js` - Basic weaken operation

### Batch Management
- `simple-batcher.js` - Deploy attack helpers across servers
- `batch-manager.js` - Ensure batcher runs on purchased servers
- `home-batcher.js` - Home server batch operations
- `auto-expand.js` - Root and deploy to all accessible servers

### Analysis & Monitoring
- `profit-scan.js` - Find most profitable targets
- `profit-scan-flex.js` - Advanced profit scanner with caching 🆕
- `production-monitor.js` - Monitor money generation
- `server-info.js` - Display server information
- `list-procs.js` - List running processes
- `list-pservs.js` - List purchased servers

### Server Management
- `purchase-server-8gb.js` - Buy 8GB servers
- `replace-pservs-no-copy.js` - Replace purchased servers
- `home-batcher.js` - Home server batch operations

### Utilities
- `global-kill.js` - Kill all scripts globally
- `estimate-production.js` - Estimate production rates
- `deploy-hack-joesguns.js` - Deploy joesguns hack script

## 🛠️ Advanced Usage

### Batch Operations
```bash
# Deploy with thread limits
run simple-batcher.js joesguns 100

# Include home server
run simple-batcher.js joesguns --include-home

# Quiet mode
run simple-batcher.js joesguns --quiet

# Dry run
run simple-batcher.js joesguns --dry
```

### Server Management
```bash
# Batch manager with custom settings
run batch-manager.js joesguns 12 1.25 home --quiet

# Root & deploy with thread cap
run deploy/auto-expand.js joesguns 50
```

## 📊 Performance Monitoring

### Production Analysis
```bash
# Monitor for 5 minutes
run production-monitor.js 300

# Find best targets
run profit-scan.js

# Check server status
run server-info.js
```

## 🔧 Configuration

### Script Parameters
- `target` - Server to attack (default: joesguns)
- `capThreads` - Maximum threads per server
- `multiplier` - Batch timing multiplier
- `pservHost` - Host for batch manager

### Flags
- `--quiet` - Reduce output verbosity
- `--dry` - Show what would happen without executing
- `--include-home` - Include home server in operations
- `--all` - Show ALL servers including zero-money servers (profit-scan-flex.js only)

## 📈 Optimization Tips

1. **Use profit-scan-flex.js** for clean target analysis (automatically hides purchased servers, shows only profitable targets)
2. **Use profit-scan-flex.js** for advanced target analysis with caching (faster on repeat scans)
3. **Use profit-scan.js** for quick checks without file operations
4. **Monitor production** with production-monitor.js to verify efficiency
5. **Batch operations** for maximum resource utilization
6. **Manage purchased servers** for additional computing power
7. **Use quiet mode** for automated operations

## 🚨 Troubleshooting

### Common Issues
- **Insufficient RAM**: Check available RAM with `list-procs.js`
- **No root access**: Ensure you have the required hacking tools
- **Script not found**: Verify script exists on target server
- **Low production**: Check target profitability with `profit-scan.js`

### Debug Commands
```bash
# Check running processes
run list-procs.js

# List purchased servers
run list-pservs.js

# Monitor production
run production-monitor.js 60
```

## 📝 Script Dependencies

### Required Helper Scripts
- `attack-hack.js`
- `attack-grow.js` 
- `attack-weaken.js`

### Optional Scripts
- `hack-joesguns.js` - Alternative hack script
- `hack-n00dles.js` - Early game hack script

## 🔄 Workflow Examples

### Early Game Setup
1. Run `profit-scan.js` to find targets
2. Use `simple-batcher.js` to deploy to available servers
3. Monitor with `production-monitor.js`

### Mid Game Optimization
1. Purchase servers with `purchase-server-8gb.js`
2. Deploy batch manager with `batch-manager.js`
3. Root & deploy with `auto-expand.js`

### Late Game Management
1. Use `global-kill.js` to reset all operations
2. Re-optimize with `profit-scan.js`
3. Deploy optimized batches

## 📚 Additional Resources

- Check individual script headers for detailed usage
- Use `--help` flags where available
- Monitor production regularly for optimization
- Scale operations based on available resources

---

## 📝 Version History

### Version 1.4.4 (2025-10-26) - Current 🆕
**Script Organization & Enhanced Error Handling:**

- ✅ **Script Reorganization** - home-batcher.js moved to batch/ folder for logical grouping
- ✅ **Deprecated Script Removal** - Removed outdated auto-deploy-all.js 
- ✅ **Enhanced home-batcher.js** - Complete rewrite with enterprise-grade diagnostics
  - Conflict detection for RAM competition
  - Detailed RAM analysis and pre-checks
  - Explicit failure reporting (no more silent failures!)
  - Smart summaries with helpful recommendations
- ✅ **Critical Bug Fix** - home-batcher.js now properly reports when hack script fails to start
- ✅ **Documentation Updates** - All 9+ docs updated to reflect new organization

### Version 1.0.0 (2025-10-25)
**Initial organized release with comprehensive improvements:**

- ✅ **Organized directory structure** - Scripts categorized into logical folders
- ✅ **Enhanced error handling** - Comprehensive try-catch blocks and validation
- ✅ **Structured logging** - Multi-level logging (info, warn, error) with quiet mode
- ✅ **Success/failure tracking** - Deployment scripts track and report results
- ✅ **Detailed documentation** - Complete guides and script reference
- ✅ **Configuration support** - Predefined targets and settings
- ✅ **Better validation** - Pre-execution checks prevent downstream errors
- ✅ **Improved feedback** - Clear, actionable error messages

See [CHANGELOG.md](CHANGELOG.md) for complete version history.

---

## 🔗 Documentation Links

### Quick Start
- **[New Game Quickstart](NEW_GAME_QUICKSTART.md)** - Fast recovery after augmentations & new game guide 🆕
- **[Remote API Setup](docs/REMOTE_API_SETUP.md)** - Professional dev workflow with instant sync ⚡ NEW!
- **[Quick Reference](QUICK_REFERENCE.md)** - Fast command lookup
- **[Getting Started Guide](docs/GETTING_STARTED.md)** - Step-by-step setup and usage
- **[Script Reference](docs/SCRIPT_REFERENCE.md)** - Complete script documentation

### Technical
- **[Project Structure](PROJECT_STRUCTURE.md)** - Directory organization
- **[Error Handling Guide](docs/ERROR_HANDLING_IMPROVEMENTS.md)** - Error handling details
- **[Detailed Changes](docs/DETAILED_CHANGES.md)** - Complete change documentation
- **[Changelog](CHANGELOG.md)** - Version history and changes

### Reference
- **[Documentation Index](docs/DOCUMENTATION_INDEX.md)** - Complete doc catalog
- **[Documentation Summary](DOCUMENTATION_SUMMARY.md)** - Doc overview
- **[Project Complete](PROJECT_COMPLETE.md)** - Final project status

### Deployment
- **[PowerShell GitHub Workflow](POWERSHELL_GITHUB_WORKFLOW.md)** - Push organized structure 🌟
- **[Push-ToGitHub.ps1](Push-ToGitHub.ps1)** - PowerShell Git automation
- **[bitburner-update.js](bitburner-update.js)** - In-game auto-update script
- **[GitHub Deployment Guide](docs/GITHUB_DEPLOYMENT_GUIDE.md)** - Complete deployment guide

---

**Note**: This collection is designed for efficiency and automation. Start with basic scripts and gradually implement more complex batch operations as your resources grow.
