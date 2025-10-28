# Bitburner Automation Scripts

**Complete automation suite for Bitburner** - Maximize your money-making with optimal batch operations, intelligent profit analysis, and automated stock trading. From your first $1 million to late-game optimization, these scripts scale with your progress.

**What you get:**
- 🚀 **490x faster money generation** vs manual hacking
- 📊 Intelligent target selection (finds the best servers automatically)
- 💰 Automated stock trading suite (7 different strategies)
- 🔮 Formula-enhanced scripts (perfect accuracy for late game)
- 📖 28 documentation files (guides for every skill level)

---

## 🔧 Installation First!

Before running any commands, you need to download the scripts:

### Option 1: Quick Download (Recommended)
```bash
# Download the updater script first (copy/paste into Bitburner terminal)
wget https://raw.githubusercontent.com/r3c0n75/bitburner-scripts/main/bitburner-update.js bitburner-update.js

# Download essential scripts to get started
run bitburner-update.js --essential
```

### Option 2: Download by Category
```bash
run bitburner-update.js --all       # Everything (recommended)
run bitburner-update.js --batch     # Batch scripts only
run bitburner-update.js --stocks    # Stock trading only
run bitburner-update.js --analysis  # Analysis tools only
```

### Option 3: Development Setup
If you want to edit scripts with VS Code, see [docs/REMOTE_API_SETUP.md](docs/REMOTE_API_SETUP.md)

---

## 👶 For New Players - Your First $1 Million

**Start here if you're new to Bitburner or just started a fresh game:**

### Step 1: Find a Target
```bash
run analysis/profit-scan.js
```
This shows you which servers make the most money. Look for "joesguns" or "n00dles" - they're easy early targets.

### Step 2: Deploy Your First Batch System
```bash
run batch/smart-batcher.js joesguns
```
This automatically hacks "joesguns" repeatedly. **Wait 6-8 minutes** for the "prep phase" to complete.

### Step 3: Watch the Money Roll In
```bash
run analysis/production-monitor.js 60
```
This shows how much money you're making per second. You should see $10k-100k/second depending on your stats.

**That's it!** You're now making passive income. As you level up and gain access to better servers, repeat Step 1-2 with new targets.

**Need more help?** See [docs/NEW_GAME_QUICKSTART.md](docs/NEW_GAME_QUICKSTART.md) for detailed recovery strategies.

---

## 📖 Common Daily Tasks

Once you're set up, these are the commands you'll use most:

### Check What's Running
```bash
run utils/list-procs.js  # See all your active scripts
```

### Stop Everything (before changing targets)
```bash
run utils/global-kill.js  # Kills all scripts safely
```

### Find Better Targets (as you level up)
```bash
run analysis/profit-scan-flex.js --optimal  # Shows improvement potential
```

### Check Server Info
```bash
run utils/server-info.js joesguns  # Detailed server stats
```

### Emergency Restart
```bash
run utils/global-kill.js                      # Stop everything
run batch/smart-batcher.js [better-target]    # Start fresh
```

---

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

## 💎 Advanced Features (Mid to Late Game)

### Stock Market Trading ($5-6 Billion Required)

Once you have **$5 billion** saved, you can buy the **TIX API** from the Alpha Enterprises location in City. This unlocks automated stock trading for passive income.

**Two Trading Strategies:**

#### Option 1: Momentum Trading (Cheaper - $5b only!)
No need for expensive 4S Market Data. Buys stocks on dips, sells on profit targets.

```bash
# Analyze market first (optional but helpful if you have 4S Data)
run stocks/stock-momentum-analyzer.js 10

# Start trading: 5 stocks, $1b capital, 5% profit target, 5% stop loss
run stocks/stock-trader-momentum.js 5 1000000000 0.05 0.05 6000

# Monitor your positions
run stocks/stock-monitor.js
```

**Expected Returns:** 10-40% daily

