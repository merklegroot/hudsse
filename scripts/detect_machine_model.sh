#!/bin/bash

# Script to detect machine model information
# Reads from DMI (Desktop Management Interface) files

echo "Reading machine model information..."
echo "================================"

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

# Read system product name
read_file_safely "/sys/class/dmi/id/product_name" "System Product Name"

# Read motherboard name
read_file_safely "/sys/class/dmi/id/board_name" "Motherboard Name"

# Read system manufacturer
read_file_safely "/sys/class/dmi/id/sys_vendor" "System Manufacturer"

echo ""
echo "Machine model detection completed."
