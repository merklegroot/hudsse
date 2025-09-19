'use client';

import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { sseClientHandlerFactory } from '../workflows/sseClientHandlerFactory';
import { useMessageStore } from '../store/messageStore';
import { useDotNetStore } from '../store/dotnetStore';
import { useMachineStore } from '../store/machineStore';
import { SseMessage, ListSdksResult, ListRuntimesResult, WhichDotNetResult, DotNetInfoResult, HostnameResult, PlatformResult } from '../models/SseMessage';

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
  const setDotnetSdks = useDotNetStore((state) => state.setDotnetSdks);
  const setDotnetRuntimes = useDotNetStore((state) => state.setDotnetRuntimes);
  const setWhichDotNetPath = useDotNetStore((state) => state.setWhichDotNetPath);
  const setDotnetInfo = useDotNetStore((state) => state.setDotnetInfo);
  const setHostnameResult = useMachineStore((state) => state.setHostnameResult);
  const setPlatformResult = useMachineStore((state) => state.setPlatformResult);
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
        
        // Handle WhichDotNet result
        if (parsedResult.path && typeof parsedResult.path === 'string') {
          setWhichDotNetPath(parsedResult.path);
        }
        
        // Handle DotNetInfo result
        if (parsedResult.sdk && parsedResult.runtimeEnvironment && parsedResult.host) {
          setDotnetInfo(parsedResult as DotNetInfoResult);
        }
        
        // Handle Hostname result
        if (parsedResult.hostname && typeof parsedResult.hostname === 'string') {
          setHostnameResult(parsedResult as HostnameResult);
        }
        
        // Handle Platform result
        if (parsedResult.platform && typeof parsedResult.platform === 'string') {
          setPlatformResult(parsedResult as PlatformResult);
        }
      } catch (error) {
        console.warn('Failed to parse result:', error);
      }
    }
  }, [addSseMessage, setDotnetSdks, setDotnetRuntimes, setWhichDotNetPath, setDotnetInfo, setHostnameResult, setPlatformResult]);

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
