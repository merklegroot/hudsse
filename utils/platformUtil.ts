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

export const platformUtil = {
    detectPlatform
};