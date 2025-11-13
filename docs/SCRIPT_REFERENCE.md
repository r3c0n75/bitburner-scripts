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

### batch-manager.js ⭐ v1.8.10
**Purpose**: Enhanced batch manager with auto-rooting, instant RAM detection, and intelligent monitoring - deploys smart-batcher.js
**Usage**: `run batch-manager.js [target] [hackPercent] [multiplier] [pservHost] [flags...]`
**Parameters**:
- `target` - Server to attack (default: joesguns)
- `hackPercent` - Percentage of server money to hack per batch (default: 0.05 = 5%)
- `multiplier` - Batch timing multiplier (default: 1.25)
- `pservHost` - Host for batch manager (default: home)
- `flags` - Special flags:
  - `--quiet` - Suppress routine messages to terminal (LOG window still updated)
  - `--no-root` - Disable automatic server rooting

**Features**:
- 🚀 Automatically deploys 490x more efficient smart-batcher
- ⚡ **Instant RAM detection** - Detects server upgrades within one cycle (~85s)
- 📊 **Enhanced reporting** - Shows both RAM increase and current size per server
- 🔄 Monitors for new servers every 10 cycles
- 📋 **LOG window support** - All activity visible via script log
- 🎯 Smart redeployment - Only when changes detected (RAM upgrades or new servers)
- 💰 Leverages optimal timing-based thread ratios (4% hack / 87% grow / 9% weaken)
- 🔕 Clean logs - 23 API calls silenced for spam-free monitoring

**Examples**:
```bash
run batch-manager.js omega-net                        # Recommended
run batch-manager.js omega-net 0.05 1.25 home --quiet # Quiet mode
run batch-manager.js joesguns --quiet --no-root       # Disable auto-rooting
run batch-manager.js --quiet                          # Use all defaults (5% hack)
```

**What You'll See**:
```
============================================================
BATCH MANAGER v1.8.10 - Starting...
============================================================
Target: omega-net | Host: home | HackPercent: 5.0%
Interval: 84.28s | Hack Time: 16.86s
Auto-rooting: ENABLED (scan every 10 cycles)
============================================================
Running initial server scan...
Initial scan complete: 95 server(s) rooted (0 new)
Total network RAM: 13476GB across rooted servers
[Cycle 2] Waiting... (next scan in 8 cycles)
✓ Network RAM changed: 13476GB → 19876GB (+6400GB)
  Estimated: 25 purchased servers (~256GB increase each, now ~512GB per server)
Deploying batch/smart-batcher.js on home...
✓ Deployed batch/smart-batcher.js on home (pid=1596)
```

**Key Improvements**:
- **v1.8.10**: Enhanced RAM reporting (shows increase + current size)
- **v1.8.9**: Instant RAM detection every cycle (vs every 10 cycles)
- **v1.8.8**: LOG window support + comprehensive monitoring

**RAM Upgrade Detection**:
- Checks RAM **every cycle** (~85 seconds for typical targets)
- Detects upgrades **14x faster** than previous version
- Automatically redeploys smart-batcher with expanded fleet
- Shows clear breakdown: total change, per-server increase, current size

### smart-batcher.js ⭐ RECOMMENDED
**Purpose**: Intelligent batch deployment with optimal timing-based thread ratios
**Performance**: 490x improvement over basic batching ($4k/s → $2.09m/s)
**Compatibility**: ✅ v3.0.0 and v2.8.1
**Usage**: `run smart-batcher.js <target> [hackPercent] [--include-home] [--quiet] [--dry]`

**Parameters**:
- `target` - Server to attack (required)
- `hackPercent` - Percentage of server money to hack per batch (default: 0.05 = 5%)
- `--include-home` - Include home server in deployment
- `--quiet` - Reduce output verbosity
- `--dry` - Show analysis and plan without deploying

**Key Innovation**: 
Calculates optimal thread ratios based on timing analysis instead of arbitrary allocation:
```
Traditional: 25% hack / 45% grow / 30% weaken (inefficient)
Smart:        4% hack / 87% grow /  9% weaken (optimal)
```

**Features**:
- 📊 Intelligent ratio calculator based on security mechanics
- ⚖️ Timing analysis (batch window, efficiency)
- 💰 Production estimates (expected income after prep)
- 🎯 Customizable hack percentage
- 📈 Beautiful formatted output with deployment summary
- ⚡ 3-4x faster server preparation time

