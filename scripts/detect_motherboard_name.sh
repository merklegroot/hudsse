#!/bin/bash

# Script to detect motherboard name
# Reads from DMI (Desktop Management Interface) files

echo "Reading motherboard information..."
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

# Read motherboard name
read_file_safely "/sys/class/dmi/id/board_name" "Motherboard Name"

echo ""
echo "Motherboard detection completed."
