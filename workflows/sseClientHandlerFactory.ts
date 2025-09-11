import { SseMessage } from "@/models/SseMessage";
import { useMessageStore } from "@/store/messageStore";

const addSSEMessage = useMessageStore((state) => state.addSSEMessage);

function handleSseError(error: Event) {
    console.error('SSE error:', error);
    return { shouldClose: true };
}

function parseSseData(data: string): SseMessage | undefined {
    try {
        return JSON.parse(data);
    } catch (error) {
        console.error('Error parsing SSE data:', error);
        return undefined;
    }
}

function handleSseMessage(addSSEMessage: (message: SseMessage) => void) {
    return function (event: MessageEvent) {
        console.log('SSE Raw data received:', event.data);

        if (event.data === '[DONE]') {
            console.log('SSE stream completed');
            return { shouldClose: true };
        }

        const data = parseSseData(event.data);
        console.log('SSE Parsed data:', data);

        if (data?.type && data?.contents) {
            console.log('Adding message to store:', data);
            addSSEMessage(data as SseMessage);
        } else {
            console.warn('Invalid message format:', data);
        }

        return { shouldClose: false };
    };
}

export function sseClientHandlerFactory(
    setIsLoading: (loading: boolean) => void,
    createEventSource: () => EventSource) {
    const eventSource = createEventSource();

    console.log('SSE EventSource created, readyState:', eventSource.readyState);

    const messageHandler = handleSseMessage(addSSEMessage);
    const errorHandler = handleSseError;

    eventSource.onopen = () => {
        console.log('SSE connection opened');
    };

    eventSource.onmessage = (event) => {
        const result = messageHandler(event);
        if (result.shouldClose) {
            eventSource.close();
            setIsLoading(false);
        }
    };

    eventSource.onerror = (error) => {
        console.log('SSE error event, readyState:', eventSource.readyState);
        const result = errorHandler(error);
        if (result.shouldClose) {
            eventSource.close();
            setIsLoading(false);
        }
    };

    return eventSource;
}
