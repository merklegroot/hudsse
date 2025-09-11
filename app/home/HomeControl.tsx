'use client';

import { useMessageStore } from '@/store/messageStore';
import AddMessageButton from '@/components/AddMessageButton';
import SseDotNetListSdksButton from '@/components/SseDotNetListSdksButton';
import SseDelayedMessagesButton from '@/components/SseDelayedMessagesButton';
import MessageList from '@/components/MessageList';

export function HomeControl() {
    const messages = useMessageStore((state) => state.messages);

    return (
        <div>
            <div className="space-x-4 mb-4">
                <AddMessageButton />
                <SseDotNetListSdksButton />
                <SseDelayedMessagesButton />
            </div>
            <div>
                <MessageList messages={messages} />
            </div>
        </div>
    )
}