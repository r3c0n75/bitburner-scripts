# Remote API Development Setup Guide

This guide shows you how to set up professional development workflow using Bitburner's Remote API for instant script synchronization.

## 🎯 What is Remote API?

Remote API lets you edit scripts in your favorite code editor (VS Code) and have them **instantly sync** to Bitburner. No more manual copying, no more running `bitburner-update.js`!

### Your Current Workflow vs Remote API

**Current Workflow (Manual):**
```
Edit locally → Push to GitHub → Run wget in-game → Run bitburner-update.js → Test
⏱️ Time: 2-5 minutes per change
```

**With Remote API (Automated):**
```
Edit locally → Save → Test immediately
⏱️ Time: 2 seconds
```

## ⚡ Quick Benefits

- ✅ **Instant sync** - Changes appear in-game on save
- ✅ **VS Code features** - Full IntelliSense, autocomplete, debugging
- ✅ **TypeScript support** - Optional type safety and better error catching
- ✅ **Folder structure** - Keep your organized folders, no manual flattening
- ✅ **No manual deployment** - Zero `wget` commands needed
- ✅ **GitHub integration** - Continue using Git for version control

## 📋 Prerequisites

⚠️ **IMPORTANT**: These prerequisites are **ONLY needed for Remote API development workflow**. Your current GitHub-based workflow does NOT require Node.js!

### Why You Need Node.js for Remote API

The Remote API sync tools (TypeScript Template, Viteburner, etc.) are **Node.js applications** that:
1. Run a WebSocket server on your PC
2. Watch your script files for changes
3. Automatically sync changes to Bitburner
4. Compile TypeScript to JavaScript (if using TypeScript)

**Without Node.js:** You can't run these sync tools, but your current `Push-ToGitHub.ps1` + `bitburner-update.js` workflow works perfectly fine!

### Required Software (for Remote API only)

1. **Node.js** (includes npm)
   - Download: https://nodejs.org/
   - Version: 16.x or higher recommended
   - **What it does**: Runs the file sync tool
   - Verify installation:
     ```powershell
     node --version
     npm --version
     ```

2. **Git** (for cloning templates)
   - Download: https://git-scm.com/downloads
   - **What it does**: Downloads the Remote API tool code
   - Verify installation:
     ```powershell
     git --version
     ```

3. **VS Code** (recommended editor)
   - Download: https://code.visualstudio.com/
   - **What it does**: Provides IntelliSense and better development experience

**Note:** Commands like `npm`, `git`, and `cd` are cross-platform tools that work in PowerShell, CMD, bash, and other shells.

---

## 🚀 Installation

### Option 1: TypeScript Template (Recommended)

**Best for:** Most users, simple setup, official support

1. **Clone the TypeScript Template**
   ```powershell
   # In a new directory (NOT your existing scripts folder)
   git clone https://github.com/bitburner-official/typescript-template bitburner-dev
   cd bitburner-dev
   npm install
   ```

2. **Start the Remote API Tool**
   ```powershell
   npm run watch
   ```
   
   You should see:
   ```
   Remote file API listening on port 12525
   ```

3. **Connect Bitburner to Remote API**
   - Open Bitburner in your browser
   - Go to: **Options → Remote API**
   - Set **Hostname**: `localhost`
   - Set **Port**: `12525`
   - Click **Connect**
   
   You should see: ✅ "Connected to Remote API"

4. **Verify It Works**
   - Edit any file in `bitburner-dev/src/`
   - Save the file (Ctrl+S)
   - Check Bitburner - the file should appear instantly!

### Option 2: Viteburner (Advanced)

**Best for:** Advanced users wanting hot reload and modern dev tools

1. **Install Viteburner**
   ```powershell
   git clone https://github.com/Tanimodori/viteburner bitburner-dev
   cd bitburner-dev
   npm install
   ```

2. **Start Development Server**
   ```powershell
   npm run dev
   ```

3. **Connect in-game** (same as Option 1, port may differ)

### Option 3: BB External Editor (Feature-Rich)

**Best for:** Users wanting two-way sync and advanced features

```powershell
npm install -g @shyguy1412/bb-external-editor
bbee init
bbee start
```

## 📁 Project Structure

### TypeScript Template Structure
```
bitburner-dev/
├── src/
│   ├── main.ts          # Entry point
│   ├── lib/             # Your library code
│   └── types/           # Type definitions
├── dist/                # Compiled JavaScript (auto-generated)
└── package.json
```

### How to Organize Your Scripts

You have two approaches:

#### Approach A: Migrate to TypeScript Template (Recommended)
Move your existing scripts into the TypeScript template structure:

