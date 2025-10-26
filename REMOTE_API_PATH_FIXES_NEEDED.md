# Remote API Path Fixes Needed

**Date:** October 26, 2025  
**Issue:** Scripts reference flat file structure but Remote API uses organized folders

---

## 🎯 Files That Need Path Updates

### Location: `bitburner-remote-api/src/deploy/`

---

### 1. **auto-expand.js** (Line 20)

**Current:**
```javascript
const script = "hack-universal.js";
```

**Fix to:**
```javascript
const script = "deploy/hack-universal.js";
```

---

### 2. **deploy-hack-joesguns.js** (Line 9)

**Current:**
```javascript
const script = "hack-joesguns.js";
```

**Fix to:**
```javascript
const script = "deploy/hack-joesguns.js";
```

---

### 3. **auto-deploy-all.js** (Line 9)

**Current:**
```javascript
const script = "hack-joesguns.js";
```

**Fix to:**
```javascript
const script = "deploy/hack-joesguns.js";
```

---

### 4. **home-batcher.js** (Lines 15-17)

**Current:**
```javascript
const hackScript = "attack-hack.js";
const growScript = "attack-grow.js";
const weakenScript = "attack-weaken.js";
```

**Fix to:**
```javascript
const hackScript = "core/attack-hack.js";
const growScript = "core/attack-grow.js";
const weakenScript = "core/attack-weaken.js";
```

---

## 🧪 Testing

**After fixing, test in Bitburner:**
```bash
run deploy/auto-expand.js joesguns
run deploy/auto-deploy-all.js
run deploy/home-batcher.js joesguns
```

---

## 📋 After Fixes Work

**Copy back to GitHub repo:**
```powershell
Copy-Item -Recurse -Force bitburner-remote-api\src\deploy\* scripts\deploy\
cd scripts
.\Push-ToGitHub.ps1
```

---

## 🔍 Why This Happened

- Old GitHub repo uses **flat structure** (all files in deploy/ folder)
- Remote API preserves **organized structure** (files reference folders)
- Scripts need to use folder paths: `core/`, `deploy/`, etc.

---

## ✅ When Complete

- [x] Fixed auto-expand.js
- [x] Fixed deploy-hack-joesguns.js
- [x] Fixed auto-deploy-all.js
- [x] Fixed home-batcher.js
- [x] Tested in Bitburner ✅ WORKING!
- [ ] Copied back to GitHub repo
- [ ] Delete this note file

---

**Next:** Open `C:\Users\YourUsername\bitburner\bitburner-remote-api` in Cursor and fix these 4 files!

