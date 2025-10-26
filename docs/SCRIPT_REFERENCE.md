# Script Reference

Complete reference for all scripts in the Bitburner collection.

## Core Attack Scripts

### attack-hack.js
**Purpose**: Performs hack operations on target servers
**Usage**: `run attack-hack.js <target>`
**Parameters**:
- `target` - Server to hack

### attack-grow.js  
**Purpose**: Performs grow operations on target servers
**Usage**: `run attack-grow.js <target>`
**Parameters**:
- `target` - Server to grow

### attack-weaken.js
**Purpose**: Performs weaken operations on target servers  
**Usage**: `run attack-weaken.js <target>`
**Parameters**:
- `target` - Server to weaken

## Batch Management Scripts

### simple-batcher.js
**Purpose**: Deploy attack helpers across reachable servers
**Usage**: `run simple-batcher.js <target> [capThreads] [--include-home] [--quiet] [--dry]`
**Parameters**:
- `target` - Server to attack
- `capThreads` - Maximum threads per server (optional)
- `--include-home` - Include home server in operations
- `--quiet` - Reduce output verbosity
- `--dry` - Show what would happen without executing

**Examples**:
```bash
run simple-batcher.js joesguns
run simple-batcher.js joesguns 100
run simple-batcher.js joesguns --include-home --quiet
run simple-batcher.js joesguns --dry
```

### batch-manager.js
**Purpose**: Ensure simple-batcher.js runs on purchased servers
**Usage**: `run batch-manager.js [target] [capPerHost] [multiplier] [pservHost] [flags...]`
**Parameters**:
- `target` - Server to attack (default: joesguns)
- `capPerHost` - Maximum threads per host (default: Infinity)
- `multiplier` - Batch timing multiplier (default: 1.25)
- `pservHost` - Host for batch manager (default: home)
- `flags` - Flags to forward to simple-batcher.js

**Examples**:
```bash
run batch-manager.js joesguns 12 1.25 home --quiet
run batch-manager.js joesguns --quiet
run batch-manager.js --quiet
```

### auto-deploy-all.js
**Purpose**: Deploy hack-joesguns.js to all rooted servers
**Usage**: `run auto-deploy-all.js [capThreads]`
**Parameters**:
- `capThreads` - Maximum threads per server (optional)

**Examples**:
```bash
run auto-deploy-all.js
run auto-deploy-all.js 50
```

## Analysis Scripts

### profit-scan.js
**Purpose**: Print ranked list of servers by estimated profit/sec
**Usage**: `run profit-scan.js`
**Output**: Shows top 30 most profitable targets with:
- Server name
- Root access status
- RAM available
- Maximum money
- Minimum security
- Hack time
- Hack chance
- Money per second per thread

### profit-scan-flex.js
**Purpose**: Advanced profit scanner with caching and profiler integration
**Usage**: `run profit-scan-flex.js [limit] [--dry] [--all]`
**Parameters**:
- `limit` - Number of servers to display (default: 30)
- `--dry` - Don't write profiler-overrides.json file
- `--all` - Show ALL servers including zero-money servers (purchased servers, home, darkweb)

**Features**:
- **Automatic caching** - Creates and uses `profiler-overrides.json` for faster scans
- **Detailed output** - Shows hack/grow/weaken times, current security
- **Override indicator** - Shows which servers use cached timing data
- **Smart fallback** - Uses live API calls if cache unavailable
- **Smart filtering BY DEFAULT** - Automatically hides zero-money servers for clean output

**Examples**:
```bash
run profit-scan-flex.js                    # DEFAULT: Show only money servers, top 30
run profit-scan-flex.js 50                 # Show top 50 money servers
run profit-scan-flex.js --all              # Show ALL servers (including purchased/home)
run profit-scan-flex.js 100 --dry          # Don't write cache file, show money servers
run profit-scan-flex.js 50 --all --dry     # Combine flags
```

**Default Filter Behavior**:
- **Filters out by default**: Purchased servers (pserv-*), home, darkweb, any server with maxMoney ≤ 0
- **Shows by default**: Currently hackable targets (rooted + money) and future targets (not rooted but have money)
- **Clean output** - No clutter from zero-value servers
- **Use `--all` flag** to see everything including purchased servers

**Output Columns**:
- OVR - Whether cached timing data was used (YES/blank)
- Server name and root access (YES/NO)
- RAM, max money, min/current security
- Hack/Grow/Weaken times (in seconds)
- Hack chance percentage
- Money per second per thread (idealized)