```
bitburner-dev/src/
├── main.ts
├── core/
│   ├── attack-hack.ts
│   ├── attack-grow.ts
│   └── attack-weaken.ts
├── batch/
│   ├── simple-batcher.ts
│   └── batch-manager.ts
├── analysis/
│   ├── profit-scan.ts
│   ├── profit-scan-flex.ts
│   └── production-monitor.ts
└── deploy/
    ├── auto-deploy-all.ts
    └── purchase-server-8gb.ts
```

**Benefits:**
- Full IntelliSense and autocomplete
- Type checking prevents errors
- Modern development experience
- Folder structure preserved

#### Approach B: Dual System (Hybrid)
Keep both systems running:

- **Remote API** for active development (fast iteration)
- **GitHub + bitburner-update.js** for distribution and backups

**When to use each:**
- Daily coding: Use Remote API (instant testing)
- Stable releases: Commit to GitHub (version control)
- Sharing scripts: Use GitHub URLs (easy distribution)

## 🔧 Configuration

### TypeScript to JavaScript

If you want to write plain JavaScript (not TypeScript), just rename files:
```powershell
# Change extension from .ts to .js
Rename-Item src/main.ts -NewName main.js
```

The tool will still sync, but without TypeScript features.

### Custom Port

If port 12525 is already in use:

**typescript-template:**
```json
// package.json - modify the "watch" script
"scripts": {
  "watch": "bitburner-filesync -p 9999"
}
```

Then connect to port `9999` in-game.

### File Filtering

Create `.syncignore` file to exclude files from syncing:
```
# .syncignore
node_modules/
*.test.ts
*.md
.git/
```

## 💻 Development Workflow

### Daily Development Flow

1. **Morning Setup**
   ```powershell
   cd bitburner-dev
   npm run watch
   ```
   
2. **In Bitburner**: Options → Remote API → Connect

3. **Code**
   - Edit files in VS Code
   - Save changes (Ctrl+S)
   - Test immediately in Bitburner
   - No manual deployment!

4. **Commit to Git** (when satisfied)
   ```powershell
   git add .
   git commit -m "Updated profit-scan-flex algorithm"
   git push origin main
   ```

### Migrating Existing Scripts

To move your current scripts to Remote API:

1. **Create TypeScript Template** (if not done)
   ```powershell
   git clone https://github.com/bitburner-official/typescript-template bitburner-dev
   cd bitburner-dev
   npm install
   ```

2. **Copy Your Scripts**
   ```powershell
   # From your scripts directory
   Copy-Item -Recurse analysis/* bitburner-dev/src/analysis/
   Copy-Item -Recurse batch/* bitburner-dev/src/batch/
   Copy-Item -Recurse core/* bitburner-dev/src/core/
   Copy-Item -Recurse deploy/* bitburner-dev/src/deploy/
   Copy-Item -Recurse utils/* bitburner-dev/src/utils/
   ```

3. **Rename to TypeScript** (optional)
   ```powershell
   cd bitburner-dev/src
   Get-ChildItem -Recurse -Filter *.js | Rename-Item -NewName { $_.Name -replace '\.js$','.ts' }
   ```

4. **Start Syncing**
   ```powershell
   npm run watch
   ```

## 🎮 Using Remote API with Bitburner

### Running Synced Scripts

Scripts appear in Bitburner with their folder structure flattened:

**Your file:** `src/analysis/profit-scan-flex.ts`  
**In-game name:** `analysis/profit-scan-flex.js`

Run it:
```bash
run analysis/profit-scan-flex.js
```

### TypeScript Template Default

By default, files sync to folders matching your `src/` structure. If you want flat structure (like your current setup):

**Option A:** Put all scripts in `src/` root
```
src/
├── profit-scan-flex.ts
├── simple-batcher.ts
├── attack-hack.ts
└── ...
```

**Option B:** Use a build script to flatten (advanced)

## 🚨 Troubleshooting

### Connection Issues

**Problem:** "Failed to connect to Remote API"

**Solutions:**
1. Verify the tool is running (`npm run watch`)
2. Check the port in console output
3. Make sure hostname is `localhost` (not `127.0.0.1`)
4. Try restarting the tool
5. Check firewall/antivirus isn't blocking port 12525

### Scripts Not Syncing

**Problem:** Save file but nothing appears in-game

**Solutions:**
1. Check Remote API status shows "Connected"
2. Look at tool console for error messages
3. Verify file is in `src/` directory
4. Try disconnecting and reconnecting in-game
5. Restart the sync tool

### Wake from Sleep

**Problem:** Connection lost after computer sleep

**Solution:** 
- In Bitburner: Options → Remote API → Connect (again)
- No need to restart the tool

