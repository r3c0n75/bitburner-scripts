# PowerShell GitHub Workflow Guide

Use PowerShell to push your **organized folder structure** directly to GitHub!

---

## 🎯 Benefits of This Approach

✅ **Keep organized folders** - No flattening needed!  
✅ **Push with one command** - PowerShell automation  
✅ **Preserve structure on GitHub** - Better for development  
✅ **Auto-flatten in Bitburner** - Update script handles it  
✅ **Full Git features** - Branches, history, rollback  

---

## 🚀 Quick Start (First Time)

### Step 1: Create GitHub Repository

1. Go to **https://github.com/new**
2. **Repository name:** `bitburner-scripts`
3. **Visibility:** ✓ Private (or Public - both FREE!)
4. **Initialize:** Leave all checkboxes UNCHECKED
5. Click **"Create repository"**
6. **Copy the repository URL** (e.g., `https://github.com/username/bitburner-scripts.git`)

### Step 2: First Push

Run this in PowerShell from your project directory:

```powershell
.\Push-ToGitHub.ps1 -RepoUrl "https://github.com/YOUR_USERNAME/bitburner-scripts.git" -FirstTime
```

**What it does:**
- Creates .gitignore (if needed)
- Initializes Git repository
- Adds all your organized folders
- Commits with message
- Pushes to GitHub
- Shows you your raw URL for configuration

### Step 3: Configure Update Script

1. **Copy the raw URL** shown by the script
2. **Open** `bitburner-update.js`
3. **Line 15** - Update the baseUrl:
   ```javascript
   const baseUrl = "https://raw.githubusercontent.com/YOUR_USERNAME/bitburner-scripts/main";
   ```
4. **Save** the file
5. **Push this change**:
   ```powershell
   .\Push-ToGitHub.ps1 -RepoUrl "https://github.com/YOUR_USERNAME/bitburner-scripts.git" -CommitMessage "Configure update script"
   ```

### Step 4: First Run in Bitburner

In Bitburner terminal:

```bash
# Download the update script
wget https://raw.githubusercontent.com/YOUR_USERNAME/bitburner-scripts/main/bitburner-update.js bitburner-update.js

# Run it to get all scripts
run bitburner-update.js --all
```

**You should see:**
```
=== Bitburner Script Update ===
Base URL: https://raw.githubusercontent.com/...
Organized folder structure maintained on GitHub
Files to download: 18

✓ attack-hack.js
✓ attack-grow.js
✓ attack-weaken.js
...

=== Update Complete ===
Successful: 18
Failed: 0
```

---

## 🔄 Daily Workflow (After First Time)

### Edit → Push → Update

1. **Edit your scripts** locally (in organized folders)
2. **Push to GitHub**:
   ```powershell
   .\Push-ToGitHub.ps1 -RepoUrl "https://github.com/YOUR_USERNAME/bitburner-scripts.git" -CommitMessage "Fixed batch logic"
   ```
3. **Update in Bitburner**:
   ```bash
   run bitburner-update.js --all
   ```

That's it! Three simple steps.

---

## 📝 Push Script Options

### Basic Push
```powershell
.\Push-ToGitHub.ps1 -RepoUrl "URL" -CommitMessage "Your message"
```

### First Time Setup
```powershell
.\Push-ToGitHub.ps1 -RepoUrl "URL" -FirstTime
```

### Different Branch
```powershell
.\Push-ToGitHub.ps1 -RepoUrl "URL" -Branch "dev" -CommitMessage "Experimental feature"
```

### Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `-RepoUrl` | Yes | - | Your GitHub repo URL |
| `-CommitMessage` | No | "Update scripts" | Commit message |
| `-Branch` | No | "main" | Branch name |
| `-FirstTime` | No | False | Use for initial setup |

---

## 📁 What Gets Pushed

Your **entire organized structure**:

```
GitHub Repository
├── core/
│   ├── attack-hack.js
│   ├── attack-grow.js
│   └── attack-weaken.js
├── batch/
│   ├── simple-batcher.js
│   └── batch-manager.js
├── analysis/
│   ├── profit-scan.js
│   ├── production-monitor.js
│   └── estimate-production.js
├── utils/
│   ├── global-kill.js
│   ├── list-procs.js
│   └── ...
├── deploy/
│   └── ...
├── docs/
│   └── ...
├── config/
│   └── ...
├── bitburner-update.js
├── README.md
└── .gitignore
```

**In Bitburner** (flat):
```
home/
├── attack-hack.js
├── attack-grow.js
├── simple-batcher.js
├── profit-scan.js
└── ... (all scripts flat)
```

The `bitburner-update.js` script handles downloading from folders to flat structure automatically!

---

## 💡 How It Works