### production-monitor.js
**Purpose**: Measure player money change over time
**Usage**: `run production-monitor.js [seconds]`
**Parameters**:
- `seconds` - Monitoring duration (default: 60)

**Examples**:
```bash
run production-monitor.js 60
run production-monitor.js 300
```

### server-info.js
**Purpose**: Display detailed server information
**Usage**: `run server-info.js [server]`
**Parameters**:
- `server` - Server to analyze (optional, defaults to current)

## Utility Scripts

### global-kill.js
**Purpose**: Kill all running scripts across all servers
**Usage**: `run global-kill.js`
**Note**: Does not kill the global-kill.js script itself

### list-procs.js
**Purpose**: List all running processes across all servers
**Usage**: `run list-procs.js`
**Output**: Shows:
- Server name
- Script name
- Thread count
- RAM usage
- Process ID

### list-pservs.js
**Purpose**: List all purchased servers and their status
**Usage**: `run list-pservs.js`
**Output**: Shows:
- Server name
- RAM capacity
- Used RAM
- Free RAM
- Root access status
- Available money

## Server Management Scripts

### purchase-server-8gb.js
**Purpose**: Purchase servers with 8GB RAM
**Usage**: `run purchase-server-8gb.js`
**Features**:
- Checks available funds
- Verifies server limit
- Automatically names servers (pserv-1, pserv-2, etc.)

### replace-pservs-no-copy.js
**Purpose**: Replace purchased servers without copying scripts
**Usage**: `run replace-pservs-no-copy.js`
**Note**: This script is for advanced users who want to replace servers without preserving scripts

### home-batcher.js
**Purpose**: Home server batch operations
**Usage**: `run home-batcher.js [target]`
**Parameters**:
- `target` - Server to attack (default: joesguns)

## Deployment Scripts

### deploy-hack-joesguns.js
**Purpose**: Deploy joesguns hack script to servers
**Usage**: `run deploy-hack-joesguns.js [target]`
**Parameters**:
- `target` - Server to attack (default: joesguns)

### hack-joesguns.js
**Purpose**: Alternative hack script for joesguns
**Usage**: `run hack-joesguns.js`
**Features**:
- Automatic target selection
- Security and money threshold management
- Continuous operation

### hack-n00dles.js
**Purpose**: Early game hack script for n00dles
**Usage**: `run hack-n00dles.js`
**Features**:
- Optimized for early game
- Simple target selection
- Basic security management

## Monitoring Scripts

### estimate-production.js
**Purpose**: Estimate production rates for different configurations
**Usage**: `run estimate-production.js [target]`
**Parameters**:
- `target` - Server to analyze (optional)

### production-monitor.js
**Purpose**: Monitor money generation over time
**Usage**: `run production-monitor.js [seconds]`
**Parameters**:
- `seconds` - Monitoring duration (default: 60)

## Advanced Usage

### Script Combinations

#### Basic Setup
```bash
# Find best targets
run profit-scan.js

# Deploy to all servers
run simple-batcher.js joesguns

# Monitor progress
run production-monitor.js 300
```

#### Advanced Setup
```bash
# Purchase servers
run purchase-server-8gb.js

# Deploy batch manager
run batch-manager.js joesguns 12 1.25 home --quiet

# Monitor system
run list-procs.js
run list-pservs.js
```

#### Troubleshooting
```bash
# Check what's running
run list-procs.js

# Kill everything
run global-kill.js

# Restart with monitoring
run simple-batcher.js joesguns
run production-monitor.js 60
```

## Script Dependencies

### Required Helper Scripts
- `attack-hack.js`
- `attack-grow.js`
- `attack-weaken.js`

### Optional Scripts
- `hack-joesguns.js`
- `hack-n00dles.js`

### Configuration Files
- `config/default-targets.js` - Predefined target lists
- `config/recommended-settings.js` - Recommended configurations

## Best Practices

### 1. Start Simple
- Begin with basic scripts on easy targets
- Use monitoring tools to track progress
- Gradually increase complexity

### 2. Monitor Performance
- Use `profit-scan.js` to find better targets
- Monitor production with `production-monitor.js`
- Check system status with `list-procs.js`

### 3. Scale Appropriately
- Start with small thread counts
- Gradually increase as you gain resources
- Use batch management for automation

### 4. Troubleshoot Issues
- Check RAM usage with `list-procs.js`
- Verify server access with `list-pservs.js`
- Use `global-kill.js` to reset if needed

---

**Note**: This reference covers all scripts in the collection. For specific usage examples, see the individual script headers and the Getting Started guide.
