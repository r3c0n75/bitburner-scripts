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
    - Calculates optimal hack/grow/weaken ratios based on target timing
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
| `batch/batch-manager.js` | 5.50 GB | ⭐ RECOMMENDED - Auto-scaling + instant RAM detection |
| `batch/smart-batcher.js` | 6.35 GB | ✅ Best performance (490x faster) |

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
# Now you can comfortably run smart-batcher OR batch-manager
run batch/smart-batcher.js joesguns           # Leaves ~9.65GB free
run batch/batch-manager.js joesguns --quiet   # Leaves ~10.50GB free (automated management)
```

**🚀 With 32GB+ Home RAM (Mid Game):**
```bash
# Run multiple scripts simultaneously - batch manager + monitoring + analysis tools + stock scripts
run batch/batch-manager.js joesguns --quiet
run analysis/production-monitor.js 60
# Plus plenty of headroom for other utilities
```

### How to Check Your RAM

**Run the `free` command in your terminal:**
```bash
free
```

**Example output:**
```
Total:      32.00GB
Used:       25.65GB (80.16%)
Available:   6.35GB
```

**What to look for:**
- **Total: 8GB**: Use home-batcher.js OR smart-batcher.js (tight fit)
- **Total: 16GB+**: Use smart-batcher.js (recommended)
- **Total: 32GB+**: You're ready for full automation

**Note:** The "Available" line shows how much free RAM you have right now for running scripts.

### How to Get More RAM

**Your home server RAM can be upgraded!** Here's how:

**Option 1: Purchase RAM Upgrades (Fastest)**
1. Click **City** in the main navigation menu (left sidebar)
2. Visit any location with computer upgrades (like Alpha Enterprises)
3. Look for **"Upgrade 'home' RAM (current → higher) - $cost"**
4. Cost scales exponentially: ~$1M for 16GB, ~$10M+ for 32GB, etc.

**Option 2: BitNode Bonuses (Long-term)**
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

> **📌 Check your home RAM first!** Run `free` command in your terminal to see your RAM. With 8GB total, you can run all the commands below.

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
run batch/batch-manager.js omega-net --quiet
```
This automatically manages your entire fleet with:
- ⚡ **Instant RAM detection** - Detects server upgrades within ~85 seconds
- 🔄 **Auto-rooting** - Finds and roots new servers automatically
- 📊 **Smart redeployment** - Only when changes detected (RAM upgrades or new servers)
- 📋 **Full visibility** - Click "LOG" button to see all activity

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

**$1B+ (Late Game):**
- ✅ Establish passive stock trading income
- ✅ Join factions and start earning reputation
- ✅ Deploy RAM sharing with `run deploy/deploy-share-all.js`
- ✅ Purchase and install augmentations for massive permanent bonuses!

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

### Switch to RAM Sharing (Late Game)
```bash
run utils/global-kill.js         # Stop hacking
run deploy/deploy-share-all.js   # Start generating faction reputation
```

### Switch Back to Hacking
```bash
run utils/global-kill.js                  # Stop RAM sharing
run batch/batch-manager.js [target] --quiet # Resume automated hacking
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
- Did you buy the TIX API? ($25 billion from Alpha Enterprises in City)
- Do you have enough capital? (Minimum $100 million to start)
- Check market status: `run stocks/stock-info.js`

### Scripts running but using too much RAM?
```bash
run utils/global-kill.js              # Kill everything
run batch/smart-batcher.js [target] 0.02  # Lower hack percentage (uses less RAM)
```

### RAM sharing not generating reputation fast enough?
- Buy more purchased servers to increase your total RAM pool
- Upgrade existing purchased servers to higher RAM (16GB, 32GB, etc.)
- Make sure you've actually joined a faction first
- The more RAM you share, the faster reputation accumulates (it's exponential!)

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
│   ├── estimate-production.js Production estimates
│   └── f-estimate-production.js 🔮 EXACT (Formulas.exe)
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
│   ├── close-all-stock.js     Portfolio liquidation 🆕
│   └── check-stock-api.js     Verify TIX API access
├── utils/             # Utilities
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

### Stock Market Trading ($25-31 Billion Required)

Once you have **$25 billion** saved, you can buy the **TIX API** from the Alpha Enterprises location in City. This unlocks automated stock trading for passive income.

**Three Trading Strategies (Choose Your Level):**

---

#### Level 1: Momentum Trading (Easiest Entry - $25b TIX API + $5-10m capital)

**Best for:** Getting started with stock trading without expensive 4S Market Data  
**Strategy:** Buys stocks on dips (contrarian approach), sells on profit targets

```bash
# Analyze market first (optional)
run stocks/stock-momentum-analyzer.js 10

# Start trading: 5 stocks, $1b capital, 5% profit target, 5% stop loss
run stocks/stock-trader-momentum.js 5 1000000000 0.05 0.05 6000

