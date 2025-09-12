'use client';

import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { sseClientHandlerFactory } from '../workflows/sseClientHandlerFactory';
import { useMessageStore } from '../store/messageStore';
import { SseMessage, ListSdksResult, ListRuntimesResult } from '../models/SseMessage';

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
  const setDotnetRuntimes = useMessageStore((state) => state.setDotnetRuntimes);
  const [isLoading, setIsLoading] = useState(false);

  const handleSseMessage = useCallback((message: SseMessage) => {
    addSseMessage(message);
    
    // Check if this is a .NET SDKs result message
    if (message.type === 'result' && message.result) {
      try {
        const parsedResult = JSON.parse(message.result);
        
        // Handle SDKs result
        if (parsedResult.sdks && Array.isArray(parsedResult.sdks)) {
          setDotnetSdks(parsedResult.sdks);
        }
        
        // Handle Runtimes result
        if (parsedResult.runtimes && Array.isArray(parsedResult.runtimes)) {
          setDotnetRuntimes(parsedResult.runtimes);
        }
      } catch (error) {
        console.warn('Failed to parse result:', error);
      }
    }
  }, [addSseMessage, setDotnetSdks, setDotnetRuntimes]);

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
