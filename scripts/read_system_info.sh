#!/bin/bash

# Script to read system information from various files
# Continues reading even if individual files fail

# When possible, this script shouldn't involve complex logic.
# Most of the parsing should be done outside of here.

echo "Reading system information..."
echo "================================"

# Get IP address (primary IPv4 only)
echo ""
echo "IP Address:"
echo "hostname -I | awk '{print \$1}'"
hostname -I | awk '{print $1}'
echo "--------------------------------"

# Function to safely read a file
read_file_safely() {
    local file_path="$1"
    local description="$2"
    
    echo ""
    echo "$description:"
    echo "File: $file_path"
    
    if [ -r "$file_path" ]; then
        if content=$(cat "$file_path" 2>/dev/null); then
            echo "$content"
        else
            echo "Error: Failed to read file content"
        fi
    else
        echo "Error: File does not exist or is not readable"
    fi
    echo "--------------------------------"
}

# Get kernel version (human readable)
echo ""
echo "Kernel Version:"
echo "uname -r"
uname -r
echo "--------------------------------"

# Get CPU model
echo ""
echo "CPU Model:"
echo "lscpu | grep 'Model name' | cut -d':' -f2 | xargs"
lscpu | grep "Model name" | cut -d':' -f2 | xargs
echo "--------------------------------"

# Get base distro
echo ""
echo "Base Distro:"
echo "cat /etc/os-release | grep 'PRETTY_NAME' | cut -d'=' -f2 | tr -d '\"'"
cat /etc/os-release | grep "PRETTY_NAME" | cut -d'=' -f2 | tr -d '"'
echo "--------------------------------"

# Get desktop environment
echo ""
echo "Desktop Environment:"
echo "echo \$XDG_CURRENT_DESKTOP"
echo $XDG_CURRENT_DESKTOP
echo "--------------------------------"

# Read /sys/class/dmi/id/product_name (system product name)
read_file_safely "/sys/class/dmi/id/product_name" "System Product Name"

# Read /sys/class/dmi/id/board_name (motherboard name)
read_file_safely "/sys/class/dmi/id/board_name" "Motherboard Name"

echo ""
echo "System information reading completed."
