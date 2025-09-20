import { platform } from "os";

export enum platformType {
    linux = 'linux',
    windows = 'windows',
    mac = 'mac',
    aix = 'aix',
    freebsd = 'freebsd',
    openbsd = 'openbsd',
    sunos = 'sunos',
    android = 'android',
    unknown = 'unknown'
}

function detectPlatform(): platformType {
    const plat = (platform() || '').trim().toLowerCase();

    if (plat === 'linux') return platformType.linux;
    if (plat === 'win32') return platformType.windows;
    if (plat === 'darwin') return platformType.mac;
    if (plat === 'aix') return platformType.aix;
    if (plat === 'freebsd') return platformType.freebsd;
    if (plat === 'openbsd') return platformType.openbsd;
    if (plat === 'sunos') return platformType.sunos;
    if (plat === 'android') return platformType.android;

    return platformType.unknown;
}

function formatText(text: string | undefined | null): string {
    if (!text) {
        return 'Unknown';
    }
    
    return text
        .split(/[-_\s]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

function getFriendlyPlatformName(osType: platformType | undefined | null): string {
    if (!osType) {
        return 'Unknown';
    }
    
    const platformNameLookup: Record<platformType, string> = {
        [platformType.linux]: 'Linux',
        [platformType.windows]: 'Windows',
        [platformType.mac]: 'macOS',
        [platformType.aix]: 'AIX',
        [platformType.freebsd]: 'FreeBSD',
        [platformType.openbsd]: 'OpenBSD',
        [platformType.sunos]: 'SunOS',
        [platformType.android]: 'Android',
        [platformType.unknown]: 'Unknown'
    };

    return platformNameLookup[osType] || formatText(osType);
}

export const platformUtil = {
    detectPlatform,
    getFriendlyPlatformName
};