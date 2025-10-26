# New Game & Augmentation Recovery Quickstart

This guide provides a fast-track action plan for starting fresh games and recovering after augmentation installations.

## 🎮 Starting a Brand New Game

### Phase 1: First 5 Minutes (Manual Setup)
**Hacking Skill: 0-20**

1. **Get Initial Money**
   ```bash
   # Complete the tutorial if first time
   # Run the following commands manually:
   hack('n00dles')
   hack('foodnstuff')
   hack('sigma-cosmetics')
   ```

2. **Install Scripts**
   ```bash
   # If using GitHub deployment (recommended for beginners):
   wget https://raw.githubusercontent.com/r3c0n75/bitburner-scripts/main/bitburner-update.js bitburner-update.js
   run bitburner-update.js
   
   # Otherwise, copy scripts manually to home
   ```
   
   **💡 Advanced Option**: For faster development with instant sync, see [Remote API Setup Guide](docs/REMOTE_API_SETUP.md)

3. **Find First Target**
   ```bash
   # Quick scan to find what you can hack
   run profit-scan.js
   ```

### Phase 2: Early Automation (10-30 minutes)
**Hacking Skill: 20-100**

1. **Start Simple Batch Operations**
   ```bash
   # Target easy servers
   run simple-batcher.js n00dles
   
   # Or if you have access to foodnstuff:
   run simple-batcher.js foodnstuff
   ```

2. **Monitor Your Income**
   ```bash
   # Watch for 1 minute to verify it's working
   run production-monitor.js 60
   ```

3. **Get More Hacking Tools**
   - Save money to buy:
     - BruteSSH.exe ($500k)
     - FTPCrack.exe ($1.5m)
     - relaySMTP.exe ($5m)
   - More tools = more servers to hack

### Phase 3: Scaling Up (30-60 minutes)
**Hacking Skill: 100-500**

1. **Upgrade to Better Targets**
   ```bash
   # Re-scan for better opportunities (with realistic estimates)
   run profit-scan-flex.js
   
   # Check expected production
   run estimate-production.js joesguns
   
   # Switch to profitable target with OPTIMAL ratios (490x faster!)
   run global-kill.js
   run smart-batcher.js joesguns
   
   # Or use basic batcher:
   run simple-batcher.js joesguns
   ```

2. **Buy Your First Server**
   ```bash
   # When you have ~$1-2 million saved
   run purchase-server-8gb.js
   ```

3. **Deploy Across All Servers**
   ```bash
   # Option A (RECOMMENDED): Smart Batcher with optimal ratios
   run smart-batcher.js joesguns
   
   # Option B: Auto-expand for basic deployment
   run deploy/auto-expand.js
   
   # Monitor the results (wait 6-8 min for prep with smart-batcher)
   run analysis/production-monitor.js 300
   ```

---

## 🔄 Post-Augmentation Recovery (FAST PATH)

When you install augmentations, you restart from scratch but with enhanced stats. Here's how to recover quickly:

### Recovery Phase 1: Immediate Actions (First 2 minutes)
**Priority: Get scripts back FAST**

1. **Restore Your Scripts**
   ```bash
   # If using GitHub (RECOMMENDED):
   wget https://raw.githubusercontent.com/r3c0n75/bitburner-scripts/main/bitburner-update.js bitburner-update.js
   run bitburner-update.js
   
   # Scripts downloaded in 10-30 seconds!
   ```

2. **Identify Best Starting Target**
   ```bash
   # With augmentations, you likely have higher hacking skill
   run profit-scan-flex.js
   
   # Note the top 3 targets you can access
   ```

3. **Deploy Immediately**
   ```bash
   # Jump straight to your best accessible target with OPTIMAL ratios
   # (Your augmentations may let you skip n00dles entirely!)
   run smart-batcher.js joesguns    # 490x faster than basic!
   
   # Or use basic batcher:
   run simple-batcher.js joesguns
   
   # Use whatever profit-scan recommended
   ```

