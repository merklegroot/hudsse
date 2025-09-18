'use client';

import { useMachineStore } from '@/store/machineStore';
import { useIsMobile } from '@/hooks/useIsMobile';
import SseHostnameButton from '@/components/SseHostnameButton';
import { MachineStateViewer } from '@/components/MachineStateViewer';
import SystemDetailField from '@/components/SystemDetailField';

export function MachinePageClient() {
  const machineState = useMachineStore((state) => state.machineState);
  const isMobile = useIsMobile();

  // Empty data placeholders matching hudapp structure
  const infoItems = [
    { label: 'Machine Name', value: '' },
    { label: 'Local IP Address', value: '' },
    { label: 'Machine Model', value: '' },
    { label: 'CPU Model', value: '' },
    { label: 'Operating System', value: '' },
    { label: 'Kernel Version', value: '' },
  ];

  const osType = '';
  const virtualization = '';

  return (
    <div className={`h-screen flex flex-col ${isMobile ? 'pb-[33.333333%]' : 'pr-[50%]'}`}>
      <div className="flex-none p-6">
        <h1 className="text-4xl font-bold mb-8">Machine Information</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="space-x-4 mb-4">    
            <SseHostnameButton />
          </div>
          
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-8">
              {/* Left Panel - OS Type and Virtualization */}
              <div className="flex-shrink-0 w-80">
                <div className="bg-gray-50 rounded-lg p-8 text-center space-y-8">
                  {/* OS Type */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-20 h-20 bg-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-gray-600 text-sm">OS</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">OS Type</h3>
                      <p className="text-2xl font-semibold text-gray-900">{osType || 'Unknown'}</p>
                    </div>
                  </div>
                  
                  {/* Virtualization */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-20 h-20 bg-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-gray-600 text-sm">VM</span>
                    </div>
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
