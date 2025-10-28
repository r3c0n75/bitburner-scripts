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

> **⚠️ Version Note**: Installer works on both v2.8.1 (Steam) and v3.0.0 (Web). All scripts are fully compatible with both versions! See [Version Compatibility](#✅-version-compatibility) at the bottom for details.

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

## ⭐ Why These Scripts Are Powerful

Before you start, here's why these scripts will transform your Bitburner experience:

### 490x Faster Money Generation
**Smart Batcher Technology** uses optimal thread ratios based on operation timing:
- Traditional approach: 25% hack / 45% grow / 30% weaken (inefficient)
- Smart approach: 4% hack / 87% grow / 9% weaken (optimal)
- Real results: $34k/s → $3.41m/s on silver-helix target

**You don't need to understand the math** - just run the scripts and they handle everything automatically.

### Intelligent Target Selection
The `profit-scan-flex.js` script uses **Fleet Potential Score** algorithm:
- Finds servers with BOTH high efficiency AND high capacity
- Prevents rookie mistakes (attacking targets with tiny money pools)
- Shows you which servers will improve after preparation

**Bottom line:** Instead of manually hacking for hours, these scripts automate everything and make you 100-490x more money.

---

## 💾 RAM Requirements & Early Game Tips

**Your home server starts with limited RAM** (typically 8GB). Here's what you need to know BEFORE you start:

### Script RAM Requirements

| Script | RAM Required | Best For |
|--------|-------------|----------|
| `utils/global-kill.js` | 3.05 GB | Stop all scripts (always works) |
| `analysis/profit-scan-flex.js` | 4.40 GB | Target finding (fits in 8GB) |
| `batch/home-batcher.js` | 4.90 GB | ✅ EARLY GAME - Best for 8GB home |
| `batch/simple-batcher.js` | 5.10 GB | Early-mid game deployment |
| `batch/batch-manager.js` | 5.50 GB | Mid game automation |
| `batch/smart-batcher.js` | 6.35 GB | ✅ RECOMMENDED - Best performance |

### What Can You Run?

**🏠 With 8GB Home RAM (Fresh Start):**
```bash
# Option 1: Use home-batcher (leaves room for other scripts)
run batch/home-batcher.js joesguns

# Option 2: Use smart-batcher (better performance, tight fit)
run batch/smart-batcher.js joesguns  # Leaves ~1.65GB free
```

**💻 With 16GB Home RAM (First Upgrade):**
```bash
# Now you can comfortably run smart-batcher
run batch/smart-batcher.js joesguns  # Leaves ~9.65GB free
```

**🚀 With 32GB+ Home RAM (Mid Game):**
```bash
# Run everything - smart-batcher + monitoring + utilities
run batch/batch-manager.js joesguns --quiet  # Automated management
```

### How to Check Your RAM

**Look at the top-right corner of your terminal** - it shows `home: XGB`

- If you see **8GB**: Use home-batcher.js OR smart-batcher.js (tight fit)
- If you see **16GB+**: Use smart-batcher.js (recommended)
- If you see **32GB+**: You're ready for full automation

### How to Get More RAM

**Your home server RAM can be upgraded!** Here's how:

**Option 1: Purchase RAM Upgrades (Fastest)**
1. Go to **City** (use the navigation menu or type `connect CSEC` if you have access)
2. Visit any location with computer upgrades (like Alpha Enterprises)
3. Look for "Purchase Home RAM Upgrade"
4. Cost scales exponentially: ~$1M for 16GB, ~$10M+ for 32GB, etc.

**Option 2: Install Augmentations**
- Many augmentations increase home RAM
- Work for factions to gain reputation
- Purchase augmentations when you have enough rep + money
- Example: "Neural Accelerator" and similar augs boost RAM

**Option 3: BitNode Bonuses (Long-term)**
- Complete BitNodes to unlock permanent bonuses
- Some BitNodes give permanent RAM increases
- Stacks across all future runs

> **ℹ️ What's a BitNode?** BitNodes are part of Bitburner's core storyline - different simulated realities with unique rules, challenges, and mechanics. [Destroying a BitNode](https://bitburner-fork-oddiz.readthedocs.io/en/latest/advancedgameplay/bitnodes.html#what-is-a-bitnode) resets most progress but grants powerful persistent upgrades called Source-Files. Think of them as "New Game+" prestige levels. This is end-game content - focus on your first playthrough first!

**💡 Priority:** Getting to 16GB should be your **first major purchase** after making $1-5M. This single upgrade dramatically improves your quality of life!

### RAM Management Tips

**If you're running out of RAM:**
- ✅ Use `home-batcher.js` instead of `smart-batcher.js` (saves 1.45GB)
- ✅ Use `--quiet` flag to reduce logging overhead
- ✅ Kill unnecessary scripts: `run utils/global-kill.js`
- ✅ Check what's using RAM: `run utils/list-procs.js`

**Pro tip:** The core attack scripts (`attack-hack.js`, `attack-grow.js`, `attack-weaken.js`) use very little RAM (~1.75GB each) and run on OTHER servers you've rooted, not your home server! The batch scripts just coordinate them.

---

## 👶 For New Players - Your First $1 Million

**Start here if you're new to Bitburner or just started a fresh game:**

> **📌 Check your home RAM first!** Look at top-right corner of terminal (shows `home: XGB`). With 8GB, you can run all the commands below.

### Step 1: Find a Target
```bash
run analysis/profit-scan.js
```

**What you'll see:** A ranked list of servers showing their profit potential.

**What to do:** Look for "joesguns" or "n00dles" near the top - they're easy early targets.

---

### Step 2: Deploy Your First Batch System
```bash
run batch/smart-batcher.js joesguns
```

**What happens:** The script automatically:
- Finds all servers you have access to
- Deploys hacking scripts across your network
- Starts continuously hacking "joesguns"
- Prepares the target server for optimal income

**Important:** ⏱️ **Wait 6-8 minutes** for the "prep phase" to complete. The server needs to be weakened first!

**You'll know it's working when:**
- ✅ You see "✓ Started attack-weaken.js..." messages
- ✅ You see "✓ Started attack-grow.js..." messages  
- ✅ You see "✓ Started attack-hack.js..." messages
- ✅ Your money starts increasing (check top-right corner)

---

### Step 3: Watch the Money Roll In
```bash
run analysis/production-monitor.js 60
```

**What you'll see:** Real-time income tracking showing $/second

**Success indicators:**
- 💰 **Early game** (joesguns): $10k-100k/second
- 💰 **After prep phase**: Income increases steadily
- 💰 **Optimal state**: Consistent high income rate

**If income is low:** Wait longer! The prep phase can take 6-8 minutes. Security needs to reach minimum first.

---

**🎉 That's it!** You're now making passive income while you explore other parts of the game.

**What to do next:** See the [Mid-Game Progression](#🎯-mid-game-progression---your-next-100-million) section below to scale up your operation.

---

## 🎯 Mid-Game Progression - Your Next $100 Million

**You've made your first $1-10 million - excellent!** Here's how to scale up to $100M+:

### Phase 1: Upgrade Your Infrastructure ($1M-10M)

**Priority 1: Upgrade Home RAM to 16GB**
- **Why:** Enables comfortable smart-batcher usage with room for utilities
- **Cost:** ~$1-5M (varies by game state)
- **How:** Visit City → Purchase RAM upgrades (look for computer stores)
- **Benefit:** 5x more working space, run multiple scripts simultaneously

**Priority 2: Level Up Your Skills**
- **Hack skill to 100+:** Faster operations, better success rates
- **Raise money:** Keep running your batch scripts (passive income!)
- **Focus:** Take any jobs, complete contracts, work on reputation

---

### Phase 2: Find Better Targets ($10M-50M)

**Use the optimal mode for target discovery:**
```bash
run analysis/profit-scan-flex.js --optimal
```

**What to look for:**
- 💎 **High "Fleet Score"** - These are hidden gems!
- 💎 **Servers marked "NEEDS PREP"** - Will improve dramatically after smart-batcher runs
- 💎 **Money pools $100M+** - More capacity = more income

**How to switch targets:**
```bash
run utils/global-kill.js                    # Stop everything
run batch/smart-batcher.js [new-target]     # Deploy to better target
run analysis/production-monitor.js 60       # Verify improved income
```

**Expected income progression:**
- 💰 joesguns (starter): $10k-100k/second
- 💰 silver-helix (mid): $1m-5m/second
- 💰 Top-tier servers (late): $10m+/second

---

### Phase 3: Expand Your Fleet ($50M-100M+)

**Buy Purchased Servers:**
```bash
run deploy/purchase-server-8gb.js
```

**Benefits:**
- Each server adds 8GB+ of dedicated hacking power
- They don't need rooting - you own them!
- Can buy up to 25 servers (massive scaling)

**Strategy:**
1. Buy 1-2 servers when you have $20M+ saved
2. Deploy smart-batcher to utilize the new capacity
3. Income increases significantly
4. Repeat: Buy more → Make more → Buy more

**Automation (32GB+ home RAM):**
```bash
run batch/batch-manager.js [target] --quiet
```
This automatically manages your entire fleet and roots new servers as you gain access!

---

### Quick Progress Checklist

**$1M → $10M:**
- ✅ Upgrade home RAM to 16GB
- ✅ Switch to better targets as you level up
- ✅ Use smart-batcher.js for 490x performance

**$10M → $50M:**
- ✅ Use profit-scan-flex.js --optimal to find hidden gems
- ✅ Buy your first purchased server ($20M+)
- ✅ Level hack skill to 100+

**$50M → $100M+:**
- ✅ Buy 5-10 purchased servers for massive scaling
- ✅ Target top-tier servers (silver-helix, omega-net, etc.)
- ✅ Consider automation with batch-manager.js

**$100M+:**
- 🎓 You're ready for [Advanced Features](#💎-advanced-features-mid-to-late-game) like stock trading!

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

## 🐛 Troubleshooting

### "Script not found" errors
You probably skipped installation! Go back to the [Installation section](#🔧-installation-first) and download the scripts.

### "Not enough RAM" errors?
Your home server doesn't have enough RAM to run that script. See the [RAM Requirements section](#💾-ram-requirements--early-game-tips) for:
- Script RAM requirements table
- Alternative scripts that use less RAM
- How to upgrade your home server RAM

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

**Or see the [RAM Requirements section](#💾-ram-requirements--early-game-tips)** for script alternatives and upgrade tips.

**Still stuck?** Check the detailed guides in the `docs/` folder or [open an issue on GitHub](https://github.com/r3c0n75/bitburner-scripts/issues).

---

## 📁 Project Structure & Reference

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
**Current Version**: 1.8.7  
**Latest Feature**: Smart batcher v3.0.0 compatibility fix

## ✅ Version Compatibility

**Bitburner v2.8.1 (Steam)**: ✅ Fully Compatible  
**Bitburner v3.0.0 (Web)**: ✅ Fully Compatible

**All scripts updated with v2.x/v3.x compatibility:**
- Added compatibility helper functions to all scripts
- Intelligently tries new API (v3.x) with fallback to old API (v2.x)
- **100% backward compatible** - works perfectly in both versions

**What Was Fixed:**
- `ns.nFormat()` removed in v3.0.0 → replaced with `formatMoney()` helper
- `ns.formatNumber()` removed in v3.0.0 → replaced with `formatNumber()` helper
- Scripts now use compatibility layers that work in both versions
- All scripts tested and confirmed working in v2.8.1 Steam and v3.0.0 Web

**Latest v3.0.0 Fix (v1.8.7):**
- ✅ `smart-batcher.js` - Fixed `formatNumber()` deprecation error

---

**Essential Documentation:**
- 🚀 **New to Bitburner?** Start with the [For New Players](#👶-for-new-players---your-first-$1-million) section above
- ⚡ **Daily Commands**: [Common Daily Tasks](#📖-common-daily-tasks) section
- 📊 **Stock Trading**: [Complete Trading Guide](docs/STOCK_TRADING_GUIDE.md)
- 📖 **All Scripts**: [Script Reference](docs/SCRIPT_REFERENCE.md)
- 🎮 **Post-Reset**: [New Game Quickstart](docs/NEW_GAME_QUICKSTART.md)
