# PowerShell script to detect motherboard name
# Uses WMI to get motherboard information

Write-Host "Reading motherboard information..."
Write-Host "================================"

try {
    # Get motherboard name
    Write-Host ""
    Write-Host "Get-WmiObject -Class Win32_BaseBoard | Select-Object -ExpandProperty Product"
    Write-Host "Motherboard Name:"    
    $motherboardName = Get-WmiObject -Class Win32_BaseBoard | Select-Object -ExpandProperty Product
    Write-Host $motherboardName
    Write-Host "--------------------------------"
} catch {
    Write-Host "Error: Failed to get motherboard name"
    Write-Host "--------------------------------"
}

Write-Host ""
Write-Host "Motherboard detection completed."
