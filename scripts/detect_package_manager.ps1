# Script to detect package manager on Windows systems

# Function to detect package manager
function Detect-PackageManager {
    $packageManager = ""
    
    # Check for Chocolatey
    if (Get-Command choco -ErrorAction SilentlyContinue) {
        $packageManager = "Chocolatey"
    }
    # Check for Scoop
    elseif (Get-Command scoop -ErrorAction SilentlyContinue) {
        $packageManager = "Scoop"
    }
    # Check for Winget (Windows Package Manager)
    elseif (Get-Command winget -ErrorAction SilentlyContinue) {
        $packageManager = "Winget"
    }
    # Check for NuGet (.NET package manager)
    elseif (Get-Command nuget -ErrorAction SilentlyContinue) {
        $packageManager = "NuGet"
    }
    # Check for NPM (Node.js package manager)
    elseif (Get-Command npm -ErrorAction SilentlyContinue) {
        $packageManager = "NPM"
    }
    # Check for Pip (Python package manager)
    elseif (Get-Command pip -ErrorAction SilentlyContinue) {
        $packageManager = "Pip"
    }
    # Check for Conda (Python package manager)
    elseif (Get-Command conda -ErrorAction SilentlyContinue) {
        $packageManager = "Conda"
    }
    # Check for Composer (PHP package manager)
    elseif (Get-Command composer -ErrorAction SilentlyContinue) {
        $packageManager = "Composer"
    }
    # Check for Gem (Ruby package manager)
    elseif (Get-Command gem -ErrorAction SilentlyContinue) {
        $packageManager = "Gem"
    }
    # Check for Cargo (Rust package manager)
    elseif (Get-Command cargo -ErrorAction SilentlyContinue) {
        $packageManager = "Cargo"
    }
    # Check for Go modules
    elseif (Get-Command go -ErrorAction SilentlyContinue) {
        $packageManager = "Go Modules"
    }
    # Check for Maven (Java package manager)
    elseif (Get-Command mvn -ErrorAction SilentlyContinue) {
        $packageManager = "Maven"
    }
    # Check for Gradle (Java package manager)
    elseif (Get-Command gradle -ErrorAction SilentlyContinue) {
        $packageManager = "Gradle"
    }
    # Check for Docker (Container package manager)
    elseif (Get-Command docker -ErrorAction SilentlyContinue) {
        $packageManager = "Docker"
    }
    # Check for PowerShell Gallery
    elseif (Get-Module -ListAvailable -Name PowerShellGet) {
        $packageManager = "PowerShell Gallery"
    }
    # Check for MSI (Windows Installer)
    elseif (Get-Command msiexec -ErrorAction SilentlyContinue) {
        $packageManager = "MSI"
    }
    # Check for Windows Store
    elseif (Get-Command Get-AppxPackage -ErrorAction SilentlyContinue) {
        $packageManager = "Windows Store"
    }
    else {
        $packageManager = "Unknown"
    }
    
    return $packageManager
}

# Main execution
$packageManager = Detect-PackageManager
Write-Output $packageManager
