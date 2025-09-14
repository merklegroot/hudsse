'use client';

import { useSse } from '../contexts/SseContext';
import { forwardRef } from 'react';

interface SseUninstallDotNetButtonProps {
    appName: string;
    version: string;
    onUninstallComplete?: () => void;
    onUninstallStart?: () => void;
}

const SseUninstallDotNetButton = forwardRef<HTMLButtonElement, SseUninstallDotNetButtonProps>(({ appName, version, onUninstallComplete, onUninstallStart }, ref) => {
    const { startSseStream, isLoading } = useSse();

    const createEventSource = () => {
        return new EventSource(`/api/sse/dotnet/uninstall?appName=${encodeURIComponent(appName)}&version=${encodeURIComponent(version)}`);
    };

    const onClick = () => {
        if (isLoading) return;
        
        // Notify that uninstall is starting
        onUninstallStart?.();
        
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
            ref={ref}
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
});

SseUninstallDotNetButton.displayName = 'SseUninstallDotNetButton';

export default SseUninstallDotNetButton;
