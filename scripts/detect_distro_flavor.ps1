# Script to detect Windows distribution flavor

# Get Windows version information
$osInfo = Get-WmiObject -Class Win32_OperatingSystem
$osName = $osInfo.Caption
$osVersion = $osInfo.Version

# Determine Windows flavor based on version and edition
if ($osName -like "*Windows 11*") {
    if ($osName -like "*Pro*") {
        $flavor = "Windows 11 Pro"
    } elseif ($osName -like "*Home*") {
        $flavor = "Windows 11 Home"
    } elseif ($osName -like "*Enterprise*") {
        $flavor = "Windows 11 Enterprise"
    } else {
        $flavor = "Windows 11"
    }
} elseif ($osName -like "*Windows 10*") {
    if ($osName -like "*Pro*") {
        $flavor = "Windows 10 Pro"
    } elseif ($osName -like "*Home*") {
        $flavor = "Windows 10 Home"
    } elseif ($osName -like "*Enterprise*") {
        $flavor = "Windows 10 Enterprise"
    } else {
        $flavor = "Windows 10"
    }
} elseif ($osName -like "*Windows Server*") {
    $flavor = $osName
} else {
    $flavor = $osName
}

Write-Output $flavor