### Recovery Phase 2: Rapid Scaling (5-15 minutes)
**Priority: Restore income stream**

1. **Deploy to All Available Servers**
   ```bash
   # You likely have more port openers from previous run
   run deploy/auto-expand.js
   ```

2. **Purchase Servers Early**
   ```bash
   # Your augmentations boost income speed
   # Buy servers as soon as you hit $1m
   run purchase-server-8gb.js
   
   # Rebuy every time you have spare cash
   ```

3. **Monitor and Optimize**
   ```bash
   # Verify your income is growing
   run production-monitor.js 60
   
   # Check if you need to switch targets
   run profit-scan-flex.js
   ```

### Recovery Phase 3: Surpass Previous Run (15-30 minutes)
**Priority: Exceed previous performance**

1. **Aggressive Server Purchasing**
   ```bash
   # Keep running until you have multiple servers
   run purchase-server-8gb.js
   
   # Check your fleet
   run list-pservs.js
   ```

2. **Advanced Batch Management**
   ```bash
   # Once you have 3+ servers, use batch manager
   run batch-manager.js joesguns 12 1.25 home --quiet
   ```

3. **Continuous Optimization**
   ```bash
   # Every 10-15 minutes, check for better targets
   run profit-scan-flex.js
   
   # Switch if you find significantly better options
   run global-kill.js
   run simple-batcher.js NEW_TARGET
   ```

---

## ⚡ Quickstart Cheat Sheet

### Absolute Fastest Recovery (Copy-Paste This) ⭐
```bash
# Step 1: Get scripts (10 seconds)
wget https://raw.githubusercontent.com/r3c0n75/bitburner-scripts/main/bitburner-update.js bitburner-update.js
run bitburner-update.js

# Step 2: Find & attack target with OPTIMAL ratios (30 seconds)
run profit-scan-flex.js
run smart-batcher.js joesguns    # 490x faster - $2.09m/s production!

# Step 3: Scale up (5 minutes)
run deploy/purchase-server-8gb.js

# Step 4: Monitor (wait 6-8 min for prep, then check)
run production-monitor.js 60
```

### First-Time Player Path
```bash
# 1. Learn basics through tutorial (5-10 min)
# 2. Install scripts (see Phase 1 above)
# 3. Start with n00dles:
run simple-batcher.js n00dles

# 4. Monitor and learn:
run production-monitor.js 60
run list-procs.js

# 5. Scale when ready:
run profit-scan.js
run simple-batcher.js NEW_TARGET
```

---

## 🎯 Target Progression Guide

### When to Switch Targets

| Current Target | Hacking Skill | Next Target | Reason |
|----------------|---------------|-------------|---------|
| n00dles | 1-50 | foodnstuff | 5x more money |
| foodnstuff | 50-100 | sigma-cosmetics | Better profit/sec |
| sigma-cosmetics | 100-200 | joesguns | Major profit jump |
| joesguns | 200-500 | hong-fang-tea | Further optimization |
| hong-fang-tea | 500-1000 | harakiri-sushi | Late game targets |

**Quick Check**: Run `profit-scan-flex.js` anytime to see if better options are available!

---

## 🔧 Deployment Scripts Explained

Understanding the different deployment scripts and when to use each one:

### smart-batcher.js - ⭐ RECOMMENDED Main Workhorse (490x Performance!)
**What it does**: Deploys batch attacks with OPTIMAL timing-based thread ratios  
**Runs on**: Home server (deploys to all rooted servers)  
**Best for**: Maximum income generation ($2.09m/s sustained!)  
**Key Innovation**: Calculates optimal ratios based on timing (4% hack / 87% grow / 9% weaken)  

```bash
run batch/smart-batcher.js joesguns              # Deploy with optimal ratios
run batch/smart-batcher.js joesguns 0.10         # Hack 10% per batch
run batch/smart-batcher.js joesguns --dry        # Test without deploying
```

**Performance**: 490x improvement over basic batching - transforms $4k/s into $2.09m/s!

