# GitHub Deployment Guide for Bitburner

Complete guide to deploying your Bitburner scripts via GitHub and the Remote File API.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [GitHub Setup](#github-setup)
3. [Preparing Your Scripts](#preparing-your-scripts)
4. [Bitburner Setup](#bitburner-setup)
5. [Auto-Update Usage](#auto-update-usage)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### What You Need
- ✅ GitHub account (free)
- ✅ Bitburner game running
- ✅ This script collection on your local machine
- ✅ Basic familiarity with GitHub (or follow along!)

### What's Included
- ✅ Private repos are **FREE** on GitHub (unlimited!)
- ✅ No subscription needed for basic setup
- ✅ Version control for your scripts
- ✅ Easy updates from anywhere

---

## GitHub Setup

### Step 1: Create a GitHub Repository

1. **Go to GitHub.com** and sign in
2. **Click the "+" icon** in top right → "New repository"
3. **Configure your repo:**
   ```
   Repository name: bitburner-scripts
   Description: My Bitburner automation scripts
   Visibility: ✓ Private (recommended)
   Initialize: □ Don't check any boxes yet
   ```
4. **Click "Create repository"**

### Step 2: Push Your Organized Structure to GitHub

**Good news!** You DON'T need to flatten your folder structure. The PowerShell script will push your organized folders directly to GitHub, and `bitburner-update.js` will handle the flattening automatically when downloading to Bitburner.

#### Option A: PowerShell Push (Recommended) 🌟

Use the included PowerShell script to push your organized structure:

```powershell
.\Push-ToGitHub.ps1 -RepoUrl "https://github.com/YOUR_USERNAME/bitburner-scripts.git" -FirstTime
```

**What it does:**
- ✅ Pushes your organized folder structure (core/, batch/, analysis/, etc.)
- ✅ Creates .gitignore automatically
- ✅ Initializes Git repository
- ✅ Commits and pushes to GitHub
- ✅ Shows your GitHub raw URL for configuration

**Your GitHub repo will look like:**
```
bitburner-scripts/
├── core/
│   ├── attack-hack.js
│   ├── attack-grow.js
│   └── attack-weaken.js
├── batch/
│   ├── simple-batcher.js
│   └── batch-manager.js
├── analysis/
│   ├── profit-scan.js
│   └── production-monitor.js
├── utils/
│   └── ...
├── deploy/
│   └── ...
├── bitburner-update.js
└── README.md
```

**In Bitburner (auto-flattened):**
```
home/
├── attack-hack.js
├── attack-grow.js
├── simple-batcher.js
└── ... (all scripts flat)
```

The `bitburner-update.js` script reads from the organized folders but saves flat to Bitburner home!

**See:** [PowerShell GitHub Workflow Guide](../POWERSHELL_GITHUB_WORKFLOW.md) for complete instructions.

#### Option B: Manual Git Commands

If you prefer manual control:

```bash
cd path/to/your/bitburner-scripts
git init
git add .
git commit -m "Initial commit - organized structure"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bitburner-scripts.git
git push -u origin main
```

**Note:** The manual method pushes your entire organized structure, including folders.

### Step 3: Get Your Raw GitHub URL

The PowerShell script will show you this automatically, or you can get it manually:

1. **Open any .js file** in your GitHub repo (e.g., `core/attack-hack.js`)
2. **Click the "Raw" button** (top right of file viewer)
3. **Copy the URL** - it will look like:
   ```
   https://raw.githubusercontent.com/YOUR_USERNAME/bitburner-scripts/main/core/attack-hack.js
   ```
4. **Your base URL** is everything BEFORE `/core/`:
   ```
   https://raw.githubusercontent.com/YOUR_USERNAME/bitburner-scripts/main
   ```

**Important Notes:**
- ✅ Works with **private** repos (GitHub authenticates automatically)
- ✅ Use the **raw.githubusercontent.com** URL (not regular github.com)
- ✅ Include the branch name (usually `main`)
- ✅ NO trailing slash at the end
- ✅ Your scripts are in folders (core/, batch/, etc.) - the update script handles this!

---

## Preparing Your Scripts

### Configure the Update Script

The `bitburner-update.js` file is already created in your project and configured to work with organized folders:

1. **Open** `bitburner-update.js`
2. **Find line 15** that says:
   ```javascript
   const baseUrl = "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main";
   ```
3. **Replace with your actual URL**:
   ```javascript
   const baseUrl = "https://raw.githubusercontent.com/yourusername/bitburner-scripts/main";
   ```
4. **Save the file**
5. **Push to GitHub**:
   ```powershell
   .\Push-ToGitHub.ps1 -RepoUrl "YOUR_URL" -CommitMessage "Configure update script"
   ```

**Note:** The update script is already configured to read from organized folders (core/, batch/, analysis/, utils/, deploy/) and save flat to Bitburner home. No additional configuration needed!

---

## Bitburner Setup

### Step 1: Initial Manual Setup

Since this is your first time, you need to manually copy `bitburner-update.js` into Bitburner:

1. **In Bitburner**, open the terminal
2. **Type**: `nano bitburner-update.js`
3. **Copy and paste** the entire contents of `bitburner-update.js`
4. **Save**: Ctrl+S (or Cmd+S on Mac)
5. **Exit**: Ctrl+C

**Alternative Method - Using wget directly:**
```bash
wget https://raw.githubusercontent.com/YOUR_USERNAME/bitburner-scripts/main/bitburner-update.js bitburner-update.js
```

### Step 2: First Update

Now run the update script to download all other scripts:

```bash
run bitburner-update.js --all
```

You should see:
```
=== Bitburner Script Update ===
Base URL: https://raw.githubusercontent.com/...
Organized folder structure maintained on GitHub
Files to download: 18

✓ attack-hack.js
✓ attack-grow.js
✓ attack-weaken.js
✓ simple-batcher.js
...

=== Update Complete ===
Successful: 18
Failed: 0
Total: 18
```

**Note:** Scripts are downloaded from organized folders (e.g., `core/attack-hack.js`) but saved flat to your Bitburner home directory!

### Step 3: Verify Installation

Check that scripts are installed:
```bash
ls
```

You should see all your scripts listed!

---

## Auto-Update Usage

### Basic Commands

```bash
# Update essential scripts only (default)
run bitburner-update.js

# Update ALL scripts
run bitburner-update.js --all

# Update specific categories
run bitburner-update.js --essential
run bitburner-update.js --utils
run bitburner-update.js --batch
run bitburner-update.js --deploy

# Update multiple categories
run bitburner-update.js --essential --utils
```

### Script Categories

**Essential** (downloaded by default):
- attack-hack.js, attack-grow.js, attack-weaken.js
- simple-batcher.js
- profit-scan.js
- production-monitor.js

**Batch**:
- batch-manager.js

**Utils**:
- global-kill.js, list-procs.js, list-pservs.js
- server-info.js, estimate-production.js

**Deploy**:
- auto-deploy-all.js, purchase-server-8gb.js
- replace-pservs-no-copy.js, home-batcher.js
- deploy-hack-joesguns.js, hack-joesguns.js, hack-n00dles.js

### Typical Workflow

1. **Edit scripts** on your local machine (in organized folders)
2. **Push to GitHub**:
   ```powershell
   .\Push-ToGitHub.ps1 -RepoUrl "YOUR_URL" -CommitMessage "Your changes"
   ```
3. **In Bitburner**: `run bitburner-update.js --all`
4. **Done!** Latest scripts are downloaded (flat to home directory)

**See:** [PowerShell GitHub Workflow](../POWERSHELL_GITHUB_WORKFLOW.md) for detailed workflow guide

---

## Troubleshooting

### Error: "Download failed"

**Possible Causes:**
1. **Incorrect URL** - Check your baseUrl in bitburner-update.js
2. **Wrong branch** - Make sure you're using `main` (not `master`)
3. **Incorrect folder structure** - Files should be in organized folders (core/, batch/, etc.)
4. **Typo in filename** - Filenames are case-sensitive

**Solution:**
```bash
# Test URL manually in browser (note the folder path)
https://raw.githubusercontent.com/YOUR_USERNAME/bitburner-scripts/main/core/attack-hack.js

# If it shows the file contents → URL is correct
# If it shows 404 → Check the URL components and folder structure
```

### Error: "Repository not found"

**For Private Repos:**
- ✅ Private repos work with raw.githubusercontent.com
- ✅ GitHub handles authentication automatically
- ❌ If you see this error, check spelling of username/repo

**Solution:**
1. Verify repo name on GitHub
2. Check username spelling
3. Ensure repo is created and has files

### Error: "Cannot read property"

**Cause:** Script syntax error or incomplete download

**Solution:**
```bash
# Re-download the specific file
run bitburner-update.js --all

# Check the script in Bitburner
nano problem-script.js
```

### Scripts Not Running After Update

**Cause:** Old scripts may be running from before update

**Solution:**
```bash
# Kill all running scripts
run global-kill.js

# Re-run your desired script
run simple-batcher.js joesguns
```

### Update Script Won't Download

**Cause:** Typo in manual wget command

**Solution:**
1. **Delete the broken file**: `rm bitburner-update.js`
2. **Try again** with correct URL
3. **Or manually paste** the script using `nano`

---

## Advanced Tips

### Auto-Update on Game Start

Create a startup script that updates automatically:

```javascript
/** startup.js */
export async function main(ns) {
  // Update scripts
  await ns.run("bitburner-update.js", 1, "--essential");
  await ns.sleep(5000); // Wait for updates
  
  // Start your automation
  await ns.run("profit-scan.js");
  await ns.run("simple-batcher.js", 1, "joesguns", "--quiet");
}
```

Then in Bitburner settings, set this as your startup script.

### Version Control Best Practices

1. **Create a .gitignore** in your GitHub repo:
   ```
   # Don't commit these
   *.log
   *.bak
   .DS_Store
   ```

2. **Use meaningful commit messages**:
   ```bash
   git commit -m "Fixed RAM calculation in simple-batcher.js"
   git commit -m "Added new server-info.js utility"
   ```

3. **Create branches for major changes**:
   ```bash
   git checkout -b experimental-feature
   # Make changes
   git commit -m "Testing new batch algorithm"
   # Test in Bitburner
   # If good, merge back to main
   ```

### Multiple Environments

You can maintain different script versions:

**Production** (main branch):
```javascript
const baseUrl = "https://raw.githubusercontent.com/user/repo/main";
```

**Development** (dev branch):
```javascript
const baseUrl = "https://raw.githubusercontent.com/user/repo/dev";
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────┐
│ GITHUB DEPLOYMENT QUICK REFERENCE                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Setup:                                              │
│  1. Create GitHub repo (private or public)          │
│  2. Run: .\Push-ToGitHub.ps1 -FirstTime             │
│  3. Configure bitburner-update.js with URL          │
│  4. Push updated script to GitHub                   │
│                                                     │
│ First Time:                                         │
│  wget YOUR_RAW_URL/bitburner-update.js ...          │
│  run bitburner-update.js --all                      │
│                                                     │
│ Regular Updates:                                    │
│  1. Edit scripts locally (in organized folders)     │
│  2. Run: .\Push-ToGitHub.ps1 -CommitMessage "..."   │
│  3. In game: run bitburner-update.js --all          │
│                                                     │
│ Categories:                                         │
│  --all        All scripts                           │
│  --essential  Core scripts (default)                │
│  --utils      Utility scripts                       │
│  --batch      Batch management                      │
│  --deploy     Deployment scripts                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Summary Checklist

### GitHub Setup ✓
- [ ] Created GitHub account
- [ ] Created repository (private or public)
- [ ] Ran Push-ToGitHub.ps1 with -FirstTime flag
- [ ] Got raw GitHub URL (shown by script or from GitHub)
- [ ] Updated baseUrl in bitburner-update.js
- [ ] Pushed updated bitburner-update.js to GitHub

### Bitburner Setup ✓
- [ ] Copied bitburner-update.js to game
- [ ] Updated the baseUrl in the script
- [ ] Ran first update: `run bitburner-update.js --all`
- [ ] Verified all scripts downloaded
- [ ] Tested a script (e.g., profit-scan.js)

### Workflow ✓
- [ ] Know how to edit scripts locally (in organized folders)
- [ ] Know how to push to GitHub (.\Push-ToGitHub.ps1)
- [ ] Know how to update in game (run bitburner-update.js --all)
- [ ] Tested the update process
- [ ] Understand that folders are preserved on GitHub, flattened in Bitburner

---

**Congratulations!** 🎉 Your Bitburner scripts are now version-controlled and auto-updatable via GitHub!

**Next Steps:**
1. Try editing a script locally
2. Push to GitHub
3. Update in Bitburner
4. See your changes live!

For questions, see the [Troubleshooting](#troubleshooting) section above.