### GitHub Side (Organized)
```
Your organized folders → GitHub maintains structure
```

### Bitburner Side (Flat)
```
bitburner-update.js reads from:
  core/attack-hack.js
  batch/simple-batcher.js
  
Saves to Bitburner home as:
  attack-hack.js
  simple-batcher.js
```

**Best of both worlds:**
- ✅ Organized on GitHub for development
- ✅ Flat in Bitburner (as required by the game)

---

## 🔧 Advanced Usage

### Create Development Branch

```powershell
# Create and switch to dev branch
git checkout -b dev

# Push to dev branch
.\Push-ToGitHub.ps1 -RepoUrl "URL" -Branch "dev" -CommitMessage "Experimental feature"
```

Then in Bitburner, update the baseUrl to use `/dev` instead of `/main` for testing.

### Check Status Before Pushing

```powershell
git status
```

### View Commit History

```powershell
git log --oneline -10
```

### Undo Last Commit (Before Push)

```powershell
git reset --soft HEAD~1
```

---

## 🆘 Troubleshooting

### "Git is not installed"

**Solution:**
1. Download Git from: https://git-scm.com/download/win
2. Install with default options
3. Restart PowerShell
4. Try again

### "Authentication failed"

**Solution - Use Personal Access Token:**

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scope: `repo` (full control)
4. Copy the token
5. When pushing, use token as password
6. Or configure Git credential helper:
   ```powershell
   git config --global credential.helper wincred
   ```

### "Push rejected"

**If someone else pushed first:**
```powershell
git pull origin main
git push
```

### "Files not showing on GitHub"

**Check .gitignore:**
```powershell
# View .gitignore
Get-Content .gitignore

# Test if file is ignored
git check-ignore -v filename.js
```

---

## 🎓 Git Tips

### View What Will Be Committed

```powershell
git diff --cached
```

### Unstage a File

```powershell
git reset HEAD filename.js
```

### Discard Local Changes

```powershell
git checkout -- filename.js
```

### Create .gitignore Rules

Edit `.gitignore` to exclude files:
```
# Exclude logs
*.log

# Exclude specific file
temp.js

# Exclude directory
temp/

# But keep specific file
!important.log
```

---

## 📊 Comparison: PowerShell vs Manual

| Task | PowerShell Script | Manual Process |
|------|-------------------|----------------|
| **Initial Setup** | One command | Multiple Git commands |
| **Regular Push** | One command | Stage, commit, push |
| **Error Handling** | Automatic | Manual troubleshooting |
| **Status Check** | Built-in | Separate command |
| **URL Display** | Automatic | Manual construction |

---

## 🎯 Workflow Diagram

```
Local Machine (Organized)
         │
         ├─ Edit scripts in folders
         ├─ Test locally
         └─ Run Push-ToGitHub.ps1
               │
               ▼
        GitHub (Organized)
               │
               ├─ core/
               ├─ batch/
               ├─ analysis/
               └─ utils/
               │
               ▼
      Bitburner (Flat)
               │
               ├─ Run bitburner-update.js
               └─ Downloads from folders
                  Saves flat to home
```

---

## ✅ Checklist

### Initial Setup
- [ ] Installed Git
- [ ] Created GitHub repository
- [ ] Copied repository URL
- [ ] Ran Push-ToGitHub.ps1 with -FirstTime
- [ ] Configured bitburner-update.js
- [ ] Pushed bitburner-update.js
- [ ] First update successful in Bitburner

### Daily Workflow
- [ ] Edit scripts in organized folders
- [ ] Run Push-ToGitHub.ps1 with commit message
- [ ] Run bitburner-update.js in game
- [ ] Verify scripts updated

---

## 📚 Quick Command Reference

```powershell
# First time setup
.\Push-ToGitHub.ps1 -RepoUrl "URL" -FirstTime

# Regular push
.\Push-ToGitHub.ps1 -RepoUrl "URL" -CommitMessage "Your changes"

# Check status
git status

# View commits
git log --oneline -10

# View remote
git remote -v
```

---

## 🎉 Success!

You now have a professional Git workflow while maintaining your organized folder structure!

**Benefits:**
- ✅ Organized folders on GitHub
- ✅ One-command pushes
- ✅ Full Git history
- ✅ Easy collaboration
- ✅ Automatic flattening in Bitburner

**Next Steps:**
1. Make changes to your scripts
2. Run the push script
3. Update in Bitburner
4. Enjoy your improved workflow!

---

**For More Help:**
- Complete guide: [docs/GITHUB_DEPLOYMENT_GUIDE.md](docs/GITHUB_DEPLOYMENT_GUIDE.md)
- Quick start: [DEPLOYMENT_QUICKSTART.md](DEPLOYMENT_QUICKSTART.md)
