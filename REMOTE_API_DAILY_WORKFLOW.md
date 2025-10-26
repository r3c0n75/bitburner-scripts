# Remote API Daily Workflow Guide

**Dual Workflow Strategy:** Use Remote API for fast development + GitHub for version control

## 🌅 Morning Setup (2 minutes)

### Step 1: Start Remote API Server

```powershell
# Navigate to Remote API workspace
cd C:\Users\YourUsername\bitburner\bitburner-remote-api

# Start the server (leave this running all day)
npm run watch
```

**Expected output:**
```
[watch:remote] Server is ready, running on 12525!
```

**💡 Tip:** Minimize this PowerShell window - don't close it!

### Step 2: Connect Bitburner

**In Bitburner:**
1. Options (⚙️) → Remote API
2. Verify settings:
   - Hostname: `localhost`
   - Port: `12525`
3. Click **Connect**

**Expected:** ✅ "Connected to Remote API"

### Step 3: You're Ready!

Start coding with instant sync! ⚡

---

## 💻 Development Workflow (All Day)

### Edit → Save → Test Loop

**The new normal:**

1. **Edit** your script in VS Code
2. **Save** (Ctrl+S) - Auto-syncs in < 2 seconds!
3. **Test** in Bitburner immediately
4. **Repeat** - No manual deployment steps!

**Example:**
```
VS Code: Edit profit-scan-flex.js
VS Code: Ctrl+S (save)
PowerShell: [watch:remote] profit-scan-flex.js changed ✅
Bitburner: run profit-scan-flex.js
Bitburner: See results instantly!
```

**Time per iteration:** ~10-15 seconds  
**vs GitHub method:** ~60-120 seconds  
**Savings:** 50-110 seconds per change! 🚀

---

## 📁 File Organization

### Two Workspaces

You now have **two separate folders:**

#### Workspace 1: GitHub Repository (Stable/Distribution)
```
C:\Users\YourUsername\bitburner\scripts\
├── analysis/
├── batch/
├── core/
├── deploy/
├── utils/
└── ...
```

**Purpose:**
- Version control
- Backups
- Sharing via bitburner-update.js
- Stable releases

#### Workspace 2: Remote API (Active Development)
```
C:\Users\YourUsername\bitburner\bitburner-remote-api\src\
├── analysis/
├── batch/
├── core/
├── deploy/
├── utils/
└── ...
```

**Purpose:**
- Daily coding
- Quick iterations
- Testing
- Active development

### How They Work Together

```
┌─────────────────────────────────────────────────────────────┐
│ ACTIVE DEVELOPMENT                                          │
│                                                             │
│  Remote API Workspace                                       │
│  ├── Edit scripts in VS Code                               │
│  ├── Auto-sync to Bitburner (< 2 sec)                     │
│  ├── Test immediately                                       │
│  └── Iterate quickly                                        │
│                                                             │
│  When satisfied with changes...                            │
│                    ↓                                        │
└─────────────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ VERSION CONTROL & BACKUP                                    │
│                                                             │
│  Copy stable changes to GitHub repo                         │
│  ├── Copy files to scripts/ folder                         │
│  ├── Run Push-ToGitHub.ps1                                 │
│  ├── Commit to Git                                          │
│  └── Scripts now backed up & shareable                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Syncing Between Workspaces

### Scenario 1: Start New Feature

**Developing a new script:**

1. Create in Remote API workspace:
   ```
   src/analysis/new-scanner.js
   ```

2. Develop with instant sync all day

3. When stable, copy to GitHub repo:
   ```powershell
   Copy-Item bitburner-remote-api\src\analysis\new-scanner.js `
             scripts\analysis\new-scanner.js
   ```

4. Commit to GitHub:
   ```powershell
   cd scripts
   .\Push-ToGitHub.ps1
   ```

### Scenario 2: Modify Existing Script

**Improving profit-scan-flex.js:**

1. Make sure latest version is in Remote API workspace

2. Edit in VS Code with instant sync

3. Test multiple iterations quickly

4. When happy with changes, copy back to GitHub repo:
   ```powershell
   Copy-Item bitburner-remote-api\src\analysis\profit-scan-flex.js `
             scripts\analysis\profit-scan-flex.js
   ```

5. Commit to GitHub

### Scenario 3: Bulk Sync at End of Day

**After a productive day:**

```powershell
# Copy all changed files from Remote API to GitHub repo
# (You can be selective or copy everything)

# Option A: Copy specific folders
Copy-Item -Recurse -Force bitburner-remote-api\src\analysis\* scripts\analysis\
Copy-Item -Recurse -Force bitburner-remote-api\src\batch\* scripts\batch\

# Option B: Copy everything
Copy-Item -Recurse -Force bitburner-remote-api\src\* scripts\

# Then commit to GitHub
cd scripts
.\Push-ToGitHub.ps1
```

---

## 🌙 Evening Wrap-Up (5 minutes)

### End of Coding Session

**Option A: Quick Wrap (30 seconds)**
```powershell
# Just stop the server (Ctrl+C in npm run watch window)
# Your work is saved locally, continue tomorrow
```

**Option B: Backup to GitHub (5 minutes)**
```powershell
# 1. Copy stable changes to GitHub repo
Copy-Item -Recurse -Force bitburner-remote-api\src\analysis\* scripts\analysis\

# 2. Commit to GitHub
cd scripts
.\Push-ToGitHub.ps1