**Examples**:
```bash
run smart-batcher.js joesguns              # Deploy with optimal ratios (5% hack)
run smart-batcher.js joesguns 0.10         # Hack 10% of server per batch
run smart-batcher.js joesguns --dry        # Test analysis without deploying
run smart-batcher.js joesguns --quiet      # Quiet deployment mode
run smart-batcher.js joesguns --include-home  # Include home server
```

**Real Performance**:
- Deployed across 56 servers
- 1304 threads (45 hack / 1119 grow / 140 weaken)
- Server prepped to 97% in 6 minutes
- Sustained **$2.09m/s** production ($7.5 billion/hour)

**Why It Works**:
1. Grow operations take 3-4x longer than hack
2. Needs proportionally more grow threads to maintain balance
3. 87% grow allocation enables exponential money growth
4. Server reaches max money 3-4x faster
5. Minimal hack threads (4%) - all that's needed when server is full

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

### profit-scan-flex.js ⭐
**Purpose**: Advanced profit scanner with current and FLEET POTENTIAL rankings
**Usage**: `run profit-scan-flex.js [limit] [--save] [--all] [--optimal]`
**Parameters**:
- `limit` - Number of servers to display (default: 30)
- `--save` - Write profiler-overrides.json timing cache file
- `--all` - Show ALL servers including zero-money servers (purchased servers, home, darkweb)
- `--optimal` - Rank by FLEET POTENTIAL (capacity + efficiency) instead of current state

**Features**:
- **Fleet Potential Rankings** 🎯 - Balances capacity + efficiency for large fleets (v1.5.3 fix)
- **Fleet Score Formula** - Per-thread income × log10(Max Money)
- **Prep Status Indicators** - See if servers are ready (✓), need light prep (◐), or heavy prep (⚠)
- **Dual-Mode Display** - Current state (default) or fleet potential (--optimal)
- **Capacity Awareness** - ⭐ marker highlights max money for fleet planning
- **Realistic Calculations** - Batch-cycle-aware estimates accounting for grow/weaken overhead
- **Smart Hints** - Shows potential gains for servers needing prep
- **Fresh Timing Data** - Always generates current timing from rooted hosts
- **Smart Filtering** - Automatically hides zero-money servers for clean output

**Examples**:
```bash
run profit-scan-flex.js                    # DEFAULT: Current state, money servers, top 30
run profit-scan-flex.js --optimal          # Rank by POTENTIAL (find hidden gems!)
run profit-scan-flex.js 50 --optimal       # Show top 50 by potential
run profit-scan-flex.js --all              # Show ALL servers (including purchased/home)
run profit-scan-flex.js --optimal --save   # Optimal rankings + save timing data
```

**Ranking Modes**:
- **Current Mode (default)**: Ranks by as-is performance (current security/money)
  - Shows what servers produce RIGHT NOW
  - Hints at potential for servers with 2x+ improvement possible
  - Best for: Finding immediately profitable targets
  
- **Fleet Potential Mode (`--optimal`)**: Ranks by FLEET POTENTIAL (capacity + efficiency)
  - Uses Fleet Score = Per-thread income × log10(Max Money)
  - Balances efficiency with max money capacity
  - Displays ⭐ to emphasize capacity importance
  - Best for: Large fleets (100-2000 threads) needing high-capacity targets

**Prep Status Indicators**:
- ✓ READY - At/near min security, farm immediately
- ◐ LIGHT PREP - Needs weakening (security delta > 50% of min)
- ⚠ HEAVY PREP - Needs significant prep (security delta > 200% of min)

**Real-World Example (v1.5.3 - Fixed)**:
```
Current Rankings:           Fleet Potential Rankings:
1. silver-helix 16.91k/s    1. phantasy        Score: 196k ($600m)
2. foodnstuff   11.11k/s    2. silver-helix    Score: 167k ($1.13b) ⭐
3. joesguns     10.83k/s    3. omega-net       Score: 146k ($1.59b) ⭐
4. sigma-cosmetics 9.70k/s  4. max-hardware    Score: 145k ($250m)
5. phantasy      7.09k/s    ...
                            10. sigma-cosmetics Score: 91k  ($57.5m)
```

