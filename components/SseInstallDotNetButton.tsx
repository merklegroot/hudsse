'use client';

import { useSse } from '../contexts/SseContext';
import { forwardRef } from 'react';

interface SseInstallDotNetButtonProps {
    majorVersion: number;
    onInstallComplete?: () => void;
}

const SseInstallDotNetButton = forwardRef<HTMLButtonElement, SseInstallDotNetButtonProps>(({ majorVersion, onInstallComplete }, ref) => {
    const { startSseStream, isLoading } = useSse();

    const createEventSource = () => {
        return new EventSource(`/api/sse/dotnet/install?version=${majorVersion}`);
    };

    const onClick = () => {
        if (isLoading) return;
        
        const eventSource = startSseStream(createEventSource);
        
        // Set up completion handler
        const handleMessage = (event: MessageEvent) => {
            if (event.data === '[DONE]') {
                onInstallComplete?.();
                eventSource.close();
            }
        };
        
        eventSource.addEventListener('message', handleMessage);
    };

    return (
        <button
            ref={ref}
            onClick={onClick}
            disabled={isLoading}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                isLoading
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
            }`}
        >
            {isLoading ? 'Installing...' : 'Install SDK'}
        </button>
    );
});

SseInstallDotNetButton.displayName = 'SseInstallDotNetButton';

export default SseInstallDotNetButton;
