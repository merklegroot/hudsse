#!/bin/bash

# Script to detect Linux distribution flavor using deterministic methods

# Function to detect distro flavor using deterministic files
detect_distro_flavor_deterministic() {
    local flavor=""
    
    # Method 1: Check for explicit flavor files (most reliable)
    if [ -f "/etc/xdg/kcm-about-distrorc" ]; then
        flavor=$(grep "^Name=" /etc/xdg/kcm-about-distrorc 2>/dev/null | cut -d'=' -f2)
        if [ -n "$flavor" ]; then
            echo "$flavor"
            return
        fi
    fi
    
    # Method 2: Check system-wide flavor files
    if [ -f "/usr/share/kubuntu-default-settings/kf5-settings/kcm-about-distrorc" ]; then
        flavor=$(grep "^Name=" /usr/share/kubuntu-default-settings/kf5-settings/kcm-about-distrorc 2>/dev/null | cut -d'=' -f2)
        if [ -n "$flavor" ]; then
            echo "$flavor"
            return
        fi
    fi
    
    # Method 3: Check for flavor-specific packages
    if dpkg -l | grep -q "^ii.*kubuntu-desktop"; then
        echo "Kubuntu"
        return
    elif dpkg -l | grep -q "^ii.*xubuntu-desktop"; then
        echo "Xubuntu"
        return
    elif dpkg -l | grep -q "^ii.*ubuntu-mate-desktop"; then
        echo "Ubuntu MATE"
        return
    elif dpkg -l | grep -q "^ii.*lubuntu-desktop"; then
        echo "Lubuntu"
        return
    elif dpkg -l | grep -q "^ii.*ubuntu-budgie-desktop"; then
        echo "Ubuntu Budgie"
        return
    fi
    
    # Method 4: Check for flavor-specific directories
    if [ -d "/usr/share/kubuntu-default-settings" ]; then
        echo "Kubuntu"
        return
    elif [ -d "/usr/share/xubuntu-default-settings" ]; then
        echo "Xubuntu"
        return
    elif [ -d "/usr/share/ubuntu-mate-default-settings" ]; then
        echo "Ubuntu MATE"
        return
    elif [ -d "/usr/share/lubuntu-default-settings" ]; then
        echo "Lubuntu"
        return
    elif [ -d "/usr/share/ubuntu-budgie-default-settings" ]; then
        echo "Ubuntu Budgie"
        return
    fi
    
    echo ""
}

# Function to get base distribution
get_base_distro() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        echo "$PRETTY_NAME"
    else
        echo "Unknown"
    fi
}

# Function to detect desktop environment (fallback method)
detect_desktop_environment() {
    local de=""
    
    # Check for KDE/Plasma
    if command -v plasmashell >/dev/null 2>&1 || pgrep -x "plasmashell" >/dev/null 2>&1; then
        de="KDE"
    elif command -v kwin >/dev/null 2>&1 || pgrep -x "kwin" >/dev/null 2>&1; then
        de="KDE"
    elif [ -n "$KDE_SESSION_VERSION" ]; then
        de="KDE"
    elif command -v dolphin >/dev/null 2>&1; then
        de="KDE"
    # Check for GNOME
    elif command -v gnome-shell >/dev/null 2>&1 || pgrep -x "gnome-shell" >/dev/null 2>&1; then
        de="GNOME"
    # Check for XFCE
    elif command -v xfce4-session >/dev/null 2>&1 || pgrep -x "xfce4-session" >/dev/null 2>&1; then
        de="XFCE"
    # Check for MATE
    elif command -v mate-session >/dev/null 2>&1 || pgrep -x "mate-session" >/dev/null 2>&1; then
        de="MATE"
    # Check for LXQt
    elif command -v lxqt-session >/dev/null 2>&1 || pgrep -x "lxqt-session" >/dev/null 2>&1; then
        de="LXQt"
    # Check for Budgie
    elif command -v budgie-desktop >/dev/null 2>&1 || pgrep -x "budgie-desktop" >/dev/null 2>&1; then
        de="Budgie"
    # Check for Cinnamon
    elif command -v cinnamon-session >/dev/null 2>&1 || pgrep -x "cinnamon-session" >/dev/null 2>&1; then
        de="Cinnamon"
    # Fallback to environment variables
    elif [ -n "$XDG_CURRENT_DESKTOP" ]; then
        de="$XDG_CURRENT_DESKTOP"
    elif [ -n "$DESKTOP_SESSION" ]; then
        de="$DESKTOP_SESSION"
    else
        de="Unknown"
    fi
    
    echo "$de"
}

# Function to determine distro flavor (fallback method)
get_distro_flavor_fallback() {
    local base_distro="$1"
    local desktop_env="$2"
    
    # Convert to lowercase for comparison
    local base_lower=$(echo "$base_distro" | tr '[:upper:]' '[:lower:]')
    local de_lower=$(echo "$desktop_env" | tr '[:upper:]' '[:lower:]')
    
    # For Ubuntu-based distributions
    if [[ "$base_lower" == *"ubuntu"* ]]; then
        case "$de_lower" in
            *"kde"*|*"plasma"*|*"kwin"*)
                echo "Kubuntu"
                ;;
            *"gnome"*|*"ubuntu"*)
                echo "Ubuntu"
                ;;
            *"xfce"*)
                echo "Xubuntu"
                ;;
            *"mate"*)
                echo "Ubuntu MATE"
                ;;
            *"lxqt"*)
                echo "Lubuntu"
                ;;
            *"budgie"*)
                echo "Ubuntu Budgie"
                ;;
            *"cinnamon"*)
                echo "Ubuntu Cinnamon"
                ;;
            *)
                echo "Ubuntu ($desktop_env)"
                ;;
        esac
    # For other distributions
    else
        if [ "$desktop_env" = "Unknown" ]; then
            echo "$base_distro"
        else
            echo "$desktop_env ($base_distro)"
        fi
    fi
}

# Main execution
# Try deterministic method first
distro_flavor=$(detect_distro_flavor_deterministic)

# If deterministic method didn't find anything, use fallback
if [ -z "$distro_flavor" ]; then
    base_distro=$(get_base_distro)
    desktop_env=$(detect_desktop_environment)
    distro_flavor=$(get_distro_flavor_fallback "$base_distro" "$desktop_env")
fi

echo "$distro_flavor"
