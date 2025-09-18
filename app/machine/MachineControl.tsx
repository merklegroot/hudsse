'use client';

import { useMessageStore } from '@/store/messageStore';
import { useMachineStore } from '@/store/machineStore';
import SseHostnameButton from '@/components/SseHostnameButton';
import TerminalControl from '@/components/TerminalControl';
import { MachineStateViewer } from '@/components/MachineStateViewer';

export function MachineControl() {
    const messages = useMessageStore((state) => state.messages);
    const machineState = useMachineStore((state) => state.machineState);

    return (
        <div>
            <div className="space-x-4 mb-4">    
                <SseHostnameButton />
            </div>
            
            <div className="flex gap-6">
                <div className="flex-2">
                    <TerminalControl messages={messages} />
                </div>
                <div className="flex-1">
                    <MachineStateViewer />
                </div>
            </div>            
        </div>
    )
}
