'use client';

import { useMessageStore } from '@/store/messageStore';
import AddMessageButton from '@/components/AddMessageButton';
import SSEButton from '@/components/SSEButton';
import MessageList from '@/components/MessageList';

export function HomeControl() {
    const messages = useMessageStore((state) => state.messages);

    return (
        <div>
            <div className="space-x-4 mb-4">
                <AddMessageButton />
                <SSEButton />
            </div>
            <div>
                <MessageList messages={messages} />
            </div>
        </div>
    )
}