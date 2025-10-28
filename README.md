# Bitburner Automation Scripts

Complete automation suite for Bitburner including optimal batch operations, profit analysis, and stock market trading.

## 🆕 What's New - Version 1.8.5

**NEW: Complete Stock Trading Suite with Portfolio Management!** 💰🔚

Latest enhancements to the complete 7-script stock trading system:

**v1.8.5 - Portfolio Liquidation:**
- `stock-close-all.js` - Close ALL positions with preview mode & safety confirmation 🆕

**v1.8.4 - Realized P/L Tracking:**
- `stock-monitor.js` - Enhanced with realized + unrealized P/L tracking 🆕

**v1.8.3 - 4S Data Intelligence:**
- `stock-monitor.js` - Real-time forecasts, volatility analysis, position alignment 🆕✨

**v1.8.2 - Forecast Intelligence:**
- `stock-momentum-analyzer.js` - Confidence scoring & trap detection 🆕✨

**Complete Trading Suite (7 scripts):**
- `stock-info.js` - Market intelligence viewer
- `stock-trader-basic.js` - Forecast-based trading (requires 4S Data)
- `stock-trader-advanced.js` - Dynamic sizing with risk management
- `stock-trader-momentum.js` - Momentum trading (NO 4S Data needed!)
- `stock-momentum-analyzer.js` - Preview with forecast intelligence
- `stock-monitor.js` - Real-time portfolio dashboard with realized P/L
- `stock-close-all.js` - Instant portfolio liquidation with safety

**See [docs/STOCK_TRADING_GUIDE.md](docs/STOCK_TRADING_GUIDE.md) for complete guide!**

Quick start (momentum - cheapest):
```bash
run stocks/stock-momentum-analyzer.js 5                        # Forecast intelligence + trap detection
run stocks/stock-trader-momentum.js 5 1000000000 0.05 0.05 6000  # Trade: 5% profit, 5% stop loss
run stocks/stock-monitor.js                                    # Monitor: realized + unrealized P/L
run stocks/stock-close-all.js --confirm                        # Close all positions when done
```

**Requirements**: 
- Momentum Trading: TIX API ($5b only!)
- Forecast Trading: TIX API ($5b) + 4S Market Data ($1b) = $6 billion

---

## 🚀 Quick Start

### New Game or Post-Augmentation?
**Start here**: [NEW_GAME_QUICKSTART.md](docs/NEW_GAME_QUICKSTART.md) - Fastest recovery path!

### Recommended: Smart Batcher (490x Performance!)
```bash
# Find best target
run analysis/profit-scan-flex.js --optimal

# Deploy optimal batching
run batch/smart-batcher.js sigma-cosmetics

# Monitor production
run analysis/production-monitor.js 60
```

### With Formulas.exe ($5 billion upgrade)
```bash
# EXACT target rankings (perfect accuracy)
run analysis/f-profit-scan-flex.js --optimal

# EXACT production predictions (zero error)
run utils/f-estimate-production.js silver-helix
```

## 📁 Project Structure

```
scripts/
├── core/              # Basic attack operations
│   ├── attack-hack.js
│   ├── attack-grow.js
│   └── attack-weaken.js
├── batch/             # Batch management
│   ├── smart-batcher.js       ⭐ Optimal timing-based (490x faster!)
│   ├── simple-batcher.js      Basic deployment
│   ├── batch-manager.js       Automated management
│   └── home-batcher.js        Home server batching
├── analysis/          # Profit analysis
│   ├── profit-scan-flex.js    Enhanced scanner
│   ├── f-profit-scan-flex.js  🔮 EXACT (Formulas.exe)
│   ├── profit-scan.js         Basic scanner
│   ├── production-monitor.js  Track production
│   └── estimate-production.js Production estimates
├── config/            # Configuration files
│   └── default-targets.js     Default hacking targets
├── deploy/            # Deployment scripts
│   ├── auto-expand.js         Root & deploy everywhere
│   ├── purchase-server-8gb.js Buy servers
│   ├── replace-pservs-no-copy.js Replace servers
│   ├── hack-universal.js      Universal hacking script
│   ├── deploy-hack-joesguns.js Deploy to joesguns
│   ├── hack-joesguns.js       Joesguns hacking
│   ├── hack-n00dles.js        n00dles hacking
│   └── deploy-share-all.js    Deploy share scripts
├── stocks/            # 🆕 Stock trading (TIX API)
│   ├── stock-info.js          Market intelligence viewer
│   ├── stock-trader-basic.js  Automated trading (forecast)
│   ├── stock-trader-advanced.js Advanced strategies (dynamic sizing)
│   ├── stock-trader-momentum.js Momentum trading (no 4S!) 🆕
│   ├── stock-momentum-analyzer.js Forecast intelligence analyzer 🆕✨
│   ├── stock-monitor.js       Portfolio monitoring (realized P/L) 🆕
│   ├── stock-close-all.js     Portfolio liquidation 🆕
│   └── check-stock-api.js     Verify TIX API access
├── utils/             # Utilities
│   ├── f-estimate-production.js 🔮 EXACT (Formulas.exe)
│   ├── global-kill.js         Kill all running scripts
│   ├── list-procs.js          List running processes
│   ├── list-pservs.js         List purchased servers
│   ├── server-info.js         Server information
│   └── share-ram.js           Share RAM for factions
└── docs/              # Documentation (28 files)
    ├── NEW_GAME_QUICKSTART.md      🆕 Fast recovery guide
    ├── QUICK_REFERENCE.md          🆕 Fast command lookup
    ├── STOCK_TRADING_GUIDE.md      🆕 Complete trading guide
    ├── SCRIPT_REFERENCE.md         All scripts documented
    ├── GETTING_STARTED.md          Setup instructions
    ├── FORMULAS_ENHANCED_SCRIPTS.md Perfect accuracy guide
    ├── REMOTE_API_SETUP.md         Remote API development
    ├── BeginnersGuide.md           🆕 Beginner's guide
    ├── DockerGuide.md              🆕 Docker setup guide
    └── ... (19 more documentation files)
```

