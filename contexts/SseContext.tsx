'use client';

import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { sseClientHandlerFactory } from '../workflows/sseClientHandlerFactory';
import { useMessageStore } from '../store/messageStore';
import { SseMessage, ListSdksResult } from '../models/SseMessage';

interface SseContextType {
  startSseStream: (createEventSource: () => EventSource) => EventSource;
  isLoading: boolean;
}

const SseContext = createContext<SseContextType | undefined>(undefined);

interface SseProviderProps {
  children: ReactNode;
}

export function SseProvider({ children }: SseProviderProps) {
  const addSseMessage = useMessageStore((state) => state.addSSEMessage);
  const setDotnetSdks = useMessageStore((state) => state.setDotnetSdks);
  const [isLoading, setIsLoading] = useState(false);

  const handleSseMessage = useCallback((message: SseMessage) => {
    addSseMessage(message);
    
    // Check if this is a .NET SDKs result message
    if (message.type === 'result' && message.result) {
      try {
        const parsedResult = JSON.parse(message.result) as ListSdksResult;
        if (parsedResult.sdks && Array.isArray(parsedResult.sdks)) {
          setDotnetSdks(parsedResult.sdks);
        }
      } catch (error) {
        console.warn('Failed to parse SDK result:', error);
      }
    }
  }, [addSseMessage, setDotnetSdks]);

  const startSseStream = useCallback((createEventSource: () => EventSource) => {
    if (isLoading) {
      console.warn('SSE stream already in progress');
      return new EventSource('about:blank'); // Return a dummy EventSource
    }

    setIsLoading(true);
    return sseClientHandlerFactory(
      setIsLoading,
      createEventSource,
      handleSseMessage
    );
  }, [handleSseMessage, isLoading]);

  return (
    <SseContext.Provider value={{ startSseStream, isLoading }}>
      {children}
    </SseContext.Provider>
  );
}

export function useSse() {
  const context = useContext(SseContext);
  if (context === undefined) {
    throw new Error('useSse must be used within a SseProvider');
  }
  return context;
}
