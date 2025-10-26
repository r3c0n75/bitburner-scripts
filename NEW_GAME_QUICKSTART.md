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
   # Re-scan for better opportunities
   run profit-scan-flex.js
   
   # Switch to profitable target (example: joesguns)
   run global-kill.js
   run simple-batcher.js joesguns
   ```

2. **Buy Your First Server**
   ```bash
   # When you have ~$1-2 million saved
   run purchase-server-8gb.js
   ```

3. **Deploy Across All Servers**
   ```bash
   # Auto-deploy to everything you can root
   run auto-deploy-all.js
   
   # Monitor the results
   run production-monitor.js 300
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
   # Jump straight to your best accessible target
   # (Your augmentations may let you skip n00dles entirely!)
   run simple-batcher.js joesguns
   
   # Or whatever profit-scan recommended
   ```

### Recovery Phase 2: Rapid Scaling (5-15 minutes)
**Priority: Restore income stream**

1. **Deploy to All Available Servers**
   ```bash
   # You likely have more port openers from previous run
   run auto-deploy-all.js
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

### Absolute Fastest Recovery (Copy-Paste This)
```bash
# Step 1: Get scripts (10 seconds)
wget https://raw.githubusercontent.com/r3c0n75/bitburner-scripts/main/bitburner-update.js bitburner-update.js
run bitburner-update.js

# Step 2: Find & attack target (30 seconds)
run profit-scan-flex.js
run simple-batcher.js joesguns

# Step 3: Scale up (5 minutes)
run auto-deploy-all.js
run purchase-server-8gb.js

# Step 4: Monitor (ongoing)
run production-monitor.js 300
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
1. **Bookmark profit-scan-flex.js** - Run it often to find better targets
2. **Use global-kill.js** - When switching targets, kill everything first
3. **Save automation for later** - batch-manager.js is for when you have 3+ servers
4. **Check documentation** - See docs/GETTING_STARTED.md for deeper explanations

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
**Solution**: Trust the automation - simple-batcher.js is your friend

---

## 📊 Success Metrics

### New Game (First Hour)
- ✅ Scripts installed and running
- ✅ At least 1 batch operation running
- ✅ Making $50k-500k per minute
- ✅ Hacking skill growing to 100+

### Post-Augmentation (First 30 Minutes)
- ✅ Scripts restored via GitHub
- ✅ Attacking optimal target (not n00dles!)
- ✅ Making $500k-5m per minute
- ✅ 2-4 servers purchased
- ✅ Matching or exceeding previous run income

### Both Scenarios (1-2 Hours)
- ✅ Multiple servers purchased
- ✅ Auto-deploy running across all rooted servers
- ✅ Income steadily increasing
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

**Version**: 1.0.0  
**Last Updated**: 2025-10-26

