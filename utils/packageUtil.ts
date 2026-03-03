/**
 * Utility functions for package manager and package format operations
 */

function mapPackageManagerToFormat(packageManager: string): string {
  const trimmed = packageManager.trim().toUpperCase();
  
  if (trimmed === 'APT') return 'DEB';
  if (trimmed === 'DNF' || trimmed === 'YUM') return 'RPM';
  if (trimmed === 'PACMAN') return 'TAR.XZ';
  if (trimmed === 'PORTAGE') return 'EBUILD';
  if (trimmed === 'NIX') return 'NIX';
  if (trimmed === 'HOMEBREW') return 'BOTTLE';
  if (trimmed === 'APK') return 'APK';
  if (trimmed === 'XBPS') return 'XBPS';
  if (trimmed === 'PKG') return 'PKG';
  if (trimmed === 'PORTS') return 'PORTS';
  if (trimmed === 'DISM') return 'MSI';
  if (trimmed === 'WINGET') return 'APPX';
  if (trimmed === 'ONEGET') return 'NUGET';
  if (trimmed === 'ZYPPER') return 'RPM';
  
  return 'Unknown';
}

function parsePackageFormats(packageManager: string | null | undefined): string[] {
  if (!packageManager || packageManager === 'Unknown' || packageManager.trim() === '') {
    return ['Unknown'];
  }
  
  const managerList = packageManager.split(',').map(manager => manager.trim());
  const formatList = managerList.map(manager => mapPackageManagerToFormat(manager));
  return formatList.length > 0 ? formatList : ['Unknown'];
}

export const packageUtil = {
  mapPackageManagerToFormat,
  parsePackageFormats
};