# Monitor your positions
run stocks/stock-monitor.js
```

**Expected Returns:** 10-40% per trade  
**Why use this:** Cheapest entry into stock trading, no forecast data needed

---

#### Level 2: Forecast Trading (⭐ Recommended - $26b total + $10-50m capital)

**Best for:** Consistent profits with forecast intelligence  
**Requirements:** TIX API ($25b) + 4S Market Data ($1b)  
**Strategy:** Buys stocks with >55% forecast, sells when forecast drops below 50%

```bash
# View market intelligence
run stocks/stock-info.js

# Start trading: 10 stocks, $1 billion capital, 6 second refresh
run stocks/stock-trader-basic.js 10 1000000000 6000

# Monitor portfolio with real-time P/L tracking
run stocks/stock-monitor.js
```

**Expected Returns:** 20-50% per trade  
**Why use this:** Uses actual forecast data for smarter decisions, much more reliable than momentum trading

> **💡 Pro Tip:** This is the sweet spot for most players! The forecast data is worth every penny - you'll make your $1b investment back quickly with accurate market intelligence.

---

#### Level 3: Advanced Trading (Expert - $31b total + $20-50m+ capital)

**Best for:** Maximum profits with professional risk management  
**Requirements:** TIX API ($25b) + 4S Market Data ($1b) + Short Position Access ($25b)  
**Strategy:** Long/short positions, dynamic sizing, profit targets, stop-loss protection

```bash
# Advanced trading: 10 stocks, $50b capital, 25% profit target, 15% stop loss
run stocks/stock-trader-advanced.js 10 50000000000 0.25 0.15 6000

# Real-time portfolio monitoring
run stocks/stock-monitor.js
```

**Expected Returns:** 50-150% daily with optimal capital

**Features:**
- Long AND short positions (profit from both rises and falls)
- Dynamic position sizing based on forecast confidence
- Automatic profit-taking at your target percentage
- Stop-loss protection to limit losses
- Professional portfolio rebalancing
- Win rate tracking and performance metrics

**Why use this:** Enterprise-grade trading with maximum profit potential and risk management

---

#### Close All Positions (Any Level)

```bash
run stocks/stock-close-all.js           # Preview mode (safe)
run stocks/stock-close-all.js --confirm # Actually close positions
```

---

#### Trading Strategy Comparison

| Strategy | Cost to Start | Expected Returns | Difficulty |
|----------|---------------|------------------|------------|
| Momentum Trading | $25b + $5-10m | 10-40% per trade | ⭐ Easy |
| Forecast Trading | $26b + $10-50m | 20-50% per trade | ⭐⭐ Medium |
| Advanced Trading | $31b + $20-50m+ | 50-150% daily | ⭐⭐⭐ Expert |

> **💰 Recommended Progression:** Start with Momentum Trading to learn the basics → Upgrade to Forecast Trading for better returns → Master Advanced Trading for maximum profits!

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
run analysis/f-estimate-production.js silver-helix
```

**Why buy it?** No more switching targets only to find they're worse. Perfect information = confident decisions.

**Complete Guide:** [docs/FORMULAS_ENHANCED_SCRIPTS.md](docs/FORMULAS_ENHANCED_SCRIPTS.md)

---

### Late-Game Progression: Augmentations & Factions

Once you have **reliable passive income** from stock trading and automated hacking, it's time to unlock the game's most powerful upgrades: **Augmentations**!

#### What Are Augmentations?

Augmentations are **permanent upgrades** that massively boost your abilities:
- 🧠 **Hacking power** - Faster operations, better success rates
- 💪 **Combat stats** - Strength, defense, dexterity, agility
- 💰 **Faction reputation** - Earn reputation faster
- 📊 **Charisma** - Better company/faction work results
- ⚡ **Experience multipliers** - Level up skills faster

**The catch?** Installing augmentations **resets your game progress** (soft reset), but you keep the permanent bonuses. This is how you break through to exponentially higher income!

---

#### How to Unlock Augmentations

**Step 1: Join a Faction**

Factions have different requirements. Common early factions:
- **CyberSec** - Hack CSEC server (requires hacking 50+)
- **Tian Di Hui** - $1 million + hacking 50+ in any city
- **Netburners** - Hacking 80+ and total hacknet levels 100+
- **Sector-12** - Be in Sector-12 with $15 million

**Step 2: Earn Reputation**

Work for the faction to earn reputation points:
- 💻 **Hacking Contracts** - Best for hacking-focused players (you!)
- 🛡️ **Field Work** - Requires combat stats
- 🔒 **Security Work** - Lower requirements, slower reputation gain

**Step 3: Purchase Augmentations**

Each augmentation requires:
- ✅ Enough faction reputation (varies: 10k to 1 million+)
- ✅ Enough money ($1 million to $1 billion+)

> **💡 Important:** The more augmentations you buy, the more expensive the next one becomes (exponential price multiplier). Plan your purchases carefully!

---

#### The Reputation Challenge

High-tier augmentations require **massive reputation**:
- Basic augmentations: 10,000 - 50,000 reputation
- Advanced augmentations: 100,000 - 500,000 reputation
- Elite augmentations: 1,000,000+ reputation

**The problem:** Earning reputation through manual hacking contracts takes *forever*.

**The solution:** **RAM sharing!** 🚀

---

#### RAM Sharing for Maximum Reputation

