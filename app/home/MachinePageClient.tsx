'use client';

import { useEffect, useState } from 'react';
import { useMachineStore } from '@/store/machineStore';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useSse } from '@/contexts/SseContext';
import SseHostnameButton from '@/components/SseHostnameButton';
import SseMachineInfoButton from '@/components/SseMachineInfoButton';
import { MachineStateViewer } from '@/components/MachineStateViewer';
import SystemDetailField from '@/components/SystemDetailField';
import { getDistroFlavor } from '@/utils/distroUtil';
import { OsTypeControl } from './controls/OsTypeControl';
import { platformType } from '@/utils/platformUtil';
import { virtualizationUtil, VirtualizationType } from '@/utils/virtualizationUtil';
import VirtualizationIcon from '@/components/VirtualizationIcon';

export function MachinePageControl() {
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

  const virtualization = machineState?.virtualization !== null && machineState?.virtualization !== undefined 
    ? virtualizationUtil.getVirtualizationFriendlyName(machineState.virtualization as any)
    : '';

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

  // Data items matching hudapp structure, using machineStore data where available
  const infoItems: Array<{
    label: string;
    value: string;
    showRefreshButton?: boolean;
    onRefresh?: () => void;
    icon?: React.ReactNode;
  }> = [
    { label: 'Machine Name', value: machineState?.hostname || '' },
    { label: 'Local IP Address', value: machineState?.ipAddress || '' },
    { 
      label: 'Machine Model', 
      value: machineState?.systemInfo?.productName || '', 
      showRefreshButton: true,
      onRefresh: () => {
        // Create EventSource for machine model endpoint
        const createEventSource = () => new EventSource('/api/sse/machine/model');
        
        // Start the SSE stream
        startSseStream(createEventSource);
      }
    },
    { label: 'CPU Model', value: machineState?.cpuModel || '' },
    { label: 'Distro Flavor', value: machineState?.distroFlavor || '' },
    { label: 'Kernel Version', value: machineState?.kernelVersion || '' },
    { label: 'Motherboard', value: machineState?.motherboardName || '' },
    { label: 'Package Manager', value: machineState?.packageManager || '' },
    { 
      label: 'Package Formats', 
      value: packageFormats.length === 1 ? packageFormats[0] : packageFormats.join(', ')
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none p-6">
        <h1 className="text-4xl font-bold mb-8">Machine Information</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="space-x-4 mb-4">    
            <SseHostnameButton />
            <SseMachineInfoButton />
          </div>
          
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-8">
              {/* Left Panel - OS Type and Virtualization */}
              <div className="flex-shrink-0 w-80">
                <div className="bg-gray-50 rounded-lg p-8 text-center space-y-8">
                  {/* OS Type */}
                  <OsTypeControl osType={machineState?.platform as platformType} />
                  
                  {/* Virtualization */}
                  <div className="flex flex-col items-center space-y-4">
                    <VirtualizationIcon 
                      virtualizationType={machineState?.virtualization as VirtualizationType || VirtualizationType.UNKNOWN} 
                      className="w-20 h-20" 
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Virtualization</h3>
                      <p className="text-lg font-semibold text-gray-900 text-center leading-tight">{virtualization || 'Unknown'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Panel - System Information */}
              <div className="flex-1">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">System Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {infoItems.map((item, index) => (
                      <SystemDetailField
                        key={index}
                        label={item.label}
                        value={item.value || 'Loading...'}
                        showRefreshButton={item.showRefreshButton}
                        onRefresh={item.onRefresh}
                        icon={item.icon}
                      />
                    ))}
                  </div>
                </div>
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
