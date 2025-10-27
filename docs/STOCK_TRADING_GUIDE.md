# Stock Trading Guide - TIX API

Complete guide to automated stock trading in Bitburner using the TIX (Trade Information eXchange) API.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Script Overview](#script-overview)
- [Getting Started](#getting-started)
- [Trading Strategies](#trading-strategies)
- [Performance Tips](#performance-tips)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Purchases (From WSE - World Stock Exchange)

1. **WSE Account** (Free)
   - Visit World Stock Exchange in the City
   - Create account to view stock prices

2. **TIX API Access** ($5 billion)
   - Required for ALL automated trading scripts
   - Allows programmatic buying/selling
   - One-time purchase, permanent across resets

3. **4S Market Data TIX API** ($1 billion)
   - **HIGHLY RECOMMENDED** for profitable trading
   - Provides stock forecasts (bullish/bearish predictions)
   - Essential for basic and advanced traders
   - Without this, you're trading blind!

4. **Short Position Access** ($25 billion - Optional)
   - Allows betting against stocks (profit when price falls)
   - Only needed for advanced trading strategy
   - Significantly increases profit potential

### Cost Summary
- **Minimum (Forecast-Based)**: $6 billion (TIX API + 4S Data)
- **Minimum (Momentum-Based)**: $5 billion (TIX API only - no 4S Data needed!)
- **Advanced**: $31 billion (includes Short positions)

## Script Overview

### 1. stock-info.js - Information Display
**Purpose**: View stock market data and your portfolio

```bash
# View all stocks
run stocks/stock-info.js

# View specific stock details
run stocks/stock-info.js FSIG
```

**Features**:
- Display all stocks with prices and forecasts
- View detailed information about specific stocks
- See your current positions and profit/loss
- Portfolio summary with total returns

**Use Case**: Market research, portfolio checking, finding good trades

---

### 2. stock-trader-basic.js - Simple Automated Trading
**Purpose**: Basic buy-and-hold strategy with automatic selling

**Strategy**:
- Buy stocks when forecast > 55% (bullish)
- Hold positions while favorable
- Sell when forecast drops below 50%
- Only long positions (no shorting)

```bash
# Start with default settings ($1b per stock, 6s refresh)
run stocks/stock-trader-basic.js

# Custom investment per stock
run stocks/stock-trader-basic.js 2000000000

# Custom investment and refresh rate
run stocks/stock-trader-basic.js 2000000000 4000
```

**Parameters**:
- `investment-per-stock`: Max money to invest per stock (default: $1 billion)
- `refresh-rate-ms`: How often to check market (default: 6000ms)

**Best For**: 
- Beginners to stock trading
- Lower capital ($10-50 billion)
- Set-and-forget approach
- Learning market mechanics

---

### 3. stock-trader-advanced.js - Professional Trading
**Purpose**: Sophisticated strategy with long/short positions and risk management

**Strategy**:
- **Long positions**: Buy when forecast > 55%
- **Short positions**: Sell when forecast < 45%
- **Dynamic sizing**: Bigger positions for stronger forecasts
- **Stop-loss**: Automatically exit losing trades at -10%
- **Portfolio limits**: Max 10% per stock for diversification
- **Active management**: Constant rebalancing

```bash
# Start with default settings ($50b portfolio, 6s refresh)
run stocks/stock-trader-advanced.js

# Custom total investment budget
run stocks/stock-trader-advanced.js 100000000000

# Custom budget and refresh rate
run stocks/stock-trader-advanced.js 100000000000 4000
```

**Parameters**:
- `total-investment`: Total portfolio size (default: $50 billion)
- `refresh-rate-ms`: Market check frequency (default: 6000ms)

**Best For**:
- Experienced traders
- High capital ($50+ billion)
- Maximum profit potential
- Active risk management

**Requires**: Short position access ($25 billion upgrade)

---

### 4. stock-monitor.js - Portfolio Dashboard
**Purpose**: Real-time monitoring of active positions with 4S intelligence (NO trading)

```bash
# Start monitoring with default 3s refresh
run stocks/stock-monitor.js

# Custom refresh rate
run stocks/stock-monitor.js 2000
```

**Features**:
- Live portfolio value updates
- Position-by-position breakdown
- Profit/loss tracking
- Performance metrics (peak value, drawdown, session returns)
- **NEW: Real-time forecast display with alignment indicators**
- **NEW: Volatility analysis (HIGH/MED/LOW risk levels)**
- **NEW: Single-line compact format - twice as many positions visible**

**4S Data Integration** (when available):
```
Symbol Type    Shares    Entry    Current        P/L   Return   Forecast   Volatility
──────────────────────────────────────────────────────────────────────────────────────────
NVMD   LONG     82.9k   $24.1k     $27.7k    $293.3m   +14.7%     ↑56% ✓   0.8% (LOW)
FLCM   LONG     365.0    $8.0k     $14.4k      $2.3m   +80.4%     ↑68% ✓   1.3% (LOW)
OMGA   LONG      1.6k    $2.0k      $2.0k    -$85.2k    -2.6%     ↓45% ⚠   1.0% (LOW)
```

**Intelligence Features**:
- **✓ Indicator**: Position aligned with forecast (good!)
- **⚠ Indicator**: Position contradicts forecast (warning - consider exiting!)
- **Volatility Levels**: LOW (<2%), MED (2-5%), HIGH (>5%)
- **Forecast Direction**: ↑ (bullish), ↓ (bearish), → (neutral)

**Best For**:
- Monitoring automated traders
- Tracking performance
- Making manual decisions
- Learning market patterns

---

### 5. stock-trader-momentum.js - Momentum Trading (NO 4S Data!) 🆕
**Purpose**: Automated momentum trading WITHOUT needing 4S Market Data

**Strategy (MOMENTUM with RISK MANAGEMENT)**:
- Track price changes over last 5 cycles (30 seconds)
- Buy when 4+ POSITIVE price movements (riding the rally)
- Sell ONLY when profit target reached OR stop loss triggered
- Follows upward trends - holds positions until exit conditions met
- Skip stocks with >3% price swings (too volatile)

```bash
# Conservative: 5 stocks, $1b capital, 5% profit target, 5% stop loss
run stocks/stock-trader-momentum.js 5 1000000000 0.05 0.05 6000

# Moderate: 10 stocks, $2b capital, 10% profit target, 5% stop loss
run stocks/stock-trader-momentum.js 10 2000000000 0.10 0.05 6000

# Aggressive: 3 stocks, $500m capital, 3% profit target, no stop loss
run stocks/stock-trader-momentum.js 3 500000000 0.03 1.0 6000
```

**Parameters**:
- `max-stocks`: Maximum number of different stocks to buy (e.g., 5, 10)
- `total-capital`: Total money to invest across ALL stocks (e.g., 1000000000 = $1b)
- `profit-target`: Profit % to auto-sell at (e.g., 0.03 = 3%, 0.05 = 5%, 0.10 = 10%)
- `stop-loss`: Loss % to auto-sell at (e.g., 0.05 = 5%, 0.10 = 10%, 1.0 = no stop loss)
- `refresh-rate-ms`: How often to check market (default: 6000 = 6 seconds)

**Best For**: 
- Players without 4S Market Data ($25 billion savings!)
- Early-game trading (only need TIX API $5 billion)
- Momentum trading philosophy
- "Ride the trend" strategies
- Trend-following with defined exits

**Requirements**:
- TIX API Access ($5 billion)
- Does NOT require 4S Market Data!

---

### 6. stock-momentum-analyzer.js - Preview Momentum with Forecast Intelligence 🆕✨
**Purpose**: Analyze momentum patterns WITHOUT making trades + VALIDATE with 4S forecasts

```bash
# Analyze momentum over 5 cycles (30 seconds) - default
run stocks/stock-momentum-analyzer.js

# Longer analysis period (10 cycles = 60 seconds)
run stocks/stock-momentum-analyzer.js 10
```

**Features**:
- Collects price data over multiple cycles
- Identifies strong buy signals (4+ positive movements)
- Identifies buy signals (3+ positive movements)
- Shows momentum and price change for each stock
- Calculates price volatility
- **NEW: Forecast alignment analysis** (requires 4S Data)
- **NEW: Confidence scoring** (HIGH/MEDIUM/LOW)
- **NEW: Trap detection** (momentum contradicts forecast)
- **NEW: Smart sorting** (prioritizes high-confidence trades)

**Enhanced Display (with 4S Data)**:
```
OMTK @ $68.61k | Momentum: 3↑ 1↓ | Change: +0.21%
       📊 Forecast: 65% ↑ | Alignment: ✅ CONFIRMS | Confidence: 🟡 MEDIUM

OMGA @ $2.11k  | Momentum: 4↑ 0↓ | Change: +0.64%
       📊 Forecast: 44% ↓ | Alignment: ⚠️ CONTRADICTS | Confidence: 🔴 LOW
```

**Confidence Levels**:
- **🟢 HIGH**: Strong momentum (4+) + Strong forecast (65%+) = Both agree strongly
- **🟡 MEDIUM**: Good momentum (3+) + Good forecast (58%+) = Both agree
- **🔴 LOW**: Momentum contradicts forecast = **TRAP WARNING!**

**Requirements**:
- TIX API Access ($5 billion) - REQUIRED
- 4S Market Data ($25 billion) - OPTIONAL but highly recommended for forecast validation

**Best For**:
- **Validating momentum signals** - See which trends are real vs temporary
- **Preventing trap trades** - Avoid buying stocks about to reverse
- **Testing strategy** - Preview before risking capital
- **Learning patterns** - See how momentum relates to forecasts
- **Finding optimal entry** - Wait for HIGH confidence opportunities

---

## Getting Started

### Quick Start - Basic Trading

1. **Purchase Prerequisites** ($6 billion minimum)
   ```
   - TIX API Access: $5 billion
   - 4S Market Data: $1 billion
   ```

2. **Check Market Conditions**
   ```bash
   run stocks/stock-info.js
   ```
   Look for stocks with >55% forecast

3. **Start Basic Trader**
   ```bash
   run stocks/stock-trader-basic.js 1000000000 6000
   ```

4. **Monitor Performance**
   ```bash
   run stocks/stock-monitor.js
   ```
   (in a separate terminal window)

### Recommended Progression

**Stage 1: Learning ($6-10 billion capital)**
- Use `stock-trader-basic.js` with $500m-1b per stock
- Run `stock-monitor.js` to learn patterns
- Build capital slowly and safely

**Stage 2: Growth ($10-50 billion capital)**
- Increase investment per stock to $2-5 billion
- Consider multiple trader instances on different targets
- Focus on high-confidence trades (>60% forecast)

**Stage 3: Professional ($50+ billion capital)**
- Purchase Short Position access ($25 billion)
- Switch to `stock-trader-advanced.js`
- Maximize returns with full strategy arsenal

## Trading Strategies

### Basic Strategy (Recommended for Beginners)
```javascript
// Buy Rules:
- Forecast > 55% (bullish)
- Have available cash
- Not already holding position

// Sell Rules:
- Forecast drops < 50%
- Take profits and exit

// Position Sizing:
- Fixed amount per stock
- Simple and predictable
```

### Advanced Strategy (Maximum Profits)
```javascript
// Long Positions:
- Enter: Forecast > 55%
- Exit: Forecast < 52% OR loss > 10%
- Size: Scales with forecast confidence

// Short Positions:
- Enter: Forecast < 45%
- Exit: Forecast > 48% OR loss > 10%
- Size: Scales with forecast confidence

// Risk Management:
- Max 10% portfolio per stock
- Stop-loss at -10%
- Dynamic rebalancing
```

### Market Mechanics

**Forecast Interpretation**:
- **>55%**: Bullish - price likely to rise (BUY)
- **45-55%**: Neutral - uncertain direction (HOLD/AVOID)
- **<45%**: Bearish - price likely to fall (SHORT or AVOID)

**Best Forecast Ranges**:
- **>60%**: Strong buy signal
- **<40%**: Strong short signal
- **50%**: Completely random - avoid!

**Market Updates**:
- Stock prices update every ~6 seconds
- Forecasts change based on many factors
- Volatility affects price swings

## Performance Tips

### Maximize Profits

1. **Capital Allocation**
   - Don't put all money in one stock
   - Diversify across 5-10 positions
   - Keep some cash for opportunities

2. **Timing**
   - Market updates every 6 seconds
   - Set refresh rate to 6000ms (6 seconds)
   - Faster checks waste CPU with no benefit

3. **Forecast Quality**
   - Focus on >60% or <40% forecasts
   - Avoid 50% (neutral) stocks
   - Higher volatility = bigger swings

4. **Commission Management**
   - Each trade costs $100k commission
   - Avoid frequent small trades
   - Bigger positions reduce commission impact

### Optimization Checklist

✓ **Have 4S Market Data** - Can't trade profitably without forecasts  
✓ **Use 6-second refresh** - Matches market update frequency  
✓ **Diversify positions** - Don't bet everything on one stock  
✓ **Monitor regularly** - Check for stuck positions or problems  
✓ **Scale with capital** - Bigger budget = bigger positions  
✓ **Consider shorts** - Double your opportunities with bearish trades  

### Common Mistakes to Avoid

❌ Trading without 4S Data (blind trading)  
❌ Refreshing faster than 6 seconds (waste)  
❌ All-in on one stock (high risk)  
❌ Ignoring stop-losses (unlimited losses)  
❌ Too many small positions (commission eats profits)  
❌ Panic selling winners (let trends run)  

## Script Performance Comparison

| Feature | Basic | Advanced | Momentum | Analyzer | Monitor |
|---------|-------|----------|----------|----------|---------|
| Long Positions | ✓ | ✓ | ✓ | N/A | N/A |
| Short Positions | ✗ | ✓ | ✗ | N/A | N/A |
| Stop-Loss | ✗ | ✓ | ✓ | N/A | N/A |
| Profit Targets | ✗ | ✗ | ✓ | N/A | N/A |
| Dynamic Sizing | ✗ | ✓ | ✗ | N/A | N/A |
| Makes Trades | ✓ | ✓ | ✓ | ✗ | ✗ |
| Portfolio View | ✓ | ✓ | ✓ | ✗ | ✓ |
| Forecast Integration | ✓ | ✓ | ✗ | ✓ (optional) | ✓ |
| Trap Detection | ✗ | ✗ | ✗ | ✓ | ✗ |
| Confidence Scoring | ✗ | ✗ | ✗ | ✓ | ✗ |
| Requires 4S Data | ✓ | ✓ | ✗ | - | - |
| Difficulty | Easy | Advanced | Easy | Easy | Easy |
| Min Capital | $10b | $50b | $5b | $5b | Any |
| Expected Return | 20-50% | 50-150% | 10-40% | N/A | N/A |

## Troubleshooting

### "ERROR: You need TIX API Access"
**Solution**: Purchase TIX API from WSE for $5 billion

### "ERROR: You need 4S Market Data TIX API"
**Solution**: Purchase 4S Data from WSE for $1 billion  
**Note**: Essential for profitable trading - don't skip this!

### "Short positions disabled"
**Solution**: Purchase Short access for $25 billion (only needed for advanced trader)

### Scripts not buying anything
**Possible Causes**:
1. No stocks with >55% forecast (bad market)
2. Insufficient funds (need money for trades + $100k commission)
3. Already at max shares for all good stocks
4. Market in neutral phase (all forecasts ~50%)

**Solution**: 
- Check `stock-info.js` for market conditions
- Ensure you have available cash
- Wait for better market conditions

### Losing money consistently
**Possible Causes**:
1. Trading without 4S Data (random trades)
2. Thresholds too aggressive (buying/selling too early)
3. Market in volatile neutral phase
4. Commissions eating small profits

**Solution**:
- **GET 4S DATA** - This is critical!
- Increase position sizes to offset commissions
- Use stricter thresholds (>60% buy, <40% short)
- Stop and wait for clearer market signals

### Script lag or timeouts
**Cause**: Running too many scripts or refresh too fast

**Solution**:
- Run only one trader at a time
- Use 6-second refresh (default)
- Kill unnecessary scripts with `global-kill.js`

## Integration with Other Scripts

### Running with Batch Systems

Stock trading runs independently and works great alongside:
- `smart-batcher.js` - Hacking income
- `batch-manager.js` - Server management
- `auto-expand.js` - Network growth

They don't conflict and diversify your income streams!

### Performance Impact

- **RAM**: ~4-5GB for trader scripts
- **CPU**: Minimal (updates every 6 seconds)
- **Conflict**: None with hacking scripts

## Expected Returns

### Conservative Estimates (Basic Trader)

| Capital | Daily Profit | Notes |
|---------|--------------|-------|
| $10b | $2-5b | 20-50% daily |
| $50b | $10-25b | Slower % but bigger $ |
| $100b | $20-50b | Market cap limits kick in |

### Aggressive Estimates (Advanced Trader)

| Capital | Daily Profit | Notes |
|---------|--------------|-------|
| $50b | $25-75b | 50-150% with shorts |
| $100b | $50-150b | Max diversification |
| $200b | $80-300b | Market domination |

**Reality Check**: 
- Results vary by market conditions
- Bad markets may break even or lose
- Commission impact decreases with scale
- Requires 4S Data for these returns!

## Next Steps

1. **Start Small**: Use basic trader with $1-2 billion per stock
2. **Learn Patterns**: Run monitor alongside to understand forecasts
3. **Scale Up**: Increase investment as you gain confidence
4. **Go Advanced**: Add shorts when you have $50+ billion capital
5. **Automate**: Let it run while you focus on other gameplay

## Quick Reference Commands

```bash
# View market overview
run stocks/stock-info.js

# Check specific stock
run stocks/stock-info.js FSIG

# Basic trading ($1b per stock, requires 4S Data)
run stocks/stock-trader-basic.js 1000000000

# Advanced trading ($50b portfolio, requires 4S + Shorts)
run stocks/stock-trader-advanced.js 50000000000

# Momentum trading (NO 4S Data needed! 5 stocks, $1b, 10% profit, 5% stop loss)
run stocks/stock-trader-momentum.js 5 1000000000 0.10 0.05 6000

# Preview momentum with forecast intelligence (5 cycles = 30 seconds, auto-detects 4S Data)
run stocks/stock-momentum-analyzer.js 5

# Monitor performance
run stocks/stock-monitor.js 3000
```

---

**Happy Trading!** 📈💰

Remember: The stock market can be volatile. Use profit targets, diversify positions, and never invest more than you can afford to lose!