RAM sharing lets you dedicate your **entire server fleet** to passively generating reputation while you're away!

**Prerequisites:**
- ✅ Stable passive income from stock trading (you won't be hacking for money)
- ✅ A large fleet of servers (purchased servers highly recommended)
- ✅ Already joined a faction

**How to Deploy RAM Sharing:**

```bash
# Stop all current hacking operations
run utils/global-kill.js

# Deploy RAM sharing to ALL servers for your faction
run deploy/deploy-share-all.js
```

**What happens:**
- Every server you control starts running `share-ram.js`
- All available RAM is dedicated to generating faction reputation
- Reputation accumulates passively while you're offline or doing other tasks
- The more RAM you share, the faster you earn reputation

> **⚡ Pro Tip:** With 25 purchased servers (8GB each) plus your home server, you can generate reputation 100-200x faster than manual hacking contracts!

#### Optimal Late-Game Strategy

**Phase 1: Build Your Foundation**
1. Establish automated stock trading for passive income
2. Purchase 25 servers (8GB minimum, 16GB+ recommended)
3. Accumulate $100 million - $1 billion for augmentation purchases

**Phase 2: Focus on Reputation**
1. Join your target faction(s)
2. Stop hacking for money (you have stock trading income!)
3. Deploy RAM sharing: `run deploy/deploy-share-all.js`
4. Let your fleet generate reputation overnight

**Phase 3: Purchase & Install Augmentations**
1. Once you have enough reputation, visit the faction
2. Purchase all augmentations you can afford
3. Install them to trigger the soft reset
4. Start your next run with massive permanent bonuses!

---

#### Recommended Augmentation Targets

**Early Augmentations (Good First Purchases):**
- **Augmented Targeting I & II** - Better hacking success
- **Neuralstimulator** - Faster hacking/growing/weakening
- **BitWire** - Increased hack skill
- **TITN-41 Gene-Modification** - General skill improvements

**High-Value Late-Game Augmentations:**
- **The Red Pill** - Unlocks endgame content (1 million+ reputation!)
- **NeuroFlux Governor** - Can be purchased infinite times, each level improves everything slightly
- **Neuroreceptor Management Implant** - Massive faction reputation multiplier

> **🎯 Strategy Tip:** Focus on **hacking augmentations first**. They make your next run dramatically more efficient, letting you reach late-game faster!

---

#### Example Late-Game Workflow

```bash
# 1. Check your current money generation
run analysis/production-monitor.js 60

# 2. Stop hacking, start RAM sharing
run utils/global-kill.js
run deploy/deploy-share-all.js

# 3. Monitor your stock portfolio (passive income)
run stocks/stock-monitor.js

# 4. Check faction status in-game
# Visit faction → Check reputation → Purchase augmentations when ready

# 5. When ready to reset
# Install all purchased augmentations → Start fresh with bonuses!
```

---

#### RAM Sharing vs Hacking for Money

| Activity | Best For | Income Source |
|----------|----------|---------------|
| Hacking (smart-batcher) | Building your wealth | Direct hacking income |
| Stock Trading | Passive wealth generation | Market movements |
| RAM Sharing | Earning faction reputation | Stock trading only |

> **💰 Key Insight:** Once your stock trading generates enough passive income, you can **completely stop hacking for money** and dedicate your entire fleet to reputation farming. This is the fastest path to elite augmentations!

---

## 🆕 What's New (For Returning Users)

### Version 1.8.13 (November 12, 2025)
**Batch Scripts RAM Calculation Fix** 🔧
- Fixed critical bug in `smart-batcher.js` and `simple-batcher.js`
- Scripts now use maximum RAM cost of all three scripts (hack/grow/weaken)
- Eliminates "insufficient ram" errors on 64GB and 8GB servers
- Ensures 100% reliable script deployment
- No more partial deployments where some scripts fail to start

**Impact**:
- 64GB servers: Correctly calculates 36 threads instead of 37
- 8GB servers: Correctly calculates 4 threads instead of 5
- All scripts start successfully with accurate RAM allocation

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

## ✨ Final Tips for Success

> **The Golden Rule:** Start small, scale up gradually. Don't rush to buy expensive upgrades before you understand the basics!

**Recommended Learning Path:**
1. **Week 1:** Learn basic automation with smart-batcher
2. **Week 2:** Master target selection with profit-scan-flex
3. **Week 3:** Expand your server fleet
4. **Week 4+:** Explore stock trading and advanced features
5. **Late Game:** Establish passive income → Join factions → Farm reputation → Purchase augmentations → Soft reset with permanent bonuses!

**Remember:**
- 💡 Wait 6-8 minutes for prep phases to complete
- 💡 Upgrade home RAM to 16GB as soon as possible
- 💡 Use `profit-scan-flex.js --optimal` to find hidden gems
- 💡 Late game: Use RAM sharing to farm faction reputation 100-200x faster
- 💡 Check the GitHub repository for updates
- 💡 Join the community for help and discussion

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

**Last Updated**: November 12, 2025  
**Current Version**: 1.8.13  
**Latest Feature**: Batch scripts RAM calculation fix for 100% deployment reliability

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
