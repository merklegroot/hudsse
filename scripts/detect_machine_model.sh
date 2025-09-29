#!/bin/bash

# Script to detect machine model (product name)
# Reads from DMI (Desktop Management Interface) files

echo "Reading machine model..."
echo "================================"

# Read system product name
echo ""
echo "Machine Model:"
echo "File: /sys/class/dmi/id/product_name"
if [ -r "/sys/class/dmi/id/product_name" ]; then
    if content=$(cat "/sys/class/dmi/id/product_name" 2>/dev/null); then
        echo "$content"
    else
        echo "Error: Failed to read file content"
    fi
else
    echo "Error: File does not exist or is not readable"
fi
echo "--------------------------------"

echo ""
echo "Machine model detection completed."
