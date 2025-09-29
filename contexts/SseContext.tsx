'use client';

import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { sseClientHandlerFactory } from '../workflows/sseClientHandlerFactory';
import { useMessageStore } from '../store/messageStore';
import { useDotNetStore } from '../store/dotnetStore';
import { useMachineStore } from '../store/machineStore';
import { usePathStore } from '../store/pathStore';
import { SseMessage, ListSdksResult, ListRuntimesResult, WhichDotNetResult, DotNetInfoResult, HostnameResult, PlatformResult, IpAddressResult, KernelVersionResult, CpuModelResult, DistroFlavorResult, VirtualizationResult, PathResult, MotherboardNameResult, MachineModelResult } from '../models/SseMessage';

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
  const setIpAddressResult = useMachineStore((state) => state.setIpAddressResult);
  const setKernelVersionResult = useMachineStore((state) => state.setKernelVersionResult);
  const setCpuModelResult = useMachineStore((state) => state.setCpuModelResult);
  const setDistroFlavorResult = useMachineStore((state) => state.setDistroFlavorResult);
  const setSystemInfoResult = useMachineStore((state) => state.setSystemInfoResult);
  const setVirtualizationResult = useMachineStore((state) => state.setVirtualizationResult);
  const setMotherboardNameResult = useMachineStore((state) => state.setMotherboardNameResult);
  const setMachineModelResult = useMachineStore((state) => state.setMachineModelResult);
  const setPathResult = usePathStore((state) => state.setPathResult);
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
        
        // Handle IP Address result
        if (parsedResult.ipAddress && typeof parsedResult.ipAddress === 'string') {
          setIpAddressResult(parsedResult as IpAddressResult);
        }
        
        // Handle Kernel Version result
        if (parsedResult.kernelVersion && typeof parsedResult.kernelVersion === 'string') {
          setKernelVersionResult(parsedResult as KernelVersionResult);
        }
        
        // Handle CPU Model result
        if (parsedResult.cpuModel && typeof parsedResult.cpuModel === 'string') {
          setCpuModelResult(parsedResult as CpuModelResult);
        }
        
        // Handle Distro Flavor result
        if (parsedResult.distroFlavor && typeof parsedResult.distroFlavor === 'string') {
          setDistroFlavorResult(parsedResult as DistroFlavorResult);
        }
        
        // Handle Virtualization result
        if (parsedResult.virtualization !== undefined && typeof parsedResult.virtualization === 'number') {
          setVirtualizationResult(parsedResult as VirtualizationResult);
        }
        
        // Handle Motherboard Name result
        if (parsedResult.motherboardName !== undefined) {
          setMotherboardNameResult(parsedResult as MotherboardNameResult);
        }
        
        // Handle Machine Model result
        if (parsedResult.productName !== undefined || parsedResult.boardName !== undefined || parsedResult.manufacturer !== undefined) {
          setMachineModelResult(parsedResult as MachineModelResult);
        }
        
        // Handle Path result
        if (parsedResult.path && Array.isArray(parsedResult.folders)) {
          setPathResult(parsedResult as PathResult);
        }
      } catch (error) {
        console.warn('Failed to parse result:', error);
      }
    }
  }, [addSseMessage, setDotnetSdks, setDotnetRuntimes, setWhichDotNetPath, setDotnetInfo, setHostnameResult, setPlatformResult, setIpAddressResult, setSystemInfoResult, setVirtualizationResult, setMotherboardNameResult, setMachineModelResult, setPathResult]);

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
