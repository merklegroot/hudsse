'use client';

import { useEffect, useState } from 'react';
import { usePackageStore } from '@/store/packageStore';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useSse } from '@/contexts/SseContext';
import { MachineStateViewer } from '@/components/MachineStateViewer';
import SystemDetailField from '@/components/SystemDetailField';

export function PackagePageClient() {
  const packageState = usePackageStore((state) => state.packageState);
  const isMobile = useIsMobile();
  const { startSseStream, isLoading } = useSse();
  const [ isFirst, setIsFirst ] = useState<boolean>(true);

  // Automatically fetch package info when the page loads if it hasn't been fetched yet
  useEffect(() => {
    if (!isFirst)
      return;

    setIsFirst(false);

    // Check if we haven't tried detecting package manager yet
    const hasTriedDetectingPackageManager = packageState?.hasTriedDetectingPackageManager ?? false;
    
    if (!hasTriedDetectingPackageManager && !isLoading) {
      // Create EventSource for package info endpoint
      const createEventSource = () => new EventSource('/api/sse/package/info');
      
      // Start the SSE stream
      startSseStream(createEventSource);
    }
  }, [packageState?.hasTriedDetectingPackageManager, isLoading, startSseStream]);

  // Package-related data items
  const packageItems: Array<{
    label: string;
    value: string;
    showRefreshButton?: boolean;
    onRefresh?: () => void;
  }> = [
    { label: 'Package Manager', value: packageState?.packageManager || '' },
    { 
      label: 'Package Formats', 
      value: packageState?.packageFormats && packageState.packageFormats.length > 0
        ? (packageState.packageFormats.length === 1 
            ? packageState.packageFormats[0] 
            : packageState.packageFormats.join(', '))
        : 'Loading...'
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
