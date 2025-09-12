import { create } from 'zustand';
import { SseMessage, SdkInfo, RuntimeInfo, WhichDotNetResult, DotNetInfoResult, DotNetHost, RuntimeEnvironment } from '../models/SseMessage';

interface dotnetState {
  dotnetSdks: SdkInfo[];
  dotnetRuntimes: RuntimeInfo[];

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
    dotnetRuntimes: runtimes
  } : null
});

const setWhichDotNetPathToState = (path: string | null) => (state: MessageState) => ({
  dotnetState: state.dotnetState ? {
    ...state.dotnetState,
    dotnetPath: path
  } : null
});

const setDotnetInfoToState = (info: DotNetInfoResult | null) => (state: MessageState) => ({
  dotnetState: info ? {
    ...state.dotnetState,
    dotnetSdks: info.installedSdks.map(sdk => ({ version: sdk.version, path: sdk.path })),
    dotnetRuntimes: info.installedRuntimes.map(runtime => ({ name: runtime.name, version: runtime.version, path: runtime.path })),
    dotnetPath: state.dotnetState?.dotnetPath || null,
    runtimeEnvironment: info.runtimeEnvironment,
    host: info.host,
    workloadsInstalled: info.workloadsInstalled,
    otherArchitectures: info.otherArchitectures,
    environmentVariables: info.environmentVariables,
    globalJsonFile: info.globalJsonFile
  } : state.dotnetState
});

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
