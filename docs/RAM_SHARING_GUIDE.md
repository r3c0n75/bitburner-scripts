# RAM Sharing for Faction Reputation Guide

## What is RAM Sharing?

RAM sharing is a Bitburner mechanic that allows you to share your free RAM with your faction to get a **reputation multiplier bonus**. This is incredibly useful when working on faction reputation through missions, donations, or other activities.

## How It Works

- Each time you share RAM, you get a **10-second bonus**
- The bonus **scales with the amount of RAM** you share
- You can share RAM from **multiple servers** simultaneously
- The bonus **stacks** across all servers sharing RAM
- The script continuously calls `ns.share()` to maintain the bonus

## Quick Start

### Option 1: Deploy Everywhere (Recommended)
This is the easiest way to maximize your faction reputation bonus:

```bash
run deploy/deploy-share-all.js
```

This will:
- Scan your entire network
- Deploy RAM sharing to all rooted servers
- Reserve 64GB on home for other operations
- Show you exactly how many threads are sharing
- Calculate your total sharing capacity

### Option 2: Run on Specific Server
If you only want to share RAM from one server:

```bash
run utils/share-ram.js
```

## When to Use RAM Sharing

✅ **Good times to share RAM:**
- Working on faction missions or contracts
- Making faction donations
- When servers are idle (not actively hacking)
- During early game when you have more RAM than needed
- When focusing on reputation over money

❌ **When NOT to share:**
- When you need maximum hacking income
- During intensive batch operations
- When every GB counts for your hacking strategy

## Understanding the Output

### deploy-share-all.js Output
```
============================================================
DEPLOYING RAM SHARING ACROSS NETWORK
============================================================
✓ home                - 123 threads (504.40GB available)
✓ n00dles            - 45 threads (72.00GB available)
✓ foodnstuff         - 32 threads (51.20GB available)
============================================================
DEPLOYMENT COMPLETE
Successfully deployed: 3 servers
Failed: 0 servers
Total sharing threads: 200
============================================================
```

- **Threads**: More threads = bigger bonus
- **Available RAM**: Free RAM being used for sharing
- **Total threads**: Your overall sharing capacity

### share-ram.js Output
```
[home] Starting RAM sharing for faction reputation bonus...
[home] Sharing RAM - Runtime: 10.5m, Cycles: 10
[home] Sharing RAM - Runtime: 21.2m, Cycles: 20
```

- **Runtime**: How long the script has been sharing
- **Cycles**: Number of share cycles completed (~10 seconds each)

## RAM Management

### Home Server
The deployment script automatically **reserves 64GB** on your home server for other operations. This ensures you can still run terminal commands and manage your network.

### Other Servers
All other rooted servers will use **100% of their free RAM** for sharing (minus what's needed for the script itself).

## Stopping RAM Sharing

To stop sharing and reclaim your RAM:

```bash
run utils/global-kill.js
```

This will kill all scripts, including RAM sharing scripts.

## Tips & Best Practices

1. **Deploy After Purchases**: Run `deploy-share-all.js` again after buying new servers to include them

2. **Balance with Hacking**: Keep some servers focused on hacking for income, others on sharing for reputation

3. **Check Your Bonus**: In the Bitburner UI, you can see your current reputation bonus multiplier

4. **Redeploy When Needed**: If you've stopped other scripts and want to maximize sharing, just run the deploy script again

5. **Early Game Advantage**: In early game, RAM sharing can be more valuable than hacking since you have limited hacking capabilities but plenty of RAM

## Integration with Other Scripts

RAM sharing works alongside:
- **batch-manager.js**: Share RAM on servers not managed by batch-manager
- **smart-batcher.js**: Share RAM on unused servers while batching on others
- **hack-universal.js**: Share RAM during prep phases when servers are idle

## Technical Details

- **RAM Cost**: 1.6GB per thread for share-ram.js
- **Bonus Duration**: 10 seconds per share cycle
- **Script Behavior**: Runs indefinitely until killed
- **Network Scanning**: Uses recursive scan to find all servers
- **Thread Calculation**: Automatically maximizes threads per server

## Example Scenarios

### Scenario 1: Full Network Sharing
You have 10 rooted servers with 100GB each = 1000GB total available
```bash
run deploy/deploy-share-all.js
# Output: ~625 total threads sharing across 10 servers
# Massive reputation bonus!
```

### Scenario 2: Hybrid Approach
- 5 servers running smart-batcher (income)
- 5 servers running RAM sharing (reputation)
```bash
# Deploy batching to production servers
run batch/batch-manager.js phantasy 0.05 1.25 home --quiet

# Deploy sharing to remaining servers
# (manually select servers or modify deploy-share-all.js)
```

### Scenario 3: Early Game Focus
In early game when hacking is weak:
```bash
# Share all available RAM for maximum faction reputation
run deploy/deploy-share-all.js

# Focus on faction work to get augmentations faster
```

## FAQ

**Q: Does RAM sharing generate money?**  
A: No, it only increases faction reputation gain. For money, use hacking scripts.

**Q: Can I share RAM from purchased servers?**  
A: Yes! All rooted servers can share RAM.

**Q: How much does the bonus increase per GB shared?**  
A: The exact formula varies, but more RAM = higher multiplier. Check in-game for your current bonus.

**Q: Can I run this alongside hacking scripts?**  
A: Yes, but they compete for RAM. Balance based on your current goals.

**Q: Will this slow down my hacking operations?**  
A: Only if you're sharing RAM that could be used for hacking. The deployment script reserves RAM on home to prevent conflicts.

## Related Scripts

- **utils/share-ram.js** - Core sharing script
- **deploy/deploy-share-all.js** - Network-wide deployment
- **utils/global-kill.js** - Stop all scripts (including sharing)
- **utils/list-procs.js** - See which servers are sharing

## Summary

RAM sharing is a powerful tool for boosting faction reputation when used strategically. Deploy it network-wide for maximum effect, or target specific servers for a balanced approach. Remember to redeploy after network changes and stop sharing when you need maximum hacking capacity.

Happy faction grinding! 🚀

