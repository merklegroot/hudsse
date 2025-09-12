'use client';

import { useMessageStore } from '@/store/messageStore';
import AddMessageButton from '@/components/AddMessageButton';
import SseWhichDotNetButton from '@/components/SseWhichDotNetButton';
import SseDotNetInfoButton from '@/components/SseDotNetInfoButton';
import DetectDotNetButton from '@/components/DetectDotNetButton';
import SseDelayedMessagesButton from '@/components/SseDelayedMessagesButton';
import MessageList from '@/components/MessageList';
import { StateViewer } from '@/components/StateViewer';
import DotNetDisplay from '@/components/dotnet-display/DotNetDisplay';

export function HomeControl() {
    const messages = useMessageStore((state) => state.messages);

    return (
        <div>
            
            <div className="space-x-4 mb-4">    
                <AddMessageButton />
                <SseDelayedMessagesButton />
                <SseWhichDotNetButton />
                <SseDotNetInfoButton />
                <DetectDotNetButton />                
            </div>
            <div className="space-x-4 mb-4">
                <StateViewer />           
            </div>            
            <div className="flex gap-6">
                <div className="flex-3">
                    <DotNetDisplay />
                </div>
                <div className="flex-2">
                    <MessageList messages={messages} />
                </div>
            </div>            
        </div>
    )
}