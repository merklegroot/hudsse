'use client';

import { useMachineStore } from '@/store/machineStore';
import { useIsMobile } from '@/hooks/useIsMobile';
import SseHostnameButton from '@/components/SseHostnameButton';
import SseMachineInfoButton from '@/components/SseMachineInfoButton';
import { MachineStateViewer } from '@/components/MachineStateViewer';
import SystemDetailField from '@/components/SystemDetailField';
import { getDistroFlavor } from '@/utils/distroUtil';

export function MachinePageControl() {
  const machineState = useMachineStore((state) => state.machineState);
  const isMobile = useIsMobile();

  // Data items matching hudapp structure, using machineStore data where available
  const infoItems = [
    { label: 'Machine Name', value: machineState?.hostname || '' },
    { label: 'Platform', value: machineState?.platform || '' },
    { label: 'Local IP Address', value: machineState?.ipAddress || '' },
    { label: 'Machine Model', value: machineState?.systemInfo?.productName || '' },
    { label: 'CPU Model', value: machineState?.systemInfo?.cpuModel || '' },
    { label: 'Distro Flavor', value: getDistroFlavor(machineState?.systemInfo?.baseDistro, machineState?.systemInfo?.desktopEnvironment) },
    { label: 'Kernel Version', value: machineState?.systemInfo?.kernelVersion || '' },
    { label: 'Motherboard', value: machineState?.systemInfo?.boardName || '' },
  ];

  const osType = '';
  const virtualization = '';

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
