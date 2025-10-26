# Remote API Testing Plan

Based on the [official Bitburner Remote API documentation](https://github.com/bitburner-official/bitburner-src/blob/dev/src/Documentation/doc/en/programming/remote_api.md)

## 🎯 What We're Testing

The Remote API is a **WebSocket-based protocol** that allows external tools to:
- Push files to Bitburner
- Get files from Bitburner
- List files on servers
- Calculate RAM costs
- Delete files

## 📋 Test Plan Overview

We'll test with the **TypeScript Template** (official, simplest option) to verify:
1. ✅ Connection establishment
2. ✅ File synchronization (push files to Bitburner)
3. ✅ Live editing workflow
4. ✅ Folder structure handling
5. ✅ Performance comparison vs GitHub method

---

## Phase 1: Setup (10 minutes)

### Step 1.1: Verify Prerequisites
You mentioned you already have Node.js installed. Let's confirm:

```powershell
# Check versions
node --version
npm --version
git --version
```

**Expected output:**
- Node.js: v16.x or higher
- npm: v8.x or higher
- git: v2.x or higher

### Step 1.2: Clone TypeScript Template

```powershell
# Clone in a separate directory (not your existing scripts folder)
cd C:\Users\YourUsername\bitburner\
git clone https://github.com/bitburner-official/typescript-template bitburner-remote-api
cd bitburner-remote-api
```

### Step 1.3: Install Dependencies

```powershell
# Install the Remote API sync tool and dependencies
npm install
```

**What this does:**
- Installs `bitburner-filesync` (the actual Remote API WebSocket server)
- Installs TypeScript compiler (optional, we can use JavaScript)
- Sets up the development environment

### Step 1.4: Review the Structure

```powershell
# See what we have
Get-ChildItem
```

**Expected structure:**
```
bitburner-remote-api/
├── src/              # Your scripts go here
├── dist/             # Compiled output (auto-generated)
├── package.json      # NPM configuration
└── NetscriptDefinitions.d.ts  # TypeScript definitions
```

---

## Phase 2: Start Remote API Server (2 minutes)

### Step 2.1: Start the WebSocket Server

```powershell
npm run watch
```

**Expected output:**
```
Bitburner filesync server listening on port 12525
Watching for file changes...
```

**What's happening:**
- A WebSocket server starts on `localhost:12525`
- The server watches files in `src/` directory
- Any changes trigger automatic sync to Bitburner

**⚠️ Leave this PowerShell window open!** The server must stay running.

### Step 2.2: Verify Server is Running

Open a **second PowerShell window** and test:

```powershell
# Test if port 12525 is listening (Windows)
Test-NetConnection -ComputerName localhost -Port 12525
```

**Expected output:**
```
TcpTestSucceeded : True
```

---

## Phase 3: Connect Bitburner (2 minutes)

### Step 3.1: Open Bitburner

Open Bitburner in your web browser (Steam or web version)

### Step 3.2: Configure Remote API Connection

1. Click **Options** (⚙️ icon, top right)
2. Navigate to **Remote API** tab
3. Configure:
   - **Hostname**: `localhost`
   - **Port**: `12525`
4. Click **Connect**

**Expected result:**
- ✅ Status shows: "Connected to Remote API"
- Green indicator appears

**If connection fails:**
- Verify `npm run watch` is still running
- Check Windows Firewall isn't blocking port 12525
- Try `127.0.0.1` instead of `localhost`

---

## Phase 4: Test File Sync (5 minutes)

### Test 4.1: Create a Simple Test Script

In VS Code, create a new file in the `src/` folder:

**File:** `bitburner-remote-api/src/test-remote-api.js`

```javascript
/** @param {NS} ns */
export async function main(ns) {
  ns.tprint("🎉 Remote API is working!");
  ns.tprint("This file was synced instantly!");
  ns.tprint("Current time: " + new Date().toLocaleTimeString());
}
```

### Test 4.2: Save and Verify Instant Sync

1. **Save the file** (Ctrl+S)
2. **Check the `npm run watch` console** - you should see:
   ```
   Pushed file: test-remote-api.js
   ```
3. **In Bitburner terminal**, verify the file exists:
   ```bash
   ls
   ```
4. **Run the script:**
   ```bash
   run test-remote-api.js
   ```

**Expected output in Bitburner:**
```
🎉 Remote API is working!
This file was synced instantly!
Current time: [current time]
```

### Test 4.3: Test Live Editing

1. **Edit the file** - change the message to something else
2. **Save** (Ctrl+S)
3. **In Bitburner**, run it again immediately:
   ```bash
   run test-remote-api.js
   ```

**Expected result:**
- The new message appears instantly
- No need to wget or run update scripts!

---

## Phase 5: Test Your Existing Scripts (10 minutes)

### Test 5.1: Copy One Script for Testing

Let's test with `profit-scan.js`:

```powershell
# Copy one of your existing scripts
Copy-Item C:\Users\YourUsername\bitburner\scripts\analysis\profit-scan.js `
          C:\Users\YourUsername\bitburner\bitburner-remote-api\src\profit-scan.js
```

### Test 5.2: Verify Sync

The file should sync automatically. In Bitburner:

```bash
ls
run profit-scan.js
```

**Expected result:**
- Script runs normally
- No changes needed to the script
- Works exactly like the GitHub method

### Test 5.3: Test Folder Structure

Create a folder structure like your current project:

```powershell
# Create folders
cd C:\Users\YourUsername\bitburner\bitburner-remote-api\src
New-Item -ItemType Directory -Path analysis
New-Item -ItemType Directory -Path batch
New-Item -ItemType Directory -Path core

# Copy some scripts
Copy-Item C:\Users\YourUsername\bitburner\scripts\analysis\profit-scan-flex.js analysis\
Copy-Item C:\Users\YourUsername\bitburner\scripts\core\attack-hack.js core\
```

### Test 5.4: Run Scripts with Folder Paths

In Bitburner:

```bash
ls
ls analysis/
run analysis/profit-scan-flex.js
```

**What to observe:**
- Files appear in folders (not flattened!)
- You can run them with folder paths
- Folder structure is preserved in-game

---

## Phase 6: Performance Comparison (5 minutes)

### Test 6.1: Time the GitHub Method

Using your current workflow:

```powershell
# Start timer
$start = Get-Date

# Make a small change to profit-scan.js
# Push to GitHub
.\Push-ToGitHub.ps1

# In-game: run wget command + bitburner-update.js
# (manually do this in Bitburner)

# End timer
$end = Get-Date
$duration = ($end - $start).TotalSeconds
Write-Host "GitHub method took: $duration seconds"
```

### Test 6.2: Time the Remote API Method

Using Remote API:

```powershell
# Start timer
$start = Get-Date

# Make a small change to src/profit-scan.js
# Save the file (Ctrl+S)

# In-game: run profit-scan.js immediately

# End timer
$end = Get-Date
$duration = ($end - $start).TotalSeconds
Write-Host "Remote API method took: $duration seconds"
```

**Expected comparison:**
- GitHub method: 60-120+ seconds (manual steps, network delay)
- Remote API: 2-5 seconds (instant sync)

---

## Phase 7: Test Connection Persistence

### Test 7.1: Test Sleep/Wake

1. Put your computer to sleep (5 minutes)
2. Wake it up
3. Try to run a script in Bitburner

**Expected result:**
- ❌ Connection lost (this is normal)
- In Bitburner: Options → Remote API → Connect (again)
- ✅ Connection restored

**Note:** You do NOT need to restart `npm run watch`

### Test 7.2: Test Server Restart

1. Stop the server (Ctrl+C in the `npm run watch` window)
2. Try to edit a file and save
3. In Bitburner, check if the change appeared

**Expected result:**
- ❌ File does NOT sync (server is stopped)
- Restart server: `npm run watch`
- Reconnect in Bitburner
- Edit and save again
- ✅ Sync works again

---

## Phase 8: Test Migration Strategy (Optional)

### Test 8.1: Dual Workflow Test

Can you use both Remote API and GitHub simultaneously?

**Test scenario:**
1. **Morning**: Edit scripts using Remote API (fast iteration)
2. **End of day**: Commit and push to GitHub (version control)

```powershell
# In bitburner-remote-api directory
git init
git remote add origin [your GitHub repo URL]
git add .
git commit -m "Test commit from Remote API workflow"
git push
```

**Result:**
- ✅ Both workflows can coexist
- Use Remote API for daily dev
- Use GitHub for backups and sharing

---

## 🎯 Success Criteria

After completing this test plan, you should have verified:

- ✅ **Connection**: Remote API connects successfully
- ✅ **Sync Speed**: Files appear in-game within 2-5 seconds
- ✅ **Live Editing**: Changes sync instantly on save
- ✅ **Folder Structure**: Folders are preserved in-game
- ✅ **Script Compatibility**: Your existing scripts work without modification
- ✅ **Performance**: 20-60x faster than GitHub method
- ✅ **Reliability**: Connection can be restored after interruptions

---

## 📊 Test Results Template

Fill this out as you test:

### Connection Test
- [ ] Server starts successfully (port 12525)
- [ ] Bitburner connects successfully
- [ ] Status shows "Connected"

### File Sync Test
- [ ] New file syncs instantly (< 5 seconds)
- [ ] Modified file syncs instantly
- [ ] Multiple files sync correctly

### Folder Structure Test
- [ ] Folders appear in Bitburner
- [ ] Can run scripts with folder paths
- [ ] Structure matches local filesystem

### Performance Test
- GitHub method time: _____ seconds
- Remote API time: _____ seconds
- Speed improvement: _____x faster

### Existing Scripts Test
- [ ] profit-scan.js works
- [ ] profit-scan-flex.js works
- [ ] attack-hack.js works
- [ ] Other scripts work without modification

### Reliability Test
- [ ] Reconnects after sleep/wake
- [ ] Reconnects after server restart
- [ ] No data loss during disconnection

---

## 🚨 Troubleshooting

### Problem: "Failed to connect to Remote API"

**Solutions:**
1. Verify server is running: Check the `npm run watch` window
2. Check port: Should see "listening on port 12525"
3. Test network:
   ```powershell
   Test-NetConnection -ComputerName localhost -Port 12525
   ```
4. Try alternative hostname: Use `127.0.0.1` instead of `localhost`
5. Check firewall: Temporarily disable Windows Firewall and test

### Problem: "Files not syncing"

**Solutions:**
1. Check server console for errors
2. Verify file is in `src/` directory (not `dist/`)
3. Check Bitburner shows "Connected"
4. Try disconnecting and reconnecting
5. Restart the server

### Problem: "Script not found in Bitburner"

**Solutions:**
1. Check filename in server console output
2. Use `ls` in Bitburner to see what files exist
3. Verify file path (folder structure)
4. Try refreshing Bitburner page

### Problem: "npm run watch" fails

**Solutions:**
1. Delete `node_modules/` and run `npm install` again
2. Check Node.js version: `node --version` (need 16+)
3. Try `npm run build` first to see specific errors
4. Check package.json exists in current directory

---

## 📝 Test Report

After completing the tests, document:

1. **What worked well:**
   - 
   
2. **What didn't work:**
   - 

3. **Performance gains:**
   - GitHub method: ___ seconds
   - Remote API: ___ seconds

4. **Would you adopt this workflow?**
   - [ ] Yes, full migration
   - [ ] Yes, dual workflow (Remote API + GitHub)
   - [ ] No, staying with GitHub only

5. **Reasons:**
   - 

---

## 🎯 Next Steps After Testing

### If Remote API Works Well:

**Option A: Full Migration**
```powershell
# Copy all your scripts to Remote API workspace
Copy-Item -Recurse C:\Users\YourUsername\bitburner\scripts\* `
                    C:\Users\YourUsername\bitburner\bitburner-remote-api\src\
```

**Option B: Dual Workflow** (Recommended)
- Keep your current GitHub workflow for backups
- Use Remote API for active development
- Commit to GitHub when you have stable versions

### If Remote API Has Issues:

- Document the issues in the Test Report above
- Continue with your current GitHub workflow (it works great!)
- Remote API is optional, not required

---

**Test Duration:** ~30-45 minutes total

**Difficulty:** Easy (following step-by-step)

**Risk:** None (separate directory, doesn't affect your current setup)

**Reward:** 20-60x faster development cycle if it works!

---

**Version:** 1.0.0  
**Last Updated:** 2025-10-26  
**Based On:** [Official Bitburner Remote API Documentation](https://github.com/bitburner-official/bitburner-src/blob/dev/src/Documentation/doc/en/programming/remote_api.md)

