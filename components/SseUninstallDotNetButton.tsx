'use client';

import { useSse } from '../contexts/SseContext';

interface SseUninstallDotNetButtonProps {
    appName: string;
    version: string;
    onUninstallComplete?: () => void;
}

export default function SseUninstallDotNetButton({ appName, version, onUninstallComplete }: SseUninstallDotNetButtonProps) {
    const { startSseStream, isLoading } = useSse();

    const createEventSource = () => {
        return new EventSource(`/api/sse/dotnet/uninstall?appName=${encodeURIComponent(appName)}&version=${encodeURIComponent(version)}`);
    };

    const onClick = () => {
        if (isLoading) return;
        
        const eventSource = startSseStream(createEventSource);
        
        // Set up completion handler
        const handleMessage = (event: MessageEvent) => {
            if (event.data === '[DONE]') {
                onUninstallComplete?.();
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
                    : 'bg-red-600 text-white hover:bg-red-700'
            }`}
        >
            {isLoading ? 'Uninstalling...' : 'Uninstall'}
        </button>
    );
}
