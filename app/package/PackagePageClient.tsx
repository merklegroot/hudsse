'use client';

import { useEffect, useState } from 'react';
import { useMachineStore } from '@/store/machineStore';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useSse } from '@/contexts/SseContext';
import { MachineStateViewer } from '@/components/MachineStateViewer';
import SystemDetailField from '@/components/SystemDetailField';

export function PackagePageClient() {
  const machineState = useMachineStore((state) => state.machineState);
  const isMobile = useIsMobile();
  const { startSseStream, isLoading } = useSse();
  const [ isFirst, setIsFirst ] = useState<boolean>(true);

  // Automatically fetch machine info when the page loads if it hasn't been fetched yet
  useEffect(() => {
    if (!isFirst)
      return;

    setIsFirst(false);

    // Check if we haven't tried detecting system info yet
    const hasTriedDetectingSystemInfo = machineState?.hasTriedDetectingSystemInfo ?? false;
    
    if (!hasTriedDetectingSystemInfo && !isLoading) {
      // Create EventSource for machine info endpoint
      const createEventSource = () => new EventSource('/api/sse/machine/info');
      
      // Start the SSE stream
      startSseStream(createEventSource);
    }
  }, [machineState?.hasTriedDetectingSystemInfo, isLoading, startSseStream]);

  // Map package managers to their corresponding package formats
  const mapPackageManagerToFormat = (packageManager: string): string => {
    switch (packageManager.trim().toUpperCase()) {
      case 'APT':
        return 'DEB';
      case 'DNF':
      case 'YUM':
        return 'RPM';
      case 'PACMAN':
        return 'TAR.XZ';
      case 'PORTAGE':
        return 'EBUILD';
      case 'NIX':
        return 'NIX';
      case 'HOMEBREW':
        return 'BOTTLE';
      case 'APK':
        return 'APK';
      case 'XBPS':
        return 'XBPS';
      case 'PKG':
        return 'PKG';
      case 'PORTS':
        return 'PORTS';
      case 'DISM':
        return 'MSI';
      case 'WINGET':
        return 'APPX';
      case 'ONEGET':
        return 'NUGET';
      case 'ZYPPER':
        return 'RPM';
      default:
        return 'Unknown';
    }
  };

  // Parse package formats from package manager string
  const parsePackageFormats = (packageManager: string | null | undefined): string[] => {
    if (!packageManager || packageManager === 'Unknown' || packageManager.trim() === '') {
      return ['Unknown'];
    }
    
    const managerList = packageManager.split(',').map(manager => manager.trim());
    const formatList = managerList.map(manager => mapPackageManagerToFormat(manager));
    return formatList.length > 0 ? formatList : ['Unknown'];
  };

  const packageFormats = parsePackageFormats(machineState?.packageManager);

  // Package-related data items
  const packageItems: Array<{
    label: string;
    value: string;
    showRefreshButton?: boolean;
    onRefresh?: () => void;
  }> = [
    { label: 'Package Manager', value: machineState?.packageManager || '' },
    { 
      label: 'Package Formats', 
      value: packageFormats.length === 1 ? packageFormats[0] : packageFormats.join(', ')
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none p-6">
        <h1 className="text-4xl font-bold mb-8">Package Management</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Package Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packageItems.map((item, index) => (
                  <SystemDetailField
                    key={index}
                    label={item.label}
                    value={item.value || 'Loading...'}
                    showRefreshButton={item.showRefreshButton}
                    onRefresh={item.onRefresh}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <MachineStateViewer />
          </div>
        </div>
      </div>
    </div>
  );
}