# 3. Stop the Remote API server (Ctrl+C)
```

**💡 Recommendation:** Backup to GitHub at least once per day or after major changes.

---

## 🚨 Connection Management

### After Computer Sleep/Restart

**Problem:** Connection lost after sleep/restart  
**Solution:** Just reconnect (no need to restart server)

```
In Bitburner:
1. Options → Remote API
2. Click "Connect"
✅ Done!
```

The `npm run watch` server stays running through sleep cycles.

### If Server Stops

**Problem:** Closed PowerShell window accidentally  
**Solution:** Restart the server

```powershell
cd C:\Users\YourUsername\bitburner\bitburner-remote-api
npm run watch
```

Then reconnect in Bitburner (Options → Remote API → Connect)

---

## 📊 Workflow Comparison

### Old GitHub-Only Workflow

**Every single change:**
```
1. Edit in VS Code          (30 sec)
2. Save                     (1 sec)
3. Run Push-ToGitHub.ps1   (10 sec)
4. In-game: wget command    (5 sec)
5. run bitburner-update.js  (30 sec)
6. Test script              (5 sec)
─────────────────────────────────────
Total: 81 seconds per change
```

**For 20 changes:** 27 minutes

### New Dual Workflow

**During development (20 changes):**
```
1. Edit in VS Code          (30 sec)
2. Save (auto-sync!)        (2 sec)
3. Test script              (5 sec)
─────────────────────────────────────
Total: 37 seconds per change
```

**For 20 changes:** 12.3 minutes

**End of day (1 time):**
```
Copy to GitHub repo         (2 min)
Push to GitHub              (1 min)
─────────────────────────────────────
Total: 3 minutes
```

**Grand Total:** 15.3 minutes (vs 27 minutes)  
**Time Saved:** 11.7 minutes per session! 🎉

---

## 🎯 Quick Reference Commands

### Daily Commands

**Start Development:**
```powershell
cd C:\Users\YourUsername\bitburner\bitburner-remote-api
npm run watch
# In Bitburner: Options → Remote API → Connect
```

**Copy Changes to GitHub:**
```powershell
Copy-Item -Recurse -Force bitburner-remote-api\src\analysis\* scripts\analysis\
cd scripts
.\Push-ToGitHub.ps1
```

**Reconnect After Sleep:**
```
In Bitburner: Options → Remote API → Connect
```

---

## 💡 Pro Tips

### 1. Keep Both Editors Open

- **Left monitor:** VS Code (Remote API workspace)
- **Right monitor:** Bitburner (for instant testing)
- **Bottom:** PowerShell with `npm run watch` (minimized)

### 2. Use Git in Remote API Workspace Too

Initialize Git in your Remote API workspace for local version control:

```powershell
cd C:\Users\YourUsername\bitburner\bitburner-remote-api
git init
git add .
git commit -m "Initial Remote API workspace"
```

Then you have version control in BOTH places!

### 3. Create Sync Scripts

Create a helper script to sync between workspaces:

**sync-to-github.ps1:**
```powershell
# Copy Remote API changes to GitHub repo
$remoteAPI = "C:\Users\YourUsername\bitburner\bitburner-remote-api\src"
$github = "C:\Users\YourUsername\bitburner\scripts"

Copy-Item -Recurse -Force "$remoteAPI\*" "$github\"
Write-Host "✅ Synced to GitHub repo" -ForegroundColor Green

# Optionally push to GitHub
Set-Location $github
.\Push-ToGitHub.ps1
```

Usage: `.\sync-to-github.ps1`

### 4. Use VS Code Workspace

Open both folders in VS Code workspace:

1. File → Add Folder to Workspace
2. Add `bitburner-remote-api`
3. Add `scripts`
4. File → Save Workspace As → `bitburner-dev.code-workspace`

Now you can see both workspaces side-by-side!

### 5. Ignore TypeScript Errors

Those TypeScript warnings in the console? Ignore them completely. Your JavaScript files work perfectly!

---

## 📝 Troubleshooting

### Files Not Syncing

**Check:**
1. Is `npm run watch` still running?
2. Does Bitburner show "Connected"?
3. Is file saved in `src/` folder (not `dist/`)?

**Fix:**
- Reconnect: Options → Remote API → Connect
- Restart server if needed

### Changed File Not Updating in Game

**Cause:** File might be cached  
**Fix:** In Bitburner, try:
```bash
run test-remote.js  # Run once to clear cache
```

### Can't Find File in Bitburner

**Check:**
- Use `ls` to see what's there
- Verify filename matches exactly
- Check if file is in subfolder: `ls analysis/`

---

## 🎯 Success Checklist

Daily workflow mastered when you can:

- [ ] Start server in 30 seconds
- [ ] Connect Bitburner without thinking
- [ ] Edit → Save → Test in < 15 seconds
- [ ] Iterate 10+ times without frustration
- [ ] Copy stable changes to GitHub at end of day
- [ ] Feel the speed improvement vs old workflow

---

## 📚 Additional Resources

- **Setup Guide:** `docs/REMOTE_API_SETUP.md`
- **Test Plan:** `REMOTE_API_TEST_PLAN.md`
- **Troubleshooting:** `REMOTE_API_TROUBLESHOOTING.md`
- **Quick Setup Card:** `REMOTE_API_QUICKSTART.txt`
- **Official Docs:** [Remote API Specification](https://github.com/bitburner-official/bitburner-src/blob/dev/src/Documentation/doc/en/programming/remote_api.md)

---

**Remember:** 
- Remote API = Fast development
- GitHub = Safety and sharing
- Together = Best workflow! 🚀

**Version:** 1.0.0  
**Last Updated:** 2025-10-26  
**Status:** Production Ready

