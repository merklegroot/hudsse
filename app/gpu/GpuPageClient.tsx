'use client';

import { useEffect, useState } from 'react';
import { useGpuStore } from '@/store/gpuStore';
import { useSse } from '@/contexts/SseContext';
import SseGpuInfoButton from '@/components/SseGpuInfoButton';

export function GpuPageClient() {
  const gpuState = useGpuStore((state) => state.gpuState);
  const { startSseStream, isLoading } = useSse();
  const [isFirst, setIsFirst] = useState<boolean>(true);

  // Automatically fetch GPU info when the page loads if it hasn't been fetched yet
  useEffect(() => {
    if (!isFirst)
      return;

    setIsFirst(false);

    // Check if we haven't tried detecting GPU info yet
    const hasTriedDetectingGpuInfo = gpuState?.hasTriedDetectingGpuInfo ?? false;
    
    if (!hasTriedDetectingGpuInfo && !isLoading) {
      // Create EventSource for GPU info endpoint
      const createEventSource = () => new EventSource('/api/sse/gpu/info');
      
      // Start the SSE stream
      startSseStream(createEventSource);
    }
  }, [gpuState?.hasTriedDetectingGpuInfo, isLoading, startSseStream]);

  const refreshGpuInfo = () => {
    const createEventSource = () => new EventSource('/api/sse/gpu/info');
    startSseStream(createEventSource);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none p-6">
        <h1 className="text-4xl font-bold mb-8">Graphics Cards</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="space-x-4 mb-4">    
            <SseGpuInfoButton />
          </div>
          
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Graphics Cards</h2>
              
              {/* OpenGL Renderer Information */}
              {gpuState?.openGLRenderer && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-blue-800">OpenGL Renderer:</span>
                    <span className="ml-2 text-sm text-blue-700">{gpuState.openGLRenderer}</span>
                  </div>
                </div>
              )}
              
              {gpuState?.gpus && gpuState.gpus.length > 0 ? (
                <div className="space-y-4">
                  {gpuState.gpus.map((gpu) => (
                    <div key={gpu.index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          GPU {gpu.index}: {gpu.name}
                        </h3>
                        <div className="flex gap-2">
                          {gpu.utilization !== undefined && gpu.utilization > 0 && (
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              gpu.utilization > 80 ? 'bg-red-100 text-red-800' : 
                              gpu.utilization > 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {gpu.utilization}% usage
                            </span>
                          )}
                          {gpu.temperature !== undefined && gpu.temperature > 0 && (
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              gpu.temperature > 80 ? 'bg-red-100 text-red-800' : 
                              gpu.temperature > 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {gpu.temperature}°C
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Driver:</span>
                          <span className="ml-1 font-medium">{gpu.driver}</span>
                        </div>
                        {gpu.bus !== 'Unknown' && (
                          <div>
                            <span className="text-gray-600">Bus:</span>
                            <span className="ml-1 font-medium">{gpu.bus}</span>
                          </div>
                        )}
                        {gpu.revision !== 'Unknown' && (
                          <div>
                            <span className="text-gray-600">Revision:</span>
                            <span className="ml-1 font-medium">{gpu.revision}</span>
                          </div>
                        )}
                        {gpu.memoryTotal && (
                          <div>
                            <span className="text-gray-600">Memory Total:</span>
                            <span className="ml-1 font-medium">{gpu.memoryTotal}</span>
                          </div>
                        )}
                        {gpu.memoryUsed && (
                          <div>
                            <span className="text-gray-600">Memory Used:</span>
                            <span className="ml-1 font-medium">{gpu.memoryUsed}</span>
                          </div>
                        )}
                        {gpu.memoryFree && (
                          <div>
                            <span className="text-gray-600">Memory Free:</span>
                            <span className="ml-1 font-medium">{gpu.memoryFree}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Utilization Bar */}
                      {gpu.utilization !== undefined && gpu.utilization > 0 && (
                        <div className="mt-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">GPU Utilization</span>
                            <span className="text-sm text-gray-600">{gpu.utilization}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full ${
                                gpu.utilization > 90 ? 'bg-red-500' : 
                                gpu.utilization > 75 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${gpu.utilization}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No GPU information available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
