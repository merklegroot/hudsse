#!/bin/bash

# Script to detect package manager on Linux systems

# Function to detect package manager
detect_package_manager() {
    local package_manager=""
    
    # Check for APT (Debian/Ubuntu)
    if command -v apt >/dev/null 2>&1; then
        package_manager="APT"
    # Check for DNF (Fedora/RHEL 8+)
    elif command -v dnf >/dev/null 2>&1; then
        package_manager="DNF"
    # Check for YUM (RHEL/CentOS 7 and older)
    elif command -v yum >/dev/null 2>&1; then
        package_manager="YUM"
    # Check for Zypper (openSUSE/SLES)
    elif command -v zypper >/dev/null 2>&1; then
        package_manager="Zypper"
    # Check for Pacman (Arch Linux)
    elif command -v pacman >/dev/null 2>&1; then
        package_manager="Pacman"
    # Check for Portage (Gentoo)
    elif command -v emerge >/dev/null 2>&1; then
        package_manager="Portage"
    # Check for Nix (NixOS)
    elif command -v nix-env >/dev/null 2>&1; then
        package_manager="Nix"
    # Check for Snap (Universal packages)
    elif command -v snap >/dev/null 2>&1; then
        package_manager="Snap"
    # Check for Flatpak (Universal packages)
    elif command -v flatpak >/dev/null 2>&1; then
        package_manager="Flatpak"
    # Check for Homebrew (Linux)
    elif command -v brew >/dev/null 2>&1; then
        package_manager="Homebrew"
    # Check for AppImage (Universal packages)
    elif ls /usr/local/bin/*.AppImage >/dev/null 2>&1 || ls ~/.local/bin/*.AppImage >/dev/null 2>&1; then
        package_manager="AppImage"
    # Check for Conda (Python package manager)
    elif command -v conda >/dev/null 2>&1; then
        package_manager="Conda"
    # Check for Pip (Python package manager)
    elif command -v pip >/dev/null 2>&1 || command -v pip3 >/dev/null 2>&1; then
        package_manager="Pip"
    # Check for NPM (Node.js package manager)
    elif command -v npm >/dev/null 2>&1; then
        package_manager="NPM"
    # Check for Cargo (Rust package manager)
    elif command -v cargo >/dev/null 2>&1; then
        package_manager="Cargo"
    # Check for Go modules
    elif command -v go >/dev/null 2>&1; then
        package_manager="Go Modules"
    # Check for Composer (PHP package manager)
    elif command -v composer >/dev/null 2>&1; then
        package_manager="Composer"
    # Check for Gem (Ruby package manager)
    elif command -v gem >/dev/null 2>&1; then
        package_manager="Gem"
    # Check for NuGet (.NET package manager)
    elif command -v nuget >/dev/null 2>&1 || command -v dotnet >/dev/null 2>&1; then
        package_manager="NuGet"
    # Check for Maven (Java package manager)
    elif command -v mvn >/dev/null 2>&1; then
        package_manager="Maven"
    # Check for Gradle (Java package manager)
    elif command -v gradle >/dev/null 2>&1; then
        package_manager="Gradle"
    # Check for Podman (Container package manager)
    elif command -v podman >/dev/null 2>&1; then
        package_manager="Podman"
    # Check for Docker (Container package manager)
    elif command -v docker >/dev/null 2>&1; then
        package_manager="Docker"
    else
        package_manager="Unknown"
    fi
    
    echo "$package_manager"
}

# Main execution
package_manager=$(detect_package_manager)
echo "$package_manager"
