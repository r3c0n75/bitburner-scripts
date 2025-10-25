# Getting Started with Bitburner Scripts

This guide will help you get started with the Bitburner script collection.

## 🚀 Quick Setup

### 1. Copy Scripts to Game
1. Copy all scripts from this collection to your Bitburner home directory
2. Ensure you have the required helper scripts in the same directory

### 2. Basic Usage
```bash
# Find profitable targets
run profit-scan.js

# Start basic hacking
run simple-batcher.js joesguns

# Monitor your progress
run production-monitor.js 60
```

## 📊 Understanding Your Scripts

### Core Attack Scripts
- **attack-hack.js** - Performs hack operations
- **attack-grow.js** - Performs grow operations  
- **attack-weaken.js** - Performs weaken operations

### Batch Management
- **simple-batcher.js** - Deploys attack helpers across all servers
- **batch-manager.js** - Ensures batcher runs on purchased servers
- **auto-deploy-all.js** - Deploys scripts to all rooted servers

### Analysis Tools
- **profit-scan.js** - Finds most profitable targets
- **production-monitor.js** - Monitors money generation rate
- **server-info.js** - Shows detailed server information

## 🎯 Game Stage Progression

### Early Game (0-100 hacking skill)
1. Start with `n00dles` or `foodnstuff`
2. Use basic scripts without batching
3. Focus on growing your hacking skill

```bash
# Early game commands
run simple-batcher.js n00dles
run production-monitor.js 60
```

### Mid Game (100-1000 hacking skill)
1. Move to better targets like `joesguns`
2. Start using batch operations
3. Purchase your first servers

```bash
# Mid game commands
run profit-scan.js
run simple-batcher.js joesguns --include-home
run purchase-server-8gb.js
```

### Late Game (1000+ hacking skill)
1. Target high-value servers
2. Use advanced batch management
3. Optimize for maximum profit

```bash
# Late game commands
run batch-manager.js joesguns 12 1.25 home --quiet
run auto-deploy-all.js
```

## 🔧 Configuration

### Thread Distribution
The scripts automatically distribute threads as follows:
- **25%** Hack threads
- **45%** Grow threads
- **30%** Weaken threads

### Timing Optimization
- **Conservative**: 1.0x multiplier (no buffer)
- **Balanced**: 1.25x multiplier (25% buffer)
- **Aggressive**: 1.5x multiplier (50% buffer)

## 📈 Optimization Tips

### 1. Target Selection
- Use `profit-scan.js` to find the most profitable targets
- Focus on servers with high money and low security
- Consider your current hacking skill level

### 2. Resource Management
- Monitor RAM usage with `list-procs.js`
- Purchase servers when you have excess money
- Use `list-pservs.js` to check purchased server status

### 3. Batch Operations
- Start with simple batching on a few servers
- Gradually scale up as you get more RAM
- Use `--quiet` flag for automated operations

## 🚨 Troubleshooting

### Common Issues

#### "Insufficient RAM" Error
```bash
# Check available RAM
run list-procs.js

# Kill unnecessary processes
run global-kill.js

# Try with fewer threads
run simple-batcher.js joesguns 50
```

#### "No Root Access" Error
- Ensure you have the required hacking tools
- Check if the server requires port opening
- Use `server-info.js` to see server details

#### Low Production Rate
```bash
# Check target profitability
run profit-scan.js

# Monitor current production
run production-monitor.js 300

# Try different targets
run simple-batcher.js foodnstuff
```

### Debug Commands
```bash
# Check what's running
run list-procs.js

# Check server status
run server-info.js

# Monitor production
run production-monitor.js 60

# Kill everything and restart
run global-kill.js
```

## 📚 Advanced Usage

### Custom Batch Operations
```bash
# Deploy with specific thread limits
run simple-batcher.js joesguns 100

# Include home server in operations
run simple-batcher.js joesguns --include-home

# Dry run to see what would happen
run simple-batcher.js joesguns --dry
```

### Server Management
```bash
# Purchase multiple servers
run purchase-server-8gb.js

# Deploy to all rooted servers
run auto-deploy-all.js 50

# Check purchased server status
run list-pservs.js
```

### Monitoring and Analysis
```bash
# Find best targets
run profit-scan.js

# Monitor production over time
run production-monitor.js 300

# Check system status
run list-procs.js
```

## 🎯 Next Steps

1. **Start Simple**: Begin with basic scripts on easy targets
2. **Monitor Progress**: Use analysis tools to track your progress
3. **Scale Up**: Gradually increase complexity as you gain resources
4. **Optimize**: Use profit scanning to find better targets
5. **Automate**: Implement batch management for hands-off operation

## 📖 Additional Resources

- Check individual script headers for detailed usage
- Use `--help` flags where available
- Monitor production regularly for optimization
- Scale operations based on available resources

---

**Remember**: Start simple and gradually work your way up to more complex operations. The key to success is understanding your current capabilities and scaling appropriately.
