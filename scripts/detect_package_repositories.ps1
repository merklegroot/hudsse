# PowerShell script to detect package repository sources for Windows package managers
# Only detects Windows-specific package managers (Winget, OneGet)

$repos = @()

# Winget (Windows Package Manager)
if (Get-Command winget.exe -ErrorAction SilentlyContinue) {
    try {
        $wingetSources = winget source list 2>$null
        if ($wingetSources) {
            foreach ($line in $wingetSources) {
                if ($line -match '^\s*\S+\s+\S+\s+\S+') {
                    $repos += "Winget: $line"
                }
            }
        }
    } catch {
        # Silently continue if winget fails
    }
}

# OneGet/PackageManagement providers
if (Get-Command Get-PackageSource -ErrorAction SilentlyContinue) {
    try {
        $oneGetSources = Get-PackageSource 2>$null
        if ($oneGetSources) {
            foreach ($source in $oneGetSources) {
                $repos += "OneGet: $($source.Name) - $($source.Location)"
            }
        }
    } catch {
        # Silently continue if OneGet fails
    }
}

# Output repositories
if ($repos.Count -eq 0) {
    Write-Output "No repositories found"
} else {
    foreach ($repo in $repos) {
        Write-Output $repo
    }
}
