# Script to read system information from various files
# Continues reading even if individual files fail

# When possible, this script shouldn't involve complex logic.
# Most of the parsing should be done outside of here.

Write-Host "Reading system information..."
Write-Host "================================"

# Get hostname
Write-Host ""
Write-Host "Hostname:"
Write-Host "GetHostName()"
[System.Net.Dns]::GetHostName()
Write-Host "--------------------------------"