#### Option 2: Forecast Trading (Better returns - $6b total)
Requires TIX API ($5b) + 4S Market Data ($1b). Uses forecast data for better accuracy.

```bash
# View market intelligence
run stocks/stock-info.js

# Start trading with $1 billion
run stocks/stock-trader-basic.js 1000000000

# Monitor portfolio
run stocks/stock-monitor.js
```

**Expected Returns:** 20-50% daily

#### Close All Positions (when done)
```bash
run stocks/stock-close-all.js           # Preview mode (safe)
run stocks/stock-close-all.js --confirm # Actually close positions
```

**Complete Guide:** [docs/STOCK_TRADING_GUIDE.md](docs/STOCK_TRADING_GUIDE.md)

---

### Formulas.exe Enhancement ($5 Billion Permanent Upgrade)

**What is Formulas.exe?** It's an in-game program you can purchase that gives your scripts **perfect accuracy** - no more guessing which targets are best!

**How to get it:**
1. Visit any City location with programs for sale
2. Purchase "Formulas.exe" for $5 billion (one-time permanent purchase)
3. Your scripts automatically detect it and provide exact calculations

**Enhanced Scripts Available:**

```bash
# EXACT target rankings (zero estimation error)
run analysis/f-profit-scan-flex.js --optimal

# EXACT production predictions (100% accurate)
run utils/f-estimate-production.js silver-helix
```

**Why buy it?** No more switching targets only to find they're worse. Perfect information = confident decisions.

**Complete Guide:** [docs/FORMULAS_ENHANCED_SCRIPTS.md](docs/FORMULAS_ENHANCED_SCRIPTS.md)

---

## ⭐ Why These Scripts Are Powerful

### Smart Batcher Technology
**490x faster money generation** compared to simple hacking loops. How?

- Uses **optimal thread ratios** based on operation timing (4% hack / 87% grow / 9% weaken)
- Automatically prepares servers to optimal state
- Real results: $34k/s → $3.41m/s on silver-helix target

**You don't need to understand the math** - just run `smart-batcher.js` and it handles everything.

### Intelligent Target Selection
The `profit-scan-flex.js` script uses **Fleet Potential Score** algorithm:

- Finds servers with BOTH high efficiency AND high capacity
- Prevents rookie mistakes (attacking targets with tiny money pools)
- Shows you which servers will improve after preparation

### Multiple Trading Strategies
**7 different stock trading scripts** for different play styles and capital levels:

- Momentum trading (contrarian strategy, no forecasts needed)
- Forecast-based trading (uses 4S Market Data)
- Advanced dynamic sizing (for late-game whales)
- Real-time monitoring with P/L tracking
- Portfolio liquidation with safety features

## 📊 Performance You Can Expect

### Hacking Income
- **Early game** (joesguns): $10k-100k/second
- **Mid game** (silver-helix): $1m-5m/second  
- **Late game** (optimal targets): $10m+/second

**Improvement over manual**: 100-490x faster than simple hack loops

### Stock Trading Returns (Estimated)
| Strategy | Daily Returns | Requirements | Capital Needed |
|----------|--------------|--------------|----------------|
| Momentum | 10-40% | TIX API ($5b) | $1b minimum |
| Forecast | 20-50% | TIX + 4S Data ($6b) | $10b+ optimal |
| Advanced | 50-150% | TIX + 4S + Short ($31b) | $50b+ optimal |

**Note:** Returns vary based on market conditions and your game progress.

## 🐛 Troubleshooting

