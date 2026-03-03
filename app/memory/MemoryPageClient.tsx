'use client';

import { useEffect, useState } from 'react';
import { useMemoryStore } from '@/store/memoryStore';
import { useSse } from '@/contexts/SseContext';
import SseMemoryInfoButton from '@/components/SseMemoryInfoButton';
import SystemDetailField from '@/components/SystemDetailField';

export function MemoryPageClient() {
  const { memoryState } = useMemoryStore();
  const { startSseStream, isLoading } = useSse();
  const [isFirst, setIsFirst] = useState<boolean>(true);

  useEffect(() => {
    if (!isFirst) return;
    setIsFirst(false);
    const hasTriedDetectingMemoryInfo = memoryState?.hasTriedDetectingMemoryInfo ?? false;
    if (!hasTriedDetectingMemoryInfo && !isLoading) {
      const createEventSource = () => new EventSource('/api/sse/memory/info');
      startSseStream(createEventSource);
    }
  }, [memoryState?.hasTriedDetectingMemoryInfo, isLoading, startSseStream]);

  const refreshMemoryInfo = () => {
    const createEventSource = () => new EventSource('/api/sse/memory/info');
    startSseStream(createEventSource);
  };

  // Calculate RAM usage percentage
  const calculateRAMUsage = (): number => {
    if (!memoryState?.memoryInfo) return 0;
    const totalStr = memoryState.memoryInfo.totalRAM.split(' ')[0];
    const freeStr = memoryState.memoryInfo.freeRAM.split(' ')[0];
    const total = parseFloat(totalStr) || 0;
    const free = parseFloat(freeStr) || 0;
    const used = total - free;
    const usedPercent = total > 0 ? Math.round((used / total) * 100) : 0;
    return usedPercent;
  };

  const ramUsagePercent = calculateRAMUsage();

  const memoryItems: Array<{
    label: string;
    value: string;
    showRefreshButton?: boolean;
    onRefresh?: () => void;
  }> = [
    {
      label: 'Total RAM',
      value: memoryState?.memoryInfo?.totalRAM || 'Loading...',
      showRefreshButton: true,
      onRefresh: refreshMemoryInfo
    },
    {
      label: 'Free RAM',
      value: memoryState?.memoryInfo?.freeRAM || 'Loading...',
      showRefreshButton: true,
      onRefresh: refreshMemoryInfo
    },
    {
      label: 'Used RAM',
      value: memoryState?.memoryInfo?.usedRAM || 'Loading...',
      showRefreshButton: true,
      onRefresh: refreshMemoryInfo
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none p-6">
        <h1 className="text-4xl font-bold mb-8">Memory Information</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="space-x-4 mb-4">
            <SseMemoryInfoButton />
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Memory Information */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Memory Usage</h2>
              
              {/* RAM Usage Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">RAM Usage</h3>
                  <span className="text-sm text-gray-600">{ramUsagePercent}% used</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                  <div 
                    className={`h-4 rounded-full ${
                      ramUsagePercent > 90 ? 'bg-red-500' : 
                      ramUsagePercent > 75 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${ramUsagePercent}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {memoryItems.map((item, index) => (
                  <SystemDetailField
                    key={index}
                    label={item.label}
                    value={item.value || 'Loading...'}
                    showRefreshButton={item.showRefreshButton}
                    onRefresh={item.onRefresh}
                  />
                ))}
              </div>

              {/* Top Processes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Top RAM Consuming Processes</h3>
                {memoryState?.memoryInfo?.topProcesses && memoryState.memoryInfo.topProcesses.length > 0 ? (
                  <div className="space-y-2">
                    {memoryState.memoryInfo.topProcesses.map((process, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900">{process.name}</p>
                            <p className="text-xs text-gray-500">PID: {process.pid}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{process.memoryAbsolute}</p>
                          <p className="text-sm text-gray-600">{process.memoryUsage}</p>
                          {process.memoryPercent > 0 && (
                            <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${Math.min(process.memoryPercent * 2, 100)}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No process information available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
