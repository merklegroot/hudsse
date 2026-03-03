#!/bin/bash

# Script to detect package repository sources for various package managers

detect_repositories() {
    local repos=()
    
    # APT (Debian/Ubuntu)
    if command -v apt >/dev/null 2>&1; then
        if [ -f /etc/apt/sources.list ]; then
            while IFS= read -r line; do
                if [[ "$line" =~ ^[^#]*deb ]]; then
                    repos+=("APT: $line")
                fi
            done < /etc/apt/sources.list
        fi
        
        if [ -d /etc/apt/sources.list.d ]; then
            for file in /etc/apt/sources.list.d/*.list; do
                if [ -f "$file" ]; then
                    while IFS= read -r line; do
                        if [[ "$line" =~ ^[^#]*deb ]]; then
                            repos+=("APT: $line")
                        fi
                    done < "$file"
                fi
            done
        fi
    fi
    
    # DNF/YUM (RHEL/Fedora)
    if command -v dnf >/dev/null 2>&1 || command -v yum >/dev/null 2>&1; then
        if [ -d /etc/yum.repos.d ]; then
            for file in /etc/yum.repos.d/*.repo; do
                if [ -f "$file" ]; then
                    local repo_name=""
                    local baseurl=""
                    while IFS= read -r line; do
                        if [[ "$line" =~ ^\[.*\]$ ]]; then
                            repo_name="${line//[\[\]]/}"
                        elif [[ "$line" =~ ^baseurl= ]]; then
                            baseurl="${line#baseurl=}"
                            if [ -n "$repo_name" ] && [ -n "$baseurl" ]; then
                                repos+=("DNF/YUM: [$repo_name] $baseurl")
                            fi
                        fi
                    done < "$file"
                fi
            done
        fi
    fi
    
    # Pacman (Arch Linux)
    if command -v pacman >/dev/null 2>&1; then
        if [ -f /etc/pacman.conf ]; then
            local current_section=""
            while IFS= read -r line; do
                if [[ "$line" =~ ^\[.*\]$ ]]; then
                    current_section="${line//[\[\]]/}"
                    if [[ "$current_section" != "options" ]]; then
                        repos+=("Pacman: [$current_section]")
                    fi
                elif [[ "$line" =~ ^Server= ]] && [[ "$current_section" != "options" ]]; then
                    repos+=("Pacman: $line")
                fi
            done < /etc/pacman.conf
            
            if [ -d /etc/pacman.d ]; then
                for file in /etc/pacman.d/*.conf; do
                    if [ -f "$file" ]; then
                        while IFS= read -r line; do
                            if [[ "$line" =~ ^Server= ]]; then
                                repos+=("Pacman: $line")
                            fi
                        done < "$file"
                    fi
                done
            fi
        fi
    fi
    
    # Zypper (openSUSE)
    if command -v zypper >/dev/null 2>&1; then
        while IFS= read -r line; do
            if [[ "$line" =~ ^[0-9] ]]; then
                repos+=("Zypper: $line")
            fi
        done < <(zypper repos 2>/dev/null)
    fi
    
    # APK (Alpine)
    if command -v apk >/dev/null 2>&1; then
        if [ -f /etc/apk/repositories ]; then
            while IFS= read -r line; do
                if [[ ! "$line" =~ ^# ]] && [ -n "$line" ]; then
                    repos+=("APK: $line")
                fi
            done < /etc/apk/repositories
        fi
    fi
    
    # Output repositories
    if [ ${#repos[@]} -eq 0 ]; then
        echo "No repositories found"
    else
        for repo in "${repos[@]}"; do
            echo "$repo"
        done
    fi
}

detect_repositories
