#!/bin/bash

# Script to detect system-level package managers on Linux systems
# Focuses on package managers that operate at the system level (like APT, DNF, YUM, etc.)
# Supports multiple concurrent package managers

# Function to detect system-level package managers
detect_package_managers() {
    local package_managers=()
    
    # Check for APT (Debian/Ubuntu)
    if command -v apt >/dev/null 2>&1; then
        package_managers+=("APT")
    fi
    
    # Check for DNF (Fedora/RHEL 8+)
    if command -v dnf >/dev/null 2>&1; then
        package_managers+=("DNF")
    fi
    
    # Check for YUM (RHEL/CentOS 7 and older)
    if command -v yum >/dev/null 2>&1; then
        package_managers+=("YUM")
    fi
    
    # Check for Zypper (openSUSE/SLES)
    if command -v zypper >/dev/null 2>&1; then
        package_managers+=("Zypper")
    fi
    
    # Check for Pacman (Arch Linux)
    if command -v pacman >/dev/null 2>&1; then
        package_managers+=("Pacman")
    fi
    
    # Check for Portage (Gentoo)
    if command -v emerge >/dev/null 2>&1; then
        package_managers+=("Portage")
    fi
    
    # Check for Nix (NixOS)
    if command -v nix-env >/dev/null 2>&1; then
        package_managers+=("Nix")
    fi
    
    # Check for Homebrew (Linux)
    if command -v brew >/dev/null 2>&1; then
        package_managers+=("Homebrew")
    fi
    
    # Check for APK (Alpine Linux)
    if command -v apk >/dev/null 2>&1; then
        package_managers+=("APK")
    fi
    
    # Check for XBPS (Void Linux)
    if command -v xbps-install >/dev/null 2>&1; then
        package_managers+=("XBPS")
    fi
    
    # Check for Pkg (FreeBSD)
    if command -v pkg >/dev/null 2>&1; then
        package_managers+=("Pkg")
    fi
    
    # Check for Ports (FreeBSD)
    if command -v ports >/dev/null 2>&1 || [ -d "/usr/ports" ]; then
        package_managers+=("Ports")
    fi
    
    # If no package managers found, return Unknown
    if [ ${#package_managers[@]} -eq 0 ]; then
        echo "Unknown"
    else
        # Join array elements with comma and space
        printf '%s, ' "${package_managers[@]}" | sed 's/, $//'
    fi
}

# Main execution
package_managers=$(detect_package_managers)
echo "$package_managers"