### "Script not found" errors
You probably skipped installation! Go back to the [Installation section](#🔧-installation-first) and download the scripts.

### Scripts not doing anything?
```bash
run utils/list-procs.js  # See what's running
run utils/global-kill.js # Stop everything and restart
```

### Making way less money than expected?
- **Wait 6-8 minutes** for the "prep phase" - servers need weakening first
- Check if target security is at minimum with `server-info.js`
- Try a different target with `profit-scan-flex.js --optimal`

### Stock trading commands not working?
- Did you buy the TIX API? ($5 billion from Alpha Enterprises in City)
- Do you have enough capital? (Minimum $100 million to start)
- Check market status: `run stocks/stock-info.js`

### Scripts running but using too much RAM?
```bash
run utils/global-kill.js              # Kill everything
run batch/smart-batcher.js [target] 0.02  # Lower hack percentage (uses less RAM)
```

**Still stuck?** Check the detailed guides in the `docs/` folder or [open an issue on GitHub](https://github.com/r3c0n75/bitburner-scripts/issues).

---

## 🆕 What's New (For Returning Users)

### Version 1.8.6 (October 28, 2025)
**Enhanced Global Kill Reliability** 🔫✨
- `global-kill.js` now has 100% reliable process termination
- Strategic delays and bulk operations eliminate race conditions
- No more surviving processes after kill commands

### Version 1.8.5 (October 27, 2025)
**Portfolio Liquidation Features** 💰
- `stock-close-all.js` - New script to close ALL positions instantly
- Preview mode shows what would be sold (safe by default)
- Requires `--confirm` flag to actually close positions
- Complete P/L breakdown with win rate calculations

### Version 1.8.4 (October 27, 2025)
**Realized P/L Tracking** 📊
- `stock-monitor.js` enhanced with realized profit tracking
- Shows both unrealized (open) and realized (closed) P/L
- Automatic detection when positions close
- Session-long cumulative tracking

### Version 1.8.1-1.8.3 (October 27, 2025)
**Complete Stock Trading Suite** 🚀
- Momentum trading strategy (NO 4S Data required!)
- Forecast intelligence with confidence scoring
- Real-time volatility analysis
- 4S Data integration for enhanced monitoring
- 7 complete trading scripts with different strategies

### Version 1.7.0 (October 26, 2025)
**Formula-Enhanced Scripts** 🔮
- Perfect accuracy using Formulas.exe API
- `f-profit-scan-flex.js` and `f-estimate-production.js`
- Zero estimation error for confident decisions

### Version 1.5.0 (October 26, 2025)
**Smart Batcher Revolution** ⚡
- 490x performance improvement over traditional methods
- Optimal timing-based thread ratios
- Real results: $4.26k/s → $2.09m/s

**See [CHANGELOG.md](CHANGELOG.md) for complete version history.**

---

## 🔗 Additional Resources

- **GitHub Repository**: [bitburner-scripts](https://github.com/r3c0n75/bitburner-scripts)
- **Official Bitburner Docs**: [Documentation](https://github.com/bitburner-official/bitburner-src)
- **Remote API Development**: [Official Remote File API](https://github.com/bitburner-official/vscode-template)
- **Game Discord**: Join the Bitburner community for help and discussion

## 🤝 Contributing

Contributions welcome! Open an issue or pull request on GitHub.

**Areas of interest:**
- Additional trading strategies
- ML-based predictions
- Web-based monitoring
- Performance optimizations
- Documentation improvements

## 📄 License

Open source - use freely in your Bitburner gameplay!

---

**Last Updated**: October 28, 2025  
**Current Version**: 1.8.6  
**Latest Feature**: Enhanced global kill reliability with 100% process termination

**Essential Documentation:**
- 🚀 **New to Bitburner?** Start with the [For New Players](#👶-for-new-players---your-first-$1-million) section above
- ⚡ **Daily Commands**: [Common Daily Tasks](#📖-common-daily-tasks) section
- 📊 **Stock Trading**: [Complete Trading Guide](docs/STOCK_TRADING_GUIDE.md)
- 📖 **All Scripts**: [Script Reference](docs/SCRIPT_REFERENCE.md)
- 🎮 **Post-Reset**: [New Game Quickstart](docs/NEW_GAME_QUICKSTART.md)