**Key Insight**: silver-helix (#2) is often better than phantasy (#1) because:
- Already at optimal state (no prep time)
- 2x larger capacity ($1.13b vs $600m)
- Proven $3.41m/s production

**Output Display**:
- Server name, root status, RAM capacity
- Prep status indicator (✓/◐/⚠)
- Max money, security (current/min with delta)
- Timing: Hack/Grow/Weaken cycle times
- Hack chance percentage
- Income per thread (batch-cycle-aware realistic estimate)
- Potential after prep (when applicable)

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
**Purpose**: Kill all running scripts across all servers with 100% reliability
**Usage**: `run utils/global-kill.js`

**Enhanced Features** ✨:
- Uses `ns.killall()` for efficient bulk operations
- Strategic 50ms delays between servers ensure proper process termination
- Processes all remote servers first, saves current host for last
- Double protection against self-termination (checks filename AND process ID)
- Clear feedback with ✓ indicator and process counts

**Example Output**:
```
✓ Killed 147 processes across 56 servers.
```

**Why Enhanced**:
Previous version had timing issues causing some processes to survive. The enhanced version eliminates race conditions and provides 100% reliable termination across your entire network.

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

### share-ram.js
**Purpose**: Share free RAM with faction for reputation bonus multiplier
**Usage**: `run utils/share-ram.js`
**Features**:
- Continuously calls `ns.share()` to maintain 10-second reputation bonus
- **Optimized RAM usage: Exactly 4.00GB** - perfect for memory in multiples of 4GB
- Can run on any server with free RAM
- Minimal overhead for maximum efficiency
**Note**: Use with `deploy/deploy-share-all.js` to deploy across entire network for maximum faction reputation gains. The 4GB optimization ensures perfect RAM utilization (e.g., 8GB = 2 instances, 16GB = 4 instances).

### test-formulas.js 🔮
**Purpose**: Test Formulas.exe installation and functionality
**Usage**: `run utils/test-formulas.js`
**Features**:
- Verifies Formulas.exe is properly installed
- Tests all formula calculation functions
- Shows exact hack chance, timing, and growth calculations
- Displays player stats integration
**Requirements**: Formulas.exe ($5 billion from Dark Web)
**Note**: Run this first after purchasing Formulas.exe to verify it's working

### f-estimate-production.js 🔮
**Purpose**: EXACT production rate calculations using Formulas.exe
**Usage**: `run analysis/f-estimate-production.js [target]`
**Features**:
- Perfect accuracy using `ns.formulas.hacking.*` API
- Shows both current AND optimal state projections
- Calculates exact improvement percentages from prep
- Zero estimation error - all calculations are precise
- Accounts for your exact player stats and multipliers
**Requirements**: Formulas.exe ($5 billion from Dark Web)
**Note**: Use this instead of estimate-production.js for guaranteed accurate predictions

## Server Management Scripts

### purchase-server-8gb.js
**Purpose**: Purchase servers with 8GB RAM
**Usage**: `run purchase-server-8gb.js`
**Features**:
- Checks available funds
- Verifies server limit
- Automatically names servers (pserv-1, pserv-2, etc.)

### replace-pservs-no-copy.js
**Purpose**: Upgrade all purchased servers to higher RAM capacity
**Usage**: 
```bash
run deploy/replace-pservs-no-copy.js           # Show upgrade options
run deploy/replace-pservs-no-copy.js 32        # Upgrade to 32GB
run deploy/replace-pservs-no-copy.js 128       # Upgrade to 128GB
```

**Features**:
- Shows current RAM, available upgrade options, and costs
- Validates you have sufficient funds before starting
- Deletes old servers and purchases new ones with same names
- Tracks success/failure for each server
- Displays total RAM after upgrade

**Important**: Batch-manager should automatically detect the upgraded servers on its next cycle. If it doesn't restart automatically, you can manually restart:
```bash
run utils/global-kill.js                                 # Kill all processes
run batch/batch-manager.js joesguns --quiet              # Restart batch manager (uses defaults)
```

**Note**: Does not preserve scripts on servers (they're redeployed automatically by batch-manager)

### home-batcher.js
**Purpose**: Home server batch operations
**Usage**: `run batch/home-batcher.js [target]`
**Parameters**:
- `target` - Server to attack (default: joesguns)

## Deployment Scripts

### deploy-share-all.js
**Purpose**: Deploy RAM sharing across entire network for maximum faction reputation bonus
**Usage**: `run deploy/deploy-share-all.js`
**Features**:
- Scans entire network for all rooted servers
- Deploys `utils/share-ram.js` to maximize reputation bonus
- Reserves 64GB on home for other operations
- Shows deployment status with thread counts per server
- Reports total sharing capacity
**Note**: The faction reputation bonus scales with total shared RAM across all servers. The bonus updates every 10 seconds.

## Formula-Enhanced Scripts (Formulas.exe Required) 🔮

### f-profit-scan-flex.js ⭐ EXACT TARGET SELECTION
**Purpose**: Find best hacking targets with PERFECT calculations (zero error)
**Usage**: `run analysis/f-profit-scan-flex.js [limit] [--optimal] [--all] [--save]`
**Features**:
- Uses `ns.formulas.hacking.*` for EXACT calculations (no estimates)
- Perfect hack chance calculations at optimal and current states
- Exact timing calculations with your player stats
- Flawless optimal state projections
- Shows exact improvement percentages after prep
**Requirements**: Formulas.exe ($5 billion from Dark Web)
**Examples**:
```bash
run analysis/f-profit-scan-flex.js            # exact current state rankings
run analysis/f-profit-scan-flex.js --optimal  # exact potential rankings
run analysis/f-profit-scan-flex.js 50         # top 50 targets
```
**Note**: This is the ultimate target selection tool - every number is guaranteed accurate

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

### estimate-production.js ⭐ ENHANCED
**Purpose**: Estimate REALISTIC production rates with batch-cycle-aware calculations
**Usage**: `run estimate-production.js [target]`
**Parameters**:
- `target` - Server to analyze (default: joesguns)

**What's New**:
- ✅ Realistic batch cycle calculations (not misleading continuous hack rates)
- ✅ Shows server prep status (current money as % of max)
- ✅ Calculates actual batches per minute
- ✅ Displays batch efficiency (typically 20%)
- ✅ Warns if server needs preparation

**Output Sections**:
1. **Production Estimate**: Server stats and timing analysis
2. **Batch Cycle Analysis**: Realistic batch window and intervals
3. **Realistic Production Estimates**: Income per thread (1, 5, 10, 25, 50, 100)
4. **Efficiency Analysis**: Theoretical vs realistic rates
5. **Warnings**: Server prep status

**Example Output**:
```
=== Batch Cycle Analysis ===
Batch Cycle Time: 22.32s
Safe Interval: 27.90s
Max Batches/min: 2.15

=== Realistic Production Estimates ===
1 hack threads: $9.55k/s, $573k/min, $34.38m/hr

=== Efficiency Analysis ===
Theoretical max: $45.85k/s
Realistic rate: $9.55k/s
Batch efficiency: 20.0%

⚠️ WARNING: Server only at 16.6% of max money
```

**Key Insight**: Estimates now match actual measured production (use with `production-monitor.js` to verify)

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

#### Advanced Setup (Recommended with smart-batcher)
```bash
# Find best target with realistic estimates
run profit-scan-flex.js

# Estimate expected production
run estimate-production.js joesguns

# Deploy with optimal ratios (490x improvement!)
run smart-batcher.js joesguns

# Monitor actual production (wait 6-8 minutes for prep)
run production-monitor.js 60

# Verify server status
run estimate-production.js joesguns
```

#### Alternative Setup (with batch-manager)
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

## Stock Trading Scripts

For comprehensive documentation on the complete 7-script stock trading suite, see:

**[STOCK_TRADING_GUIDE.md](STOCK_TRADING_GUIDE.md)** - Complete stock trading guide including:
- `stock-info.js` - Market intelligence viewer
- `stock-trader-basic.js` - Forecast-based automated trading
- `stock-trader-advanced.js` - Advanced strategies with dynamic sizing
- `stock-trader-momentum.js` - Momentum trading (no 4S Data required!)
- `stock-momentum-analyzer.js` - Preview with forecast intelligence
- `stock-monitor.js` - Real-time portfolio dashboard with realized P/L
- `close-all-stock.js` - Portfolio liquidation with safety confirmation

---

**Note**: This reference covers core automation scripts. For stock trading, see STOCK_TRADING_GUIDE.md. For specific usage examples, see the individual script headers and the Getting Started guide.
