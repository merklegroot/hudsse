'use client';

import { useSse } from '../contexts/SseContext';

interface SseInstallDotNetButtonProps {
    majorVersion: number;
    onInstallComplete?: () => void;
}

export default function SseInstallDotNetButton({ majorVersion, onInstallComplete }: SseInstallDotNetButtonProps) {
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
}
