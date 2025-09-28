# PowerShell script to detect machine model information
# Uses WMI to get system information

Write-Host "Reading machine model information..."
Write-Host "================================"

try {
    # Get system product name
    Write-Host ""
    Write-Host "System Product Name:"
    Write-Host "Get-WmiObject -Class Win32_ComputerSystem | Select-Object -ExpandProperty Model"
    $productName = Get-WmiObject -Class Win32_ComputerSystem | Select-Object -ExpandProperty Model
    Write-Host $productName
    Write-Host "--------------------------------"
} catch {
    Write-Host "Error: Failed to get system product name"
    Write-Host "--------------------------------"
}

try {
    # Get motherboard name
    Write-Host ""
    Write-Host "Motherboard Name:"
    Write-Host "Get-WmiObject -Class Win32_BaseBoard | Select-Object -ExpandProperty Product"
    $boardName = Get-WmiObject -Class Win32_BaseBoard | Select-Object -ExpandProperty Product
    Write-Host $boardName
    Write-Host "--------------------------------"
} catch {
    Write-Host "Error: Failed to get motherboard name"
    Write-Host "--------------------------------"
}

try {
    # Get system manufacturer
    Write-Host ""
    Write-Host "System Manufacturer:"
    Write-Host "Get-WmiObject -Class Win32_ComputerSystem | Select-Object -ExpandProperty Manufacturer"
    $manufacturer = Get-WmiObject -Class Win32_ComputerSystem | Select-Object -ExpandProperty Manufacturer
    Write-Host $manufacturer
    Write-Host "--------------------------------"
} catch {
    Write-Host "Error: Failed to get system manufacturer"
    Write-Host "--------------------------------"
}

Write-Host ""
Write-Host "Machine model detection completed."