## 📖 Key Documentation

| Document | Purpose | When to Use |
|----------|---------|-------------|
| [NEW_GAME_QUICKSTART.md](docs/NEW_GAME_QUICKSTART.md) | Fast recovery after reset | Starting new BitNode |
| [QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md) | Fast command lookup | Need quick command |
| [docs/STOCK_TRADING_GUIDE.md](docs/STOCK_TRADING_GUIDE.md) | 🆕 Stock trading | Making money with stocks |
| [docs/SCRIPT_REFERENCE.md](docs/SCRIPT_REFERENCE.md) | Detailed script docs | Learning script usage |
| [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) | Project setup | First-time setup |
| [CHANGELOG.md](CHANGELOG.md) | Version history | See what changed |

## 🎯 Common Tasks

### Deploy Optimal Batch System
```bash
# Find best target
run analysis/profit-scan-flex.js --optimal

# Deploy smart batcher (recommended)
run batch/smart-batcher.js [target]

# Monitor performance
run analysis/production-monitor.js 60
```

### Stock Market Trading
```bash
# View market overview
run stocks/stock-info.js

# Momentum trading (forecast intelligence if 4S Data available) 🆕✨
run stocks/stock-momentum-analyzer.js 10                   # Confidence scoring + trap detection
run stocks/stock-trader-momentum.js 5 1000000000 0.10 0.05 6000  # 10% profit, 5% stop loss

# Forecast-based trading (requires 4S Data $6b)
run stocks/stock-trader-basic.js 1000000000

# Monitor portfolio
run stocks/stock-monitor.js
```

### Basic Operations
```bash
# Find profitable targets
run analysis/profit-scan.js

# Check system status
run utils/list-procs.js

# Kill all scripts
run utils/global-kill.js
```

## 🔧 Installation

### Option 1: Using bitburner-update.js (Recommended)
```bash
# Download all scripts
run bitburner-update.js --all

# Or download by category
run bitburner-update.js --essential  # Core scripts
run bitburner-update.js --stocks     # Stock trading
run bitburner-update.js --batch      # Batch scripts
```

### Option 2: Manual Download
1. Copy scripts from GitHub repository
2. Place in appropriate Bitburner folders
3. Maintain folder structure (optional but recommended)

### Option 3: Remote File API
See [docs/REMOTE_API_SETUP.md](docs/REMOTE_API_SETUP.md) for development setup

## ⭐ Key Features

### Smart Batcher (v1.5.0)
- **490x performance improvement** over traditional methods
- Optimal thread ratios based on operation timing
- $2.09m/s production vs $4.26k/s traditional
- Automatic server preparation
- Intelligent RAM allocation

### Formula-Enhanced Scripts (v1.7.0) 🔮
- **Perfect accuracy** using Formulas.exe API
- Zero estimation error for target selection
- Exact production predictions
- Confident deployment decisions
- Requires: Formulas.exe ($5 billion, permanent)

### Stock Trading Suite (v1.8.1) 📈
- **Momentum Trading**: NO 4S Data needed! ($5b only)
- **Profit Targets**: Configurable profit taking (5%, 10%, 15%)
- **Automated trading** with multiple strategies
- Long positions (short positions version-dependent)
- Dynamic position sizing
- Stop-loss protection
- Real-time monitoring
- Requires: TIX API ($5b) or TIX + 4S Data ($6b)

### Enhanced Target Selection
- Fleet Potential Score algorithm
- Accounts for both efficiency AND capacity
- Prevents low-capacity target mistakes
- Optimal mode shows improvement potential

## 🎮 Usage Examples

### Scenario 1: Fresh Start
```bash
1. run analysis/profit-scan.js         # Find target
2. run batch/smart-batcher.js joesguns # Deploy
3. Wait 6-8 minutes for prep phase
4. Watch money roll in!
```

