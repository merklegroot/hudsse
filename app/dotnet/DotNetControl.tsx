'use client';

import { useMessageStore } from '@/store/messageStore';
import AddMessageButton from '@/components/AddMessageButton';
import SseWhichDotNetButton from '@/components/SseWhichDotNetButton';
import SseDotNetInfoButton from '@/components/SseDotNetInfoButton';
import SseDelayedMessagesButton from '@/components/SseDelayedMessagesButton';
import SseStepCounterButton from '@/components/SseStepCounterButton';
import PingButton from '@/components/PingButton';
import { StateViewer } from '@/components/StateViewer';
import DotNetDisplay from '@/components/dotnet-display/DotNetDisplay';
import DotNetInstallLink from '@/components/dotnet-display/DotnetInstallLink';

export function DotNetControl() {
    const messages = useMessageStore((state) => state.messages);
    const startProcessing = useMessageStore((state) => state.startProcessing);
    const completeProcessing = useMessageStore((state) => state.completeProcessing);
    const isProcessing = useMessageStore((state) => state.processingState.isProcessing);
    const processingTitle = useMessageStore((state) => state.processingState.title);
    const processingMessage = useMessageStore((state) => state.processingState.message);

    return (
        <div className="h-full flex flex-col">
            
            <div className="space-x-4 mb-4">    
                <AddMessageButton />
                <PingButton />
                {/* <SseDelayedMessagesButton />
                <SseWhichDotNetButton /> */}
                <SseDotNetInfoButton />
                <SseStepCounterButton />
                <button
                    onClick={() => {
                        startProcessing('Processing Test', 'This is a test of the generic processing dialog. Auto-closing in 3 seconds...');
                        // Auto-close after 3 seconds
                        setTimeout(() => {
                            completeProcessing();
                        }, 3000);
                    }}
                    className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 transition-colors"
                >
                    Test In-Progress Dialog (Auto-close)
                </button>
            </div>
            <div className="space-x-4 mb-4">
                <StateViewer />
                <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                    <strong>Debug - Processing State:</strong> isProcessing: {isProcessing.toString()}, 
                    Title: {processingTitle}, Message: {processingMessage}
                </div>
            </div>
            <div className="mb-4">
                <DotNetInstallLink />
            </div>
            
            <div className="flex-1">
                <DotNetDisplay />
            </div>            
        </div>
    )
}