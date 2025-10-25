# Bitburner Scripts Collection

A comprehensive collection of Bitburner automation scripts for efficient hacking, server management, and resource optimization.

## 🚀 Quick Start

### Installation Options

**Option 1: PowerShell + GitHub (Recommended)** 🌟
1. Run `.\Push-ToGitHub.ps1` to push organized structure to GitHub
2. Configure `bitburner-update.js` with your GitHub URL
3. Use `bitburner-update.js` in-game for automatic updates
4. See **[PowerShell GitHub Workflow](POWERSHELL_GITHUB_WORKFLOW.md)** for details

**Option 2: Manual Copy**
- Copy all `.js` files to Bitburner home directory (no folders needed)
- Bitburner doesn't support folder structures in-game

**Why PowerShell Method?**
- ✅ Keep organized folders (no flattening!)
- ✅ One command to push updates
- ✅ Full Git version control
- ✅ Auto-flatten in Bitburner

### Basic Usage
```bash
# Find profitable targets (basic)
run profit-scan.js

# Find profitable targets (advanced with caching)
run profit-scan-flex.js

# Deploy simple batcher to all servers
run simple-batcher.js joesguns

# Monitor production
run production-monitor.js 60

# Auto-deploy to all rooted servers
run auto-deploy-all.js
```

## 📁 Script Categories

### Core Attack Scripts
- `attack-hack.js` - Basic hack operation
- `attack-grow.js` - Basic grow operation  
- `attack-weaken.js` - Basic weaken operation

### Batch Management
- `simple-batcher.js` - Deploy attack helpers across servers
- `batch-manager.js` - Ensure batcher runs on purchased servers
- `auto-deploy-all.js` - Deploy scripts to all rooted servers

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

# Auto-deploy with thread cap
run auto-deploy-all.js 50
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

## 📈 Optimization Tips

1. **Use profit-scan-flex.js** for advanced target analysis with caching (faster on repeat scans)
2. **Use profit-scan.js** for quick checks without file operations
3. **Monitor production** with production-monitor.js to verify efficiency
4. **Batch operations** for maximum resource utilization
5. **Manage purchased servers** for additional computing power
6. **Use quiet mode** for automated operations

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
3. Scale with `auto-deploy-all.js`

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

See [CHANGELOG.md](CHANGELOG.md) for complete details.

---

## 🔗 Documentation Links

### Quick Start
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
