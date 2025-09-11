'use client';

import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { sseClientHandlerFactory } from '../workflows/sseClientHandlerFactory';
import { useMessageStore } from '../store/messageStore';

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
  const [isLoading, setIsLoading] = useState(false);

  const startSseStream = useCallback((createEventSource: () => EventSource) => {
    if (isLoading) {
      console.warn('SSE stream already in progress');
      return new EventSource('about:blank'); // Return a dummy EventSource
    }

    setIsLoading(true);
    return sseClientHandlerFactory(
      setIsLoading,
      createEventSource,
      addSseMessage
    );
  }, [addSseMessage, isLoading]);

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
