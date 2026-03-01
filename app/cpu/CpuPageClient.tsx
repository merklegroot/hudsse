'use client';

import { useEffect, useState } from 'react';
import { useMachineStore } from '@/store/machineStore';
import { useSse } from '@/contexts/SseContext';
import SystemDetailField from '@/components/SystemDetailField';
import SseCpuInfoButton from '@/components/SseCpuInfoButton';

export function CpuPageClient() {
  const machineState = useMachineStore((state) => state.machineState);
  const { startSseStream, isLoading } = useSse();
  const [isFirst, setIsFirst] = useState<boolean>(true);

  // Automatically fetch CPU info when the page loads if it hasn't been fetched yet
  useEffect(() => {
    if (!isFirst)
      return;

    setIsFirst(false);

    // Check if we haven't tried detecting CPU model yet
    const hasTriedDetectingCpuModel = machineState?.hasTriedDetectingCpuModel ?? false;
    
    if (!hasTriedDetectingCpuModel && !isLoading) {
      // Create EventSource for CPU info endpoint
      const createEventSource = () => new EventSource('/api/sse/cpu/info');
      
      // Start the SSE stream
      startSseStream(createEventSource);
    }
  }, [machineState?.hasTriedDetectingCpuModel, isLoading, startSseStream]);

  const refreshCpuInfo = () => {
    const createEventSource = () => new EventSource('/api/sse/cpu/info');
    startSseStream(createEventSource);
  };

  // CPU information items
  const cpuInfoItems: Array<{
    label: string;
    value: string;
    showRefreshButton?: boolean;
    onRefresh?: () => void;
    icon?: React.ReactNode;
  }> = [
    { 
      label: 'Vendor', 
      value: machineState?.cpuVendor || 'Loading...',
      showRefreshButton: true,
      onRefresh: refreshCpuInfo
    },
    { 
      label: 'CPU Model', 
      value: machineState?.cpuModel || 'Loading...',
      showRefreshButton: true,
      onRefresh: refreshCpuInfo
    },
    { 
      label: 'CPU Cores', 
      value: machineState?.cpuCores !== null && machineState?.cpuCores !== undefined 
        ? machineState.cpuCores.toString() 
        : 'Loading...',
      showRefreshButton: true,
      onRefresh: refreshCpuInfo
    },
    { 
      label: 'Architecture', 
      value: machineState?.cpuArchitecture || 'Loading...',
      showRefreshButton: true,
      onRefresh: refreshCpuInfo
    },
    { 
      label: 'CPU Frequency', 
      value: machineState?.cpuMhz !== null && machineState?.cpuMhz !== undefined 
        ? `${machineState.cpuMhz} MHz`
        : 'Loading...',
      showRefreshButton: true,
      onRefresh: refreshCpuInfo
    },
    { 
      label: 'Threads per Core', 
      value: machineState?.cpuThreadsPerCore !== null && machineState?.cpuThreadsPerCore !== undefined 
        ? machineState.cpuThreadsPerCore.toString() 
        : 'Loading...',
      showRefreshButton: true,
      onRefresh: refreshCpuInfo
    },
    { 
      label: 'Cores per Socket', 
      value: machineState?.cpuCoresPerSocket !== null && machineState?.cpuCoresPerSocket !== undefined 
        ? machineState.cpuCoresPerSocket.toString() 
        : 'Loading...',
      showRefreshButton: true,
      onRefresh: refreshCpuInfo
    },
    { 
      label: 'Sockets', 
      value: machineState?.cpuSockets !== null && machineState?.cpuSockets !== undefined 
        ? machineState.cpuSockets.toString() 
        : 'Loading...',
      showRefreshButton: true,
      onRefresh: refreshCpuInfo
    },
    { 
      label: 'Virtualization', 
      value: machineState?.cpuVirtualization || 'Loading...',
      showRefreshButton: true,
      onRefresh: refreshCpuInfo
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none p-6">
        <h1 className="text-4xl font-bold mb-8">CPU Information</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="space-x-4 mb-4">    
            <SseCpuInfoButton />
          </div>
          
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">CPU Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cpuInfoItems.map((item, index) => (
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
    </div>
  );
}