### Scenario 2: Mid-Game Optimization
```bash
1. run analysis/profit-scan-flex.js --optimal  # Find best potential
2. run analysis/estimate-production.js [target]   # Verify production
3. run batch/smart-batcher.js [target] 0.05    # Deploy with 5% hack
4. run analysis/production-monitor.js 60       # Monitor
```

### Scenario 3: Stock Trading - Momentum (Cheaper!)
```bash
1. Purchase TIX API ($5b only - no 4S Data!)
2. run stocks/stock-momentum-analyzer.js 10                      # Forecast intelligence (optional 4S)
3. run stocks/stock-trader-momentum.js 5 1000000000 0.10 0.05 6000 # Momentum: 10% profit, 5% stop
4. run stocks/stock-monitor.js                                    # Watch profits
```

### Scenario 3b: Stock Trading - Forecast (Better Returns)
```bash
1. Purchase TIX API ($5b) + 4S Data ($1b)
2. run stocks/stock-info.js                    # Scout market
3. run stocks/stock-trader-basic.js 1000000000 # Start trading
4. run stocks/stock-monitor.js                 # Watch profits
```

### Scenario 4: With Formulas.exe
```bash
1. run analysis/f-profit-scan-flex.js --optimal     # EXACT rankings
2. run utils/f-estimate-production.js [target]      # EXACT production
3. Deploy with confidence - zero guesswork!
```

## 📊 Performance Benchmarks

### Smart Batcher Results
- **Silver-helix**: $34k/s → $3.41m/s (100x improvement)
- **Sigma-cosmetics**: $4.26k/s → $2.09m/s (490x improvement)
- **Thread allocation**: 4% hack / 87% grow / 9% weaken
- **Prep time**: 6-8 minutes to optimal state

### Stock Trading Returns (Estimated)
- **Momentum Trader**: 10-40% daily returns (NO 4S Data!)
- **Basic Trader**: 20-50% daily returns
- **Advanced Trader**: 50-150% daily returns
- **Capital Required**: $5b minimum (momentum), $10b+ (forecast), $50b+ (advanced)
- **Momentum**: Only TIX API needed, Forecast: requires 4S Market Data

## 🐛 Troubleshooting

### Scripts not running?
```bash
run utils/list-procs.js  # See what's running
run utils/global-kill.js # Stop everything
```

### Low production?
- Wait 6-8 minutes for server prep
- Check target security is at minimum
- Use `profit-scan-flex.js --optimal` for better targets

### Stock trading not working?
- Verify TIX API purchased ($5b)
- Verify 4S Data purchased ($1b)
- Check market conditions with `stock-info.js`
- Ensure sufficient capital for trades

## 🔗 Additional Resources

- **GitHub**: [bitburner-scripts](https://github.com/r3c0n75/bitburner-scripts)
- **Official Docs**: [Bitburner Documentation](https://github.com/bitburner-official/bitburner-src)
- **Remote API**: [Official Remote File API](https://github.com/bitburner-official/vscode-template)

## 📝 Version History

- **v1.8.5** (2025-10-27): Portfolio liquidation with preview mode & safety
- **v1.8.4** (2025-10-27): Stock monitor realized P/L tracking
- **v1.8.3** (2025-10-27): Stock monitor 4S data integration
- **v1.8.2** (2025-10-27): Stock momentum analyzer 4S enhancement
- **v1.8.1** (2025-10-27): Momentum trading with profit targets (NO 4S Data!)
- **v1.8.0** (2025-10-27): Complete TIX stock trading suite
- **v1.7.0** (2025-10-26): Formula-enhanced scripts (perfect accuracy)
- **v1.5.3** (2025-10-26): Fleet Potential Score algorithm
- **v1.5.0** (2025-10-26): Smart batcher (490x performance)
- **v1.4.2** (2025-10-26): Path fixes for organized structure
- **v1.4.0** (2025-10-26): Enhanced error handling
- **v1.0.0** (2025-10-25): Initial organized release

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

## 🤝 Contributing

Contributions welcome! Areas of interest:
- Additional trading strategies
- ML-based stock prediction
- Web-based monitoring dashboard
- Performance optimizations
- Documentation improvements

## 📄 License

Open source - use freely in your Bitburner gameplay!

---

**Last Updated**: October 27, 2025  
**Version**: 1.8.5  
**Major Update**: Portfolio liquidation with preview mode & safety confirmation

**Quick Links**:
- [Quick Reference](docs/QUICK_REFERENCE.md) - Fast command lookup
- [Stock Trading Guide](docs/STOCK_TRADING_GUIDE.md) - Complete trading guide
- [Script Reference](docs/SCRIPT_REFERENCE.md) - Detailed documentation
- [New Game Guide](docs/NEW_GAME_QUICKSTART.md) - Fast recovery path
