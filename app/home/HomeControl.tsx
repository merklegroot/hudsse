'use client';

import { useMessageStore } from '@/store/messageStore';
import AddMessageButton from '@/components/AddMessageButton';
import SseDotNetListSdksButton from '@/components/SseDotNetListSdksButton';
import SseDotNetListRuntimesButton from '@/components/SseDotNetListRuntimesButton';
import SseWhichDotNetButton from '@/components/SseWhichDotNetButton';
import DetectDotNetButton from '@/components/DetectDotNetButton';
import SseDelayedMessagesButton from '@/components/SseDelayedMessagesButton';
import MessageList from '@/components/MessageList';
import DotNetSdksDisplay from '@/components/DotNetSdksDisplay';
import DotNetRuntimesDisplay from '@/components/DotNetRuntimesDisplay';
import WhichDotNetDisplay from '@/components/WhichDotNetDisplay';

export function HomeControl() {
    const messages = useMessageStore((state) => state.messages);

    return (
        <div>
            <div className="space-x-4 mb-4">
                <AddMessageButton />
                <SseDelayedMessagesButton />
                {/* <SseDotNetListSdksButton />
                <SseDotNetListRuntimesButton /> */}
                <SseWhichDotNetButton />
                <DetectDotNetButton />
                
            </div>
            <div className="flex gap-6">
                <div className="flex-3">
                    <WhichDotNetDisplay />
                    <DotNetSdksDisplay />
                    <DotNetRuntimesDisplay />
                </div>
                <div className="flex-2">
                    <MessageList messages={messages} />
                </div>
            </div>
        </div>
    )
}