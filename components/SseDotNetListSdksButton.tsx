'use client'

import { useMessageStore } from '../store/messageStore';
import { SseMessage } from '../models/SseMessage';
import { useState } from 'react';

function parseSSEData(data: string): SseMessage | undefined {
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing SSE data:', error);
    return undefined;
  }
}

function handleSSEMessage(addSSEMessage: (message: SseMessage) => void) {
  return function(event: MessageEvent) {
    console.log('SSE Raw data received:', event.data);
    
    if (event.data === '[DONE]') {
      console.log('SSE stream completed');
      return { shouldClose: true };
    }

    const data = parseSSEData(event.data);
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

function handleSSEError(error: Event) {
  console.error('SSE error:', error);
  return { shouldClose: true };
}

function createEventSource() {
  return new EventSource('/api/sse/dotnet/list-sdks');
}

function createListSdkSseHandlers(addSSEMessage: (message: SseMessage) => void, setIsLoading: (loading: boolean) => void) {
  const eventSource = createEventSource();
  
  console.log('SSE EventSource created, readyState:', eventSource.readyState);

  const messageHandler = handleSSEMessage(addSSEMessage);
  const errorHandler = handleSSEError;

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

export default function SseDotNetListSdksButton() {
  const addSSEMessage = useMessageStore((state) => state.addSSEMessage);
  const [isLoading, setIsLoading] = useState(false);

  const handleSSEClick = () => {
    if (isLoading) return;

    setIsLoading(true);
    createListSdkSseHandlers(addSSEMessage, setIsLoading);
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
