'use client';

import { useMachineStore } from '@/store/machineStore';
import { useIsMobile } from '@/hooks/useIsMobile';
import SseHostnameButton from '@/components/SseHostnameButton';
import { MachineStateViewer } from '@/components/MachineStateViewer';

export function MachinePageClient() {
  const machineState = useMachineStore((state) => state.machineState);
  const isMobile = useIsMobile();

  return (
    <div className={`h-screen flex flex-col ${isMobile ? 'pb-[33.333333%]' : 'pr-[50%]'}`}>
      <div className="flex-none p-6">
        <h1 className="text-3xl font-bold text-gray-900">Machine</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="space-x-4 mb-4">    
            <SseHostnameButton />
          </div>
          <MachineStateViewer />
        </div>
      </div>
    </div>
  );
}
