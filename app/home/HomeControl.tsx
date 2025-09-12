'use client';

import { useMessageStore } from '@/store/messageStore';
import AddMessageButton from '@/components/AddMessageButton';
import SseDotNetListSdksButton from '@/components/SseDotNetListSdksButton';
import SseDelayedMessagesButton from '@/components/SseDelayedMessagesButton';
import MessageList from '@/components/MessageList';
import DotNetSdksDisplay from '@/components/DotNetSdksDisplay';

export function HomeControl() {
    const messages = useMessageStore((state) => state.messages);

    return (
        <div>
            <div className="space-x-4 mb-4">
                <AddMessageButton />
                <SseDotNetListSdksButton />
                <SseDelayedMessagesButton />
            </div>
            <div className="flex gap-6">
                <div className="flex-3">
                    <DotNetSdksDisplay />
                </div>
                <div className="flex-2">
                    <MessageList messages={messages} />
                </div>
            </div>
        </div>
    )
}