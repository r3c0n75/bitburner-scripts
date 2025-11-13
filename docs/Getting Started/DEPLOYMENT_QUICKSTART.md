# 🚀 GitHub Deployment Quick Start

Get your Bitburner scripts on GitHub in **5 minutes**!

---

## Step 1: Prepare Scripts (30 seconds)

Run this in PowerShell from your project directory:

```powershell
.\Prepare-GitHubUpload.ps1
```

✅ **Result:** Creates `bitburner-github/` folder with all scripts flattened

---

## Step 2: Create GitHub Repo (2 minutes)

1. Go to **https://github.com/new**
2. Fill in:
   - **Name:** `bitburner-scripts`
   - **Visibility:** ✓ Private (or Public - both free!)
   - **Initialize:** Leave unchecked
3. Click **"Create repository"**

---

## Step 3: Upload Files (1 minute)

### Easy Way (Drag & Drop):
1. Open your new repo on GitHub
2. Click **"uploading an existing file"**
3. **Drag all files** from `bitburner-github/` folder
4. **Commit**: "Initial upload"

### Git Way (If you prefer):
```bash
cd bitburner-github
git init
git add *.js
git commit -m "Initial upload"
git remote add origin https://github.com/YOUR_USERNAME/bitburner-scripts.git
git push -u origin main
```

---

## Step 4: Get Your GitHub URL (30 seconds)

1. Open **any .js file** in your repo
2. Click **"Raw"** button (top right)
3. Copy the URL up to `/main/`:
   ```
   https://raw.githubusercontent.com/YOUR_USERNAME/bitburner-scripts/main
   ```

---

## Step 5: Update Script Configuration (30 seconds)

1. Open `bitburner-github/bitburner-update.js`
2. Find **line 14**:
   ```javascript
   const baseUrl = "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main";
   ```
3. **Replace** with your URL from Step 4
4. **Save** and **upload to GitHub** (overwrite existing file)

---

## Step 6: First Run in Bitburner (1 minute)

In Bitburner terminal:

```bash
# Download the update script
wget https://raw.githubusercontent.com/YOUR_USERNAME/bitburner-scripts/main/bitburner-update.js bitburner-update.js

# Run it to get all scripts
run bitburner-update.js --all
```

---

## ✅ Done!

You should see:
```
=== Bitburner Script Update ===
✓ attack-hack.js
✓ attack-grow.js
✓ simple-batcher.js
...
=== Update Complete ===
Successful: 18
```

---

## 🔄 Future Updates

From now on, whenever you update scripts:

1. **Edit locally** → Push to GitHub
2. **In Bitburner:** `run bitburner-update.js --all`
3. **Done!** Latest scripts downloaded

---

## 📚 Need More Help?

See the complete guide: **[docs/GITHUB_DEPLOYMENT_GUIDE.md](docs/GITHUB_DEPLOYMENT_GUIDE.md)**

---

## Quick Commands Reference

```bash
# Update all scripts
run bitburner-update.js --all

# Update essential only
run bitburner-update.js

# Update specific categories
run bitburner-update.js --utils
run bitburner-update.js --deploy

# After update, start using
run profit-scan.js
run simple-batcher.js joesguns
```

---

## Troubleshooting

### "Download failed"
- ✓ Check your baseUrl in bitburner-update.js
- ✓ Make sure you uploaded all files to GitHub
- ✓ Verify the URL works in a browser

### "File not found"
- ✓ Files must be in repo root (not in folders)
- ✓ Filenames are case-sensitive
- ✓ Branch should be `main` (not `master`)

### "Cannot read property"
- ✓ Run `run bitburner-update.js --all` again
- ✓ Kill old scripts: `run global-kill.js`

---

## 🎉 Success!

Your Bitburner scripts are now:
- ✅ Version controlled on GitHub
- ✅ Auto-updatable from anywhere
- ✅ Backed up in the cloud
- ✅ Easy to share (if public)

**Happy hacking!** 🚀
