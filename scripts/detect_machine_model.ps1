# PowerShell script to detect machine model (product name)
# Uses WMI to get system product name

Write-Host "Reading machine model..."
Write-Host "================================"

# Read system product name
Write-Host ""
Write-Host "Get-WmiObject -Class Win32_ComputerSystem | Select-Object -ExpandProperty Model"
Write-Host "Machine Model:"
try {
    $productName = Get-WmiObject -Class Win32_ComputerSystem | Select-Object -ExpandProperty Model
    if ($productName) {
        Write-Host $productName
    } else {
        Write-Host "Error: No product name found"
    }
} catch {
    Write-Host "Error: Failed to get system product name"
}
Write-Host "--------------------------------"

Write-Host ""
Write-Host "Machine model detection completed."