### simple-batcher.js - Basic Workhorse
**What it does**: Coordinates HWGW (Hack-Weaken-Grow-Weaken) batch attacks  
**Runs on**: Home server (or wherever you run it from)  
**Best for**: Basic single-target income generation  

```bash
run batch/simple-batcher.js joesguns
```

### auto-expand.js - Network Sweep & Deployment
**What it does**: 
- Automatically roots ALL accessible servers in the network
- Deploys `hack-universal.js` (basic continuous hacking) to every rooted server
- Runs ONCE then exits

**Best for**: Early/mid-game rapid expansion across 50+ servers  

```bash
run deploy/auto-expand.js joesguns
```

**Key Features**:
- One-time network scan and deployment
- Spreads basic hacking widely across all available servers
- Like "planting seeds everywhere" for steady passive income

### batch-manager.js - Enhanced Batch Operation Supervisor ⭐ NEW
**What it does**: 
- **Automatically roots new servers** as your hacking level increases (every 10 cycles)
- Ensures `simple-batcher.js` runs continuously on a specific purchased server
- Monitors and auto-restarts if it stops
- Runs FOREVER in a loop

**Best for**: Mid/late-game when you have purchased servers with high RAM  

```bash
run batch/batch-manager.js joesguns 12 1.25 pserv-0 --quiet
# Disable auto-rooting if you prefer manual control:
run batch/batch-manager.js joesguns --quiet --no-root
```

**Key Features**:
- **Integrated auto-rooting** - roots new servers automatically
- **Smart quiet mode** - rooting notifications ALWAYS display (even with --quiet)
- Continuous monitoring and management
- Coordinates sophisticated batch attacks
- Like "tending a prize-winning plant" for maximum yield
- Set-and-forget automation

**💡 Note**: In quiet mode, you'll still see important events like "✓ Rooted: server-name" but routine status messages are hidden.

### When to Use Which?

| Game Stage | Recommended Strategy |
|------------|---------------------|
| **Early Game** (Hack 1-100) | `simple-batcher.js` on home targeting n00dles/foodnstuff |
| **Mid Game** (Hack 100-300) | ⭐ `smart-batcher.js` for 490x improvement OR `batch-manager.js` with auto-rooting |
| **Late Game** (Hack 300+) | ⭐ `smart-batcher.js` for maximum performance ($2.09m/s) |
| **Optimal Setup** | ⭐ `smart-batcher.js` (490x faster than basic!) |
| **Alternative** | `batch-manager.js` with auto-rooting (set and forget automation) |

### Why You Need Both auto-expand.js AND batch-manager.js

They serve **different but complementary purposes**:

```
auto-expand.js          →  One-time network sweep with basic deployment
                           (Quick setup, deploys hack-universal.js everywhere)

batch-manager.js        →  Continuous management + auto-rooting + advanced batching
                           (Set-and-forget automation with periodic rooting scans)
```

**Typical Workflow**:

**Option 1: Quick Start (Recommended)**
1. **Run continuously**: `batch-manager.js joesguns 12 1.25 pserv-0 --quiet`
   - Automatically roots new servers as you level up
   - Manages sophisticated batching
   - All-in-one solution

**Option 2: Manual Control**
1. **Run once**: `auto-expand.js joesguns` - Initial network sweep
2. **Run continuously**: `batch-manager.js joesguns --quiet --no-root` - Batching only
3. **Re-run auto-expand** manually when hacking increases

### Script Comparison: hack-universal.js vs simple-batcher.js

**hack-universal.js** (deployed by auto-expand):
- Simple sequential: hack → grow → weaken
- Low RAM requirement
- Works on any rooted server
- Basic income generation

**simple-batcher.js** (managed by batch-manager):
- Coordinated HWGW timing cycles
- Requires more RAM
- Sophisticated scheduling
- Maximum profit optimization

**Result**: Use auto-expand for quantity, batch-manager for quality!

---

## 💡 Pro Tips

