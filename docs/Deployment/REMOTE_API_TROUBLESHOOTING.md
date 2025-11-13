# Remote API Troubleshooting - Node.js PATH Issue

## Problem: 'node.exe' is not recognized

This error means PowerShell can't find Node.js, even if it's installed.

## Solution Steps

### Step 1: Check if Node.js is Actually Installed

```powershell
# Check these common locations
Test-Path "C:\Program Files\nodejs\node.exe"
Test-Path "C:\Program Files (x86)\nodejs\node.exe"

# Or search for it
Get-ChildItem -Path C:\ -Filter node.exe -Recurse -ErrorAction SilentlyContinue | Select-Object FullName
```

### Step 2a: If Node.js IS Found

If the file exists, we just need to add it to PATH:

```powershell
# Find the exact location from Step 1, then add to PATH
# Example if it's in C:\Program Files\nodejs\

# Add to PATH for current session only (temporary)
$env:Path += ";C:\Program Files\nodejs"

# Verify it works now
node --version
npm --version

# If it works, add to PATH permanently:
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\nodejs", [EnvironmentVariableTarget]::User)
```

### Step 2b: If Node.js is NOT Found

Node.js isn't installed. Download and install it:

1. **Download Node.js**
   - Go to: https://nodejs.org/
   - Download: **LTS version** (Long Term Support)
   - Choose: **Windows Installer (.msi)** 64-bit

2. **Install Node.js**
   - Run the installer
   - **IMPORTANT**: Check "Add to PATH" during installation
   - Accept all defaults
   - Click Install

3. **Restart PowerShell**
   - Close ALL PowerShell windows
   - Open a NEW PowerShell window
   - The PATH changes will now be active

4. **Verify Installation**
   ```powershell
   node --version
   npm --version
   ```

### Step 3: After Fixing PATH

Once `node --version` works:

```powershell
# Go back to the Remote API test directory
cd C:\Users\YourUsername\bitburner\bitburner-remote-api

# Install dependencies
npm install

# Start the server
npm run watch
```

## Quick Fix Commands

Run these in order:

```powershell
# 1. Check if node exists
Get-Command node -ErrorAction SilentlyContinue

# 2. If not found, check common locations
Test-Path "C:\Program Files\nodejs\node.exe"

# 3a. If found, add to PATH (replace path if different)
$env:Path += ";C:\Program Files\nodejs"
node --version

# 3b. If it works, make it permanent
[Environment]::SetEnvironmentVariable("Path", $env:Path, [EnvironmentVariableTarget]::User)

# 4. Try npm run watch again
cd C:\Users\YourUsername\bitburner\bitburner-remote-api
npm run watch
```

## Alternative: Use Full Path

If PATH issues persist, you can use the full path:

```powershell
# Find Node.js location
$nodePath = Get-ChildItem -Path C:\ -Filter node.exe -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty DirectoryName

# Run npm with full path
& "$nodePath\npm.cmd" run watch
```

## Still Having Issues?

If none of the above works, it might be:
1. **Conda environment conflict** (you have `(base)` in your prompt)
2. **Windows Store version** of Node.js (problematic)
3. **Permission issues**

### Conda Conflict Check

Your prompt shows `(base)` which means Conda is active. Try:

```powershell
# Deactivate conda
conda deactivate

# Try again
node --version
npm run watch
```

### Windows Store Version Issue

If Node.js was installed via Windows Store, uninstall it and use the official installer from nodejs.org instead.

---

**After fixing Node.js PATH, proceed with Phase 2 of REMOTE_API_TEST_PLAN.md**

