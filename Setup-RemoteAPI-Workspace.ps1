# Setup Remote API Workspace
# Copies existing scripts to Remote API workspace while maintaining folder structure

param(
    [switch]$WhatIf = $false
)

$ErrorActionPreference = "Stop"

# Paths
$githubRepo = "C:\Users\YourUsername\bitburner\scripts"
$remoteAPIWorkspace = "C:\Users\YourUsername\bitburner\bitburner-remote-api\src"

Write-Host "`n╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Remote API Workspace Setup                            ║" -ForegroundColor Cyan
Write-Host "║  Copying scripts from GitHub repo to Remote API       ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Verify source exists
if (-not (Test-Path $githubRepo)) {
    Write-Host "❌ Error: GitHub repo not found at: $githubRepo" -ForegroundColor Red
    exit 1
}

# Verify Remote API workspace exists
if (-not (Test-Path $remoteAPIWorkspace)) {
    Write-Host "❌ Error: Remote API workspace not found at: $remoteAPIWorkspace" -ForegroundColor Red
    Write-Host "   Run these commands first:" -ForegroundColor Yellow
    Write-Host "   git clone https://github.com/bitburner-official/typescript-template bitburner-remote-api" -ForegroundColor Yellow
    Write-Host "   cd bitburner-remote-api" -ForegroundColor Yellow
    Write-Host "   npm install" -ForegroundColor Yellow
    exit 1
}

Write-Host "📂 Source: $githubRepo" -ForegroundColor White
Write-Host "📂 Destination: $remoteAPIWorkspace" -ForegroundColor White

if ($WhatIf) {
    Write-Host "`n⚠️  DRY RUN MODE - No files will be copied" -ForegroundColor Yellow
}

Write-Host ""

# Folders to copy
$folders = @("analysis", "batch", "core", "deploy", "utils", "config")

$totalFiles = 0

foreach ($folder in $folders) {
    $sourcePath = Join-Path $githubRepo $folder
    $destPath = Join-Path $remoteAPIWorkspace $folder
    
    if (Test-Path $sourcePath) {
        Write-Host "📁 Processing: $folder/" -ForegroundColor Cyan
        
        # Create destination folder
        if (-not $WhatIf -and -not (Test-Path $destPath)) {
            New-Item -ItemType Directory -Path $destPath -Force | Out-Null
            Write-Host "   ✅ Created folder: $folder/" -ForegroundColor Green
        }
        
        # Get all .js files in the folder
        $files = Get-ChildItem -Path $sourcePath -Filter *.js -File
        
        foreach ($file in $files) {
            $destFile = Join-Path $destPath $file.Name
            
            if ($WhatIf) {
                Write-Host "   Would copy: $($file.Name)" -ForegroundColor Gray
            } else {
                Copy-Item -Path $file.FullName -Destination $destFile -Force
                Write-Host "   ✅ Copied: $($file.Name)" -ForegroundColor Green
            }
            
            $totalFiles++
        }
        
        Write-Host ""
    } else {
        Write-Host "⚠️  Skipping: $folder/ (not found)" -ForegroundColor Yellow
        Write-Host ""
    }
}

# Copy root-level important scripts
Write-Host "📁 Processing: Root scripts" -ForegroundColor Cyan

$rootScripts = @("bitburner-update.js")

foreach ($scriptName in $rootScripts) {
    $sourcePath = Join-Path $githubRepo $scriptName
    $destPath = Join-Path $remoteAPIWorkspace $scriptName
    
    if (Test-Path $sourcePath) {
        if ($WhatIf) {
            Write-Host "   Would copy: $scriptName" -ForegroundColor Gray
        } else {
            Copy-Item -Path $sourcePath -Destination $destPath -Force
            Write-Host "   ✅ Copied: $scriptName" -ForegroundColor Green
        }
        $totalFiles++
    }
}

Write-Host ""

# Summary
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Setup Complete!                                       ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

if ($WhatIf) {
    Write-Host "`n📊 Summary (DRY RUN):" -ForegroundColor Yellow
    Write-Host "   Would copy: $totalFiles files" -ForegroundColor White
    Write-Host "`n   Run without -WhatIf to actually copy files:" -ForegroundColor Yellow
    Write-Host "   .\Setup-RemoteAPI-Workspace.ps1" -ForegroundColor Cyan
} else {
    Write-Host "`n📊 Summary:" -ForegroundColor Green
    Write-Host "   ✅ Copied: $totalFiles files" -ForegroundColor White
    Write-Host "   ✅ Workspace ready!" -ForegroundColor White
}

Write-Host "`n🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Start Remote API server:" -ForegroundColor White
Write-Host "      cd C:\Users\YourUsername\bitburner\bitburner-remote-api" -ForegroundColor Gray
Write-Host "      npm run watch" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Connect Bitburner:" -ForegroundColor White
Write-Host "      Options → Remote API → Connect" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Test a script:" -ForegroundColor White
Write-Host "      run analysis/profit-scan-flex.js" -ForegroundColor Gray
Write-Host ""
Write-Host "   4. Start coding with instant sync! ⚡" -ForegroundColor White
Write-Host ""

Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   Daily Workflow: REMOTE_API_DAILY_WORKFLOW.md" -ForegroundColor Gray
Write-Host ""

