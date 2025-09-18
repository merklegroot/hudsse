'use client';

import { useMessageStore } from '@/store/messageStore';
import SseHostnameButton from '@/components/SseHostnameButton';
import TerminalControl from '@/components/TerminalControl';

export function MachineControl() {
    const messages = useMessageStore((state) => state.messages);

    return (
        <div>
            <div className="space-x-4 mb-4">    
                <SseHostnameButton />
            </div>
            
            <div className="flex gap-6">
                <div className="flex-2">
                    <TerminalControl messages={messages} />
                </div>
            </div>            
        </div>
    )
}
