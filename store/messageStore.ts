import { create } from 'zustand';
import { SseMessage, SdkInfo, RuntimeInfo, GroupedRuntimes, DotNetInfoResult, DotNetHost, RuntimeEnvironment } from '../models/SseMessage';

interface dotnetState {
  dotnetSdks: SdkInfo[];
  dotnetRuntimes: RuntimeInfo[];
  groupedRuntimes: GroupedRuntimes;

  dotnetPath: string | null;
  runtimeEnvironment: RuntimeEnvironment;
  host: DotNetHost;
  workloadsInstalled: string;
    otherArchitectures: string[];
    environmentVariables: Record<string, string>;
    globalJsonFile: string;
}

interface MessageState {
  messages: SseMessage[];
  dotnetState: dotnetState | null;
  
  addMessage: (message: string) => void;
  addSSEMessage: (message: SseMessage) => void;
  setDotnetSdks: (sdks: SdkInfo[]) => void;
  setDotnetRuntimes: (runtimes: RuntimeInfo[]) => void;
  setWhichDotNetPath: (path: string | null) => void;
  setDotnetInfo: (info: DotNetInfoResult | null) => void;
  setDotnetState: (state: dotnetState | null) => void;
}

const createInitialState = (): Pick<MessageState, 'messages' | 'dotnetState'> => ({
  messages: [],
  dotnetState: null
});

const groupRuntimesByApp = (runtimes: RuntimeInfo[]): GroupedRuntimes => {
  const grouped: GroupedRuntimes = {};
  
  runtimes.forEach(runtime => {
    const appType = runtime.name; // e.g., "Microsoft.AspNetCore.App"
    if (!grouped[appType]) {
      grouped[appType] = [];
    }
    grouped[appType].push(runtime);
  });
  
  return grouped;
};

const addMessageToState = (state: MessageState) => (message: string) => ({
  messages: [...state.messages, { type: 'other' as const, contents: message }]
});

const addSSEMessageToState = (state: MessageState) => (message: SseMessage) => ({
  messages: [...state.messages, message]
});

const setDotnetSdksToState = (sdks: SdkInfo[]) => (state: MessageState) => ({
  dotnetState: state.dotnetState ? {
    ...state.dotnetState,
    dotnetSdks: sdks
  } : null
});

const setDotnetRuntimesToState = (runtimes: RuntimeInfo[]) => (state: MessageState) => ({
  dotnetState: state.dotnetState ? {
    ...state.dotnetState,
    dotnetRuntimes: runtimes,
    groupedRuntimes: groupRuntimesByApp(runtimes)
  } : null
});

const setWhichDotNetPathToState = (path: string | null) => (state: MessageState) => {
  // Remove "dotnet" suffix from the path to show just the folder
  const extractDotnetPath = (fullPath: string): string => {
    // Remove "/dotnet" from the end of the path
    return fullPath.replace(/\/dotnet$/, '');
  };

  const runtimes = state.dotnetState?.dotnetRuntimes || [];
  
  return {
    dotnetState: {
      ...state.dotnetState,
      dotnetSdks: state.dotnetState?.dotnetSdks || [],
      dotnetRuntimes: runtimes,
      groupedRuntimes: groupRuntimesByApp(runtimes),
      dotnetPath: path ? extractDotnetPath(path) : null,
      runtimeEnvironment: state.dotnetState?.runtimeEnvironment || {
        osName: '',
        osVersion: '',
        osPlatform: '',
        rid: '',
        basePath: ''
      },
      host: state.dotnetState?.host || {
        version: '',
        architecture: '',
        commit: ''
      },
      workloadsInstalled: state.dotnetState?.workloadsInstalled || '',
      otherArchitectures: state.dotnetState?.otherArchitectures || [],
      environmentVariables: state.dotnetState?.environmentVariables || {},
      globalJsonFile: state.dotnetState?.globalJsonFile || ''
    }
  };
};

const setDotnetInfoToState = (info: DotNetInfoResult | null) => (state: MessageState) => {
  // Extract dotnetPath from basePath by removing the SDK version suffix
  const extractDotnetPath = (basePath: string): string => {
    // Remove pattern like "/sdk/9.0.304/" from the end
    const sdkPattern = /\/sdk\/[^\/]+\/?$/;
    return basePath.replace(sdkPattern, '');
  };

  const runtimes = info ? info.installedRuntimes.map(runtime => ({ name: runtime.name, version: runtime.version, path: runtime.path })) : [];
  
  return {
    dotnetState: info ? {
      ...state.dotnetState,
      dotnetSdks: info.installedSdks.map(sdk => ({ version: sdk.version, path: sdk.path })),
      dotnetRuntimes: runtimes,
      groupedRuntimes: groupRuntimesByApp(runtimes),
      dotnetPath: extractDotnetPath(info.runtimeEnvironment.basePath),
      runtimeEnvironment: info.runtimeEnvironment,
      host: info.host,
      workloadsInstalled: info.workloadsInstalled,
      otherArchitectures: info.otherArchitectures,
      environmentVariables: info.environmentVariables,
      globalJsonFile: info.globalJsonFile
    } : state.dotnetState
  };
};

const setDotnetStateToState = (state: dotnetState | null) => ({
  dotnetState: state
});

const createMessageActions = (set: (fn: (state: MessageState) => Partial<MessageState>) => void) => ({
  addMessage: (message: string) => set((state) => addMessageToState(state)(message)),
  addSSEMessage: (message: SseMessage) => set((state) => addSSEMessageToState(state)(message)),
  setDotnetSdks: (sdks: SdkInfo[]) => set((state) => setDotnetSdksToState(sdks)(state)),
  setDotnetRuntimes: (runtimes: RuntimeInfo[]) => set((state) => setDotnetRuntimesToState(runtimes)(state)),
  setWhichDotNetPath: (path: string | null) => set((state) => setWhichDotNetPathToState(path)(state)),
  setDotnetInfo: (info: DotNetInfoResult | null) => set((state) => setDotnetInfoToState(info)(state)),
  setDotnetState: (state: dotnetState | null) => set(() => setDotnetStateToState(state))
});

export const useMessageStore = create<MessageState>((set) => ({
  ...createInitialState(),
  ...createMessageActions(set)
}));
