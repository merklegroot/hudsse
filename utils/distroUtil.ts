/**
 * Utility functions for determining Linux distribution flavors
 */

export function getDistroFlavor(baseDistro: string | null, desktopEnvironment: string | null): string {
    if (!baseDistro) {
        return 'Unknown';
    }

    // If no desktop environment detected, return just the base distro
    if (!desktopEnvironment) {
        return baseDistro;
    }

    // For Ubuntu-based distributions, determine the flavor based on desktop environment
    if (baseDistro.toLowerCase().includes('ubuntu')) {
        switch (desktopEnvironment) {
            case 'KDE':
                return 'Kubuntu';
            case 'GNOME':
                return 'Ubuntu';
            case 'XFCE':
                return 'Xubuntu';
            case 'MATE':
                return 'Ubuntu MATE';
            case 'Unity':
                return 'Ubuntu';
            case 'LXQt':
                return 'Lubuntu';
            case 'Budgie':
                return 'Ubuntu Budgie';
            default:
                return `${desktopEnvironment} (${baseDistro})`;
        }
    }

    // For other distributions, show desktop environment with base distro
    return `${desktopEnvironment} (${baseDistro})`;
}

