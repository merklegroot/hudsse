'use client';

import { useMessageStore } from '@/store/messageStore';
import { useMachineStore } from '@/store/machineStore';
import SseHostnameButton from '@/components/SseHostnameButton';
import TerminalControl from '@/components/TerminalControl';
import { MachineStateViewer } from '@/components/MachineStateViewer';

export default function Machine() {
  const messages = useMessageStore((state) => state.messages);
  const machineState = useMachineStore((state) => state.machineState);

  return (
    <>
      <div className="h-screen flex flex-col pr-[50%]">
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
      <div className="fixed top-0 right-0 w-1/2 h-screen z-40">
        <TerminalControl messages={messages} />
      </div>
    </>
  )
}
