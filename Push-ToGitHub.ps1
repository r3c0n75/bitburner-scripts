<#
.SYNOPSIS
    Pushes Bitburner scripts to GitHub while maintaining organized folder structure.

.DESCRIPTION
    This script initializes a Git repository (if needed) and pushes your organized
    scripts to GitHub. The folder structure is preserved in the repo for development,
    while the bitburner-update.js script handles downloading to flat structure in-game.

.PARAMETER RepoUrl
    Your GitHub repository URL (e.g., https://github.com/username/bitburner-scripts.git)

.PARAMETER CommitMessage
    Commit message for the changes (default: "Update scripts")

.PARAMETER Branch
    Branch name (default: "main")

.PARAMETER FirstTime
    Use this switch for initial setup (creates .gitignore, initializes repo)

.EXAMPLE
    .\Push-ToGitHub.ps1 -RepoUrl "https://github.com/user/bitburner-scripts.git" -FirstTime
    Initial setup and first push

.EXAMPLE
    .\Push-ToGitHub.ps1 -RepoUrl "https://github.com/user/bitburner-scripts.git" -CommitMessage "Fixed batch manager"
    Regular update push
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$RepoUrl,
    
    [string]$CommitMessage = "Update scripts",
    
    [string]$Branch = "main",
    
    [switch]$FirstTime
)

Write-Host "`n=== Bitburner GitHub Push ===" -ForegroundColor Cyan

# Check if git is installed
try {
    $gitVersion = git --version
    Write-Host "✓ Git installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git is not installed. Please install Git first:" -ForegroundColor Red
    Write-Host "  Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# First time setup
if ($FirstTime) {
    Write-Host "`n=== First Time Setup ===" -ForegroundColor Cyan
    
    # Create .gitignore if it doesn't exist
    if (!(Test-Path ".gitignore")) {
        Write-Host "Creating .gitignore..." -ForegroundColor Yellow
        
        $gitignoreContent = @(
            "# Bitburner Scripts Repository",
            "# Organized folder structure maintained for development",
            "",
            "# IDE and Editor files",
            ".vscode/",
            ".idea/",
            "*.swp",
            "*.swo",
            "*~",
            "",
            "# OS files",
            ".DS_Store",
            "Thumbs.db",
            "desktop.ini",
            "",
            "# Logs and temporary files",
            "*.log",
            "*.bak",
            "*.tmp",
            "",
            "# Node modules (if using any build tools)",
            "node_modules/",
            "package-lock.json",
            "",
            "# PowerShell artifacts",
            "*.ps1xml",
            "",
            "# Keep all JavaScript files",
            "!*.js",
            "",
            "# Keep all markdown documentation",
            "!*.md",
            "",
            "# Keep all directories",
            "!*/"
        ) -join "`n"
        
        Set-Content -Path ".gitignore" -Value $gitignoreContent
        Write-Host "✓ .gitignore created" -ForegroundColor Green
    }
    
    # Initialize git repository
    if (!(Test-Path ".git")) {
        Write-Host "Initializing git repository..." -ForegroundColor Yellow
        git init
        git branch -M $Branch
        Write-Host "✓ Git repository initialized" -ForegroundColor Green
    }
    
    # Add remote
    Write-Host "Adding remote repository..." -ForegroundColor Yellow
    try {
        git remote add origin $RepoUrl
        Write-Host "✓ Remote added: $RepoUrl" -ForegroundColor Green
    } catch {
        Write-Host "Note: Remote may already exist" -ForegroundColor Yellow
    }
}

# Check for changes
Write-Host "`n=== Checking for changes ===" -ForegroundColor Cyan
$status = git status --porcelain
if (!$status) {
    Write-Host "No changes to commit" -ForegroundColor Yellow
    exit 0
}

Write-Host "Changes detected:" -ForegroundColor Green
git status --short

# Stage all files
Write-Host "`n=== Staging files ===" -ForegroundColor Cyan
git add .

Write-Host "Staged files:" -ForegroundColor Green
git diff --cached --name-only | ForEach-Object {
    Write-Host "  ✓ $_" -ForegroundColor Green
}

# Check Git identity
$userName = git config user.name
$userEmail = git config user.email

if (!$userName -or !$userEmail) {
    Write-Host "`n⚠️  Git identity not configured!" -ForegroundColor Yellow
    Write-Host "Please configure your Git identity:" -ForegroundColor Yellow
    Write-Host ""
    $name = Read-Host "Enter your name"
    $email = Read-Host "Enter your email"
    
    git config user.name "$name"
    git config user.email "$email"
    Write-Host "✓ Git identity configured" -ForegroundColor Green
}

# Commit
Write-Host "`n=== Committing changes ===" -ForegroundColor Cyan
try {
    git commit -m $CommitMessage
    if ($LASTEXITCODE -ne 0) {
        throw "Commit failed"
    }
    Write-Host "✓ Committed: $CommitMessage" -ForegroundColor Green
} catch {
    Write-Host "✗ Commit failed: $_" -ForegroundColor Red
    exit 1
}

# Push
Write-Host "`n=== Pushing to GitHub ===" -ForegroundColor Cyan
try {
    if ($FirstTime) {
        git push -u origin $Branch 2>&1 | Out-String | Write-Host
        if ($LASTEXITCODE -ne 0) {
            throw "Push failed with exit code $LASTEXITCODE"
        }
    } else {
        git push 2>&1 | Out-String | Write-Host
        if ($LASTEXITCODE -ne 0) {
            throw "Push failed with exit code $LASTEXITCODE"
        }
    }
    Write-Host "✓ Successfully pushed to GitHub!" -ForegroundColor Green
} catch {
    Write-Host "✗ Push failed: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  1. Authentication required - Use Personal Access Token as password" -ForegroundColor White
    Write-Host "  2. Branch doesn't exist - Try: git push -u origin $Branch" -ForegroundColor White
    Write-Host "  3. No commits to push - Check that commit succeeded" -ForegroundColor White
    exit 1
}

# Display remote info
Write-Host "`n=== Repository Info ===" -ForegroundColor Cyan
$remoteUrl = git remote get-url origin
Write-Host "Remote URL: $remoteUrl" -ForegroundColor White

# Extract username and repo name for raw URL
if ($remoteUrl -match "github\.com[:/](.+)/(.+?)(\.git)?$") {
    $username = $matches[1]
    $reponame = $matches[2] -replace "\.git$", ""
    $rawUrl = "https://raw.githubusercontent.com/$username/$reponame/$Branch"
    
    Write-Host "`n=== Next Steps ===" -ForegroundColor Cyan
    Write-Host "Your GitHub Raw URL:" -ForegroundColor Yellow
    Write-Host $rawUrl -ForegroundColor White
    
    Write-Host "`nUpdate bitburner-update.js with this URL structure:" -ForegroundColor Yellow
    Write-Host "const baseUrl = `"$rawUrl`";" -ForegroundColor White
    Write-Host "const scriptPaths = {" -ForegroundColor White
    Write-Host "  core: `"$rawUrl/core`"," -ForegroundColor White
    Write-Host "  batch: `"$rawUrl/batch`"," -ForegroundColor White
    Write-Host "  // ... etc" -ForegroundColor White
    Write-Host "}" -ForegroundColor White
}

Write-Host "`n✓ Push complete!" -ForegroundColor Green
Write-Host "Your organized folder structure is preserved on GitHub." -ForegroundColor White
Write-Host "The bitburner-update.js script will handle downloading to flat structure in-game." -ForegroundColor White
