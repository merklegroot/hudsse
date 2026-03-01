'use client';

import { useEffect, useState } from 'react';
import { useDiskStore } from '@/store/diskStore';
import { useSse } from '@/contexts/SseContext';
import SseDiskInfoButton from '@/components/SseDiskInfoButton';
import SystemDetailField from '@/components/SystemDetailField';

export function DiskPageClient() {
  const { diskState } = useDiskStore();
  const { startSseStream, isLoading } = useSse();
  const [isFirst, setIsFirst] = useState<boolean>(true);

  useEffect(() => {
    if (!isFirst)
      return;

    setIsFirst(false);

    const hasTriedDetectingDiskInfo = diskState?.hasTriedDetectingDiskInfo ?? false;

    if (!hasTriedDetectingDiskInfo && !isLoading) {
      const createEventSource = () => new EventSource('/api/sse/disk/info');
      startSseStream(createEventSource);
    }
  }, [diskState?.hasTriedDetectingDiskInfo, isLoading, startSseStream]);

  const refreshDiskInfo = () => {
    const createEventSource = () => new EventSource('/api/sse/disk/info');
    startSseStream(createEventSource);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none p-6">
        <h1 className="text-4xl font-bold mb-8">Disk Information</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="space-x-4 mb-4">
            <SseDiskInfoButton />
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Physical Disks */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Physical Disks</h2>
              {diskState?.diskInfo?.physicalDisks && diskState.diskInfo.physicalDisks.length > 0 ? (
                <div className="space-y-4">
                  {diskState.diskInfo.physicalDisks.map((disk, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{disk.device}</h3>
                        <div className="flex gap-2">
                          {disk.type !== 'Unknown' && (
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              disk.type === 'SSD' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {disk.type}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <SystemDetailField label="Size" value={disk.size} />
                        <SystemDetailField label="Model" value={disk.model} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No physical disk information available</p>
              )}
            </div>

            {/* Disk Usage (Partitions/Mounts) */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Disk Usage (Partitions)</h2>
              {diskState?.diskInfo?.disks && diskState.diskInfo.disks.length > 0 ? (
                <div className="space-y-4">
                  {diskState.diskInfo.disks.map((disk, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{disk.mount}</h3>
                        <span className="text-sm text-gray-600">{disk.filesystem}</span>
                      </div>
                      
                      {/* Usage bar */}
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                        <div 
                          className={`h-3 rounded-full ${
                            disk.usedPercent > 90 ? 'bg-red-500' : 
                            disk.usedPercent > 75 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${disk.usedPercent}%` }}
                        ></div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <SystemDetailField label="Total" value={disk.total} />
                        <SystemDetailField label="Used" value={disk.used} />
                        <SystemDetailField label="Available" value={disk.available} />
                        <SystemDetailField label="Usage" value={`${disk.usedPercent}%`} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No disk usage information available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
