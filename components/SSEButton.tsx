'use client'

import { useMessageStore } from '../store/messageStore';
import { sseMessage } from '../models/sseMessage';
import { useState } from 'react';

const parseSSEData = (data: string) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing SSE data:', error);
    return null;
  }
};

const handleSSEMessage = (addSSEMessage: (message: sseMessage) => void) => (event: MessageEvent) => {
  if (event.data === '[DONE]') {
    return { shouldClose: true };
  }

  const data = parseSSEData(event.data);
  if (data?.type && data?.contents) {
    addSSEMessage(data as sseMessage);
  }

  return { shouldClose: false };
};

const handleSSEError = (error: Event) => {
  console.error('SSE error:', error);
  return { shouldClose: true };
};

const createEventSource = () => new EventSource('/api/sse/dotnet-list-sdks');

const createSSEHandlers = (addSSEMessage: (message: sseMessage) => void, setIsLoading: (loading: boolean) => void) => {
  const eventSource = createEventSource();

  const messageHandler = handleSSEMessage(addSSEMessage);
  const errorHandler = handleSSEError;

  eventSource.onmessage = (event) => {
    const result = messageHandler(event);
    if (result.shouldClose) {
      eventSource.close();
      setIsLoading(false);
    }
  };

  eventSource.onerror = (error) => {
    const result = errorHandler(error);
    if (result.shouldClose) {
      eventSource.close();
      setIsLoading(false);
    }
  };

  return eventSource;
};

export default function SSEButton() {
  const addSSEMessage = useMessageStore((state) => state.addSSEMessage);
  const [isLoading, setIsLoading] = useState(false);

  const handleSSEClick = () => {
    if (isLoading) return;

    setIsLoading(true);
    createSSEHandlers(addSSEMessage, setIsLoading);
  };

  return (<button
    onClick={handleSSEClick}
    disabled={isLoading}
    className={`font-bold py-2 px-4 rounded ${isLoading
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-green-500 hover:bg-green-700 text-white'
      }`}
  >
    {isLoading ? 'Loading SSE...' : 'Start SSE Stream'}
  </button>
  )
}