### TypeScript Errors

**Problem:** Red squiggles in VS Code

**Solutions:**
1. Install VS Code TypeScript extension
2. Run `npm install` to get type definitions
3. Add `/// <reference path="NetscriptDefinitions.d.ts" />` at top of file
4. If using JS, rename to `.js` extension

### File Not Found in Game

**Problem:** Can't find script that shows as synced

**Solutions:**
1. Check file path in Bitburner terminal with `ls`
2. Verify sync tool shows successful sync
3. Check for typos in filename
4. Refresh Bitburner page if needed

## 📊 Comparison: Remote API vs GitHub Method

| Feature | Remote API | GitHub + wget |
|---------|------------|---------------|
| Setup Time | 5 minutes | 2 minutes |
| Change Sync | Instant (< 2s) | Manual (2-5 min) |
| IDE Support | Full IntelliSense | Basic |
| TypeScript | Native | None |
| Folder Structure | Preserved | Manual flatten |
| Version Control | Git (optional) | Git (required) |
| Internet Required | No | Yes |
| Best For | Active development | Distribution |

**Recommendation:** Use **both**!
- Remote API for daily coding
- GitHub for version control and sharing

## 🎯 Best Practices

### 1. Keep GitHub as Backup

Even with Remote API, push to GitHub regularly:
```powershell
# In bitburner-dev directory
git add .
git commit -m "Update message"
git push
```

### 2. Test Before Committing

With instant sync, test thoroughly before pushing to GitHub:
```bash
# In Bitburner
run your-script.js

# Verify it works, then commit
```

### 3. Use Version Control

Commit small, logical changes:
```powershell
git commit -m "Add caching to profit-scan-flex"
git commit -m "Fix memory leak in batch-manager"
```

### 4. Keep Tool Running

Leave `npm run watch` running while coding:
- Minimizes console window
- No need to restart between edits
- Only restart if errors occur

### 5. Comment Your Code

With TypeScript, add JSDoc comments for better IntelliSense:
```typescript
/**
 * Scans servers for profitability
 * @param {NS} ns - Netscript interface
 * @param {number} limit - Maximum servers to scan
 */
export async function profitScan(ns: NS, limit: number) {
  // Your code
}
```

## 🔄 Switching Between Methods

You can freely switch between Remote API and GitHub methods:

### From Remote API to GitHub
```powershell
# Push your current work
cd bitburner-dev
git add .
git commit -m "Latest changes"
git push

# Now usable via wget in-game
```

### From GitHub to Remote API
```powershell
# Pull latest changes
cd bitburner-dev
git pull

# Tool automatically syncs to game
```

## 🎓 Learning TypeScript (Optional)

If you want to try TypeScript:

### Basic Conversion

**JavaScript:**
```javascript
export async function main(ns) {
  ns.tprint("Hello World");
}
```

**TypeScript:**
```typescript
import { NS } from '@ns'

export async function main(ns: NS) {
  ns.tprint("Hello World");
}
```

### Resources
- [TypeScript in 5 Minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [Bitburner TypeScript Guide](https://bitburner.readthedocs.io/en/latest/guidesandtips/gettingstartedguideforbeginnerprogrammers.html)

**Note:** TypeScript is 100% optional! You can continue writing JavaScript.

## 📝 Next Steps

1. **Choose your tool** - Start with TypeScript Template if unsure
2. **Install and connect** - Follow installation steps above
3. **Migrate one script** - Start with a simple script like `profit-scan.js`
4. **Test the workflow** - Make a small change, save, verify it appears
5. **Migrate remaining scripts** - Once comfortable, move all scripts
6. **Keep GitHub active** - Continue using Git for version control

## 🔗 Additional Resources

- [Remote API Documentation](https://github.com/bitburner-official/bitburner-src/blob/dev/src/Documentation/doc/en/programming/remote_api.md)
- [TypeScript Template](https://github.com/bitburner-official/typescript-template)
- [Viteburner](https://github.com/Tanimodori/viteburner)
- [BB External Editor](https://github.com/shyguy1412/bb-external-editor)
- [Discord #external-editors Channel](https://discord.com/channels/415207508303544321/923428435618058311)

---

## ⚡ Quick Reference Card

```powershell
# Start Remote API
cd bitburner-dev
npm run watch

# In Bitburner: Options → Remote API → Connect
# Hostname: localhost
# Port: 12525

# Edit, save, test - that's it!
```

**Remember:** Remote API is for development speed. Keep your GitHub workflow for backups and sharing!

---

**Version:** 1.0.0  
**Last Updated:** 2025-10-26  
**Status:** Production Ready

