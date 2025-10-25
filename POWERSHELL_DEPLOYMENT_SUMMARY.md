# PowerShell GitHub Deployment - Summary

## 🎯 The Better Way: Keep Your Organized Structure!

Instead of flattening your folders, use **Push-ToGitHub.ps1** to maintain your organized structure on GitHub while the update script handles flattening automatically in Bitburner.

---

## ✨ What's Different Now

### ❌ Old Way (Flattening)
```
Organized Folders → Flatten → Upload to GitHub → Download to Bitburner
```

### ✅ New Way (Keep Organized)
```
Organized Folders → Push to GitHub → Auto-flatten when downloading to Bitburner
```

**Benefits:**
- ✅ Keeps folders organized on GitHub
- ✅ One-command push with PowerShell
- ✅ Full Git version control
- ✅ Automatic flattening in Bitburner

---

## 📦 Files Created

### 1. **Push-ToGitHub.ps1** (PowerShell Automation)
**Purpose:** Push your organized folder structure to GitHub with one command

**Features:**
- First-time setup with -FirstTime flag
- Automatic .gitignore creation
- Git initialization
- Commit and push automation
- Shows your GitHub raw URL
- Error handling

**Usage:**
```powershell
# First time
.\Push-ToGitHub.ps1 -RepoUrl "https://github.com/user/repo.git" -FirstTime

# Regular updates
.\Push-ToGitHub.ps1 -RepoUrl "https://github.com/user/repo.git" -CommitMessage "Fixed batch logic"
```

---

### 2. **bitburner-update.js** (UPDATED)
**Purpose:** Downloads scripts from organized GitHub folders to flat Bitburner structure

**Key Changes:**
- Now supports organized folder structure
- Maps folders: core/, batch/, analysis/, utils/, deploy/
- Downloads from folders but saves flat to Bitburner home
- Added --analysis flag for analysis scripts

**Configuration:**
```javascript
const baseUrl = "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main";

const folders = {
  core: `${baseUrl}/core`,
  batch: `${baseUrl}/batch`,
  analysis: `${baseUrl}/analysis`,
  utils: `${baseUrl}/utils`,
  deploy: `${baseUrl}/deploy`
};
```

**Usage:**
```bash
run bitburner-update.js --all        # All scripts
run bitburner-update.js --essential  # Essential only
run bitburner-update.js --analysis   # Analysis tools
run bitburner-update.js --utils      # Utilities
```

---

### 3. **POWERSHELL_GITHUB_WORKFLOW.md** (Complete Guide)
**Purpose:** Step-by-step guide for the PowerShell workflow

**Covers:**
- First-time setup
- Daily workflow
- Script options
- How it works
- Advanced usage
- Troubleshooting
- Git tips

---

## 🚀 Quick Start

### Step 1: Create GitHub Repo
```
1. Go to github.com/new
2. Name: bitburner-scripts
3. Visibility: Private (FREE!)
4. Create
5. Copy the repo URL
```

### Step 2: First Push
```powershell
.\Push-ToGitHub.ps1 -RepoUrl "https://github.com/YOUR_USERNAME/bitburner-scripts.git" -FirstTime
```

### Step 3: Configure Update Script
```javascript
// Edit bitburner-update.js line 15
const baseUrl = "https://raw.githubusercontent.com/YOUR_USERNAME/bitburner-scripts/main";
```

### Step 4: Push Updated Script
```powershell
.\Push-ToGitHub.ps1 -RepoUrl "https://github.com/YOUR_USERNAME/bitburner-scripts.git" -CommitMessage "Configure update script"
```

### Step 5: First Run in Bitburner
```bash
wget YOUR_RAW_URL/bitburner-update.js bitburner-update.js
run bitburner-update.js --all
```

---

## 🔄 Daily Workflow

```
1. Edit scripts in organized folders
2. Run: .\Push-ToGitHub.ps1 -RepoUrl "URL" -CommitMessage "Your changes"
3. In game: run bitburner-update.js --all
4. Done!
```

---

## 📁 Structure Maintained

### On GitHub (Organized)
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
├── utils/
├── deploy/
└── bitburner-update.js
```

### In Bitburner (Flat)
```
home/
├── attack-hack.js
├── attack-grow.js
├── attack-weaken.js
├── simple-batcher.js
├── batch-manager.js
└── bitburner-update.js
```

**The update script handles the conversion automatically!**

---

## 💡 How It Works

1. **Push-ToGitHub.ps1** pushes your organized structure to GitHub
2. GitHub stores it with folders intact
3. **bitburner-update.js** reads from folder URLs:
   - `core/attack-hack.js`
   - `batch/simple-batcher.js`
4. But saves flat to Bitburner home:
   - `attack-hack.js`
   - `simple-batcher.js`

**Best of both worlds!**

---

## 🎯 Comparison

| Feature | Flatten Method | PowerShell Method |
|---------|---------------|-------------------|
| **GitHub Structure** | Flat | Organized |
| **Local Structure** | Need separate folder | Keep organized |
| **Push Command** | Manual Git or drag/drop | One PowerShell command |
| **Bitburner Result** | Flat | Flat (auto-converted) |
| **Development** | Less organized | Well organized |
| **Git History** | Good | Excellent |
| **Maintenance** | Harder | Easier |

---

## ✅ Benefits

### For Development
- ✅ Keep your organized folder structure
- ✅ Easy to find scripts during development
- ✅ Clear separation of concerns
- ✅ Better for collaboration

### For Deployment
- ✅ One command to push
- ✅ Automatic Git operations
- ✅ Shows you the URLs you need
- ✅ Error handling built-in

### For Bitburner
- ✅ Scripts still flat in-game (as required)
- ✅ One command to update
- ✅ Category-based updates
- ✅ Full version control

---

## 🆘 Troubleshooting

### Git Not Installed
**Download:** https://git-scm.com/download/win

### Authentication Issues
**Use Personal Access Token:**
1. GitHub Settings → Developer settings → Tokens
2. Generate new token with `repo` scope
3. Use as password when pushing

### Push Rejected
```powershell
git pull origin main
git push
```

---

## 📚 Documentation

**Quick Start**: POWERSHELL_GITHUB_WORKFLOW.md (this file)  
**Complete Guide**: docs/GITHUB_DEPLOYMENT_GUIDE.md  
**Quick Reference**: DEPLOYMENT_QUICKSTART.md  

---

## 🎉 You're Set!

You now have:
- ✅ Organized folders on GitHub
- ✅ One-command PowerShell push
- ✅ Automatic flattening in Bitburner
- ✅ Full Git version control
- ✅ Professional development workflow

**Start using it:**
```powershell
# Make some changes to your scripts

# Push to GitHub
.\Push-ToGitHub.ps1 -RepoUrl "YOUR_URL" -CommitMessage "Improved batcher"

# Update in Bitburner
run bitburner-update.js --all
```

**Happy hacking!** 🚀