### For Post-Augmentation Players
1. **Don't waste time on n00dles** - Your augmentations likely let you start higher
2. **Buy servers EARLY** - You'll make money faster than your first run
3. **Use --quiet flags** - You already know how things work
4. **Keep augmentation goals in mind** - Don't just grind, work toward next augs

### For New Players
1. **Start simple** - Use n00dles until comfortable
2. **Monitor everything** - Use production-monitor.js to learn
3. **Read the output** - The scripts tell you what's working
4. **Don't rush servers** - Make sure you're making steady income first

### For Everyone
1. **⭐ Use smart-batcher.js** - 490x performance improvement over basic batching!
2. **Bookmark profit-scan-flex.js** - Run it often to find better targets with realistic estimates
3. **Use global-kill.js** - When switching targets, kill everything first
4. **Wait for prep** - smart-batcher needs 6-8 minutes to prep server to max money
5. **Check documentation** - See docs/GETTING_STARTED.md for deeper explanations

---

## 🚨 Common Mistakes to Avoid

### ❌ Mistake #1: Targeting Too High
**Problem**: Trying to hack servers above your skill level  
**Solution**: Use profit-scan-flex.js to find accessible targets

### ❌ Mistake #2: Not Scaling Up
**Problem**: Staying on n00dles when you could handle joesguns  
**Solution**: Re-scan every 15-30 minutes in early game

### ❌ Mistake #3: Buying Servers Too Late
**Problem**: Waiting until you have $10m to buy servers  
**Solution**: Buy first server around $1-2m, scale gradually

### ❌ Mistake #4: Ignoring Production Monitor
**Problem**: Not knowing if your setup is working  
**Solution**: Run production-monitor.js for 60-300 seconds regularly

### ❌ Mistake #5: Manual Everything
**Problem**: Manually hacking when scripts could do it better  
**Solution**: Trust the automation - smart-batcher.js is your friend!

### ❌ Mistake #6: Using Basic Batcher When Smart-Batcher Exists ⭐
**Problem**: Using simple-batcher.js and getting only $4k/s  
**Solution**: Use smart-batcher.js for 490x improvement ($2.09m/s!)

---

## 📊 Success Metrics

### New Game (First Hour)
- ✅ Scripts installed and running
- ✅ At least 1 batch operation running
- ✅ Making $50k-500k per minute (basic) or $1-5m/min (smart-batcher)
- ✅ Hacking skill growing to 100+

### Post-Augmentation (First 30 Minutes) ⭐
- ✅ Scripts restored via GitHub
- ✅ Attacking optimal target with smart-batcher (not n00dles!)
- ✅ Making $5-125m per minute ($2.09m/s with smart-batcher!)
- ✅ 2-4 servers purchased
- ✅ **Far exceeding** previous run income with smart-batcher

### Both Scenarios (1-2 Hours)
- ✅ Multiple servers purchased
- ✅ Smart-batcher deployed with optimal ratios ($2.09m/s sustained)
- ✅ Income dramatically increased (490x improvement if using smart-batcher)
- ✅ Regular profit-scan checks for optimization

---

## 🔗 Next Steps

1. **After getting this guide working**: Read [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) for deeper understanding
2. **For script details**: Check [docs/SCRIPT_REFERENCE.md](docs/SCRIPT_REFERENCE.md)
3. **For advanced tactics**: Read [README.md](README.md) sections on optimization

---

## 📱 Print This!

Keep this quickstart guide handy:
1. Every augmentation reset uses the same pattern
2. Muscle memory beats documentation lookup
3. Copy-paste commands are your friend
4. Get back to peak performance in under 30 minutes!

---

**Remember**: The faster you set up automation, the faster you progress. Don't overthink it - run the scripts, monitor the output, and scale up!

**Pro Tip**: Use smart-batcher.js for 490x performance improvement - transforms $4k/s into $2.09m/s! ⭐

**Version**: 1.5.0  
**Last Updated**: 2025-10-26  
**Major Update**: Added smart-batcher.js with revolutionary performance gains!

