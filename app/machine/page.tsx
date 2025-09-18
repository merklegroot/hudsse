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
      <main className="h-screen flex flex-col">
        <div className="flex-none p-6">
          <h1 className="text-3xl font-bold text-gray-900">Machine</h1>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="h-full flex">
            <div className="flex-1 p-6 pr-[calc(50%+1.5rem)] overflow-y-auto">
              <div className="space-x-4 mb-4">    
                <SseHostnameButton />
              </div>
              <MachineStateViewer />
            </div>
          </div>
        </div>
      </main>
      <div className="fixed top-[calc(4rem+1.5rem)] right-0 w-1/2 h-[calc(100vh-4rem-1.5rem)] z-40">
        <TerminalControl messages={messages} />
      </div>
    </>
  )
}
