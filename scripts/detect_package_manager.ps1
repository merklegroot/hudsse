# Script to detect system-level package managers on Windows systems
# Focuses on core system-level package managers: DISM, Winget, and OneGet
# Supports multiple concurrent package managers

# Function to detect system-level package managers
function Detect-PackageManagers {
    $packageManagers = @()
    
    # Check for DISM (Deployment Image Servicing and Management)
    if (Get-Command dism -ErrorAction SilentlyContinue) {
        $packageManagers += "DISM"
    }
    
    # Check for Winget (Windows Package Manager)
    if (Get-Command winget -ErrorAction SilentlyContinue) {
        $packageManagers += "Winget"
    }
    
    # Check for OneGet (PackageManagement provider)
    if (Get-Command Get-PackageProvider -ErrorAction SilentlyContinue) {
        $packageManagers += "OneGet"
    }
    
    # If no package managers found, return Unknown
    if ($packageManagers.Count -eq 0) {
        return "Unknown"
    } else {
        # Join array elements with comma and space
        return ($packageManagers -join ", ")
    }
}

# Main execution
$packageManagers = Detect-PackageManagers
Write-Output $packageManagers
