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
  
  dotnetSdks: SdkInfo[];
  dotnetRuntimes: RuntimeInfo[];
  whichDotNetPath: string | null;
  dotnetInfo: DotNetInfoResult | null;
  addMessage: (message: string) => void;
  addSSEMessage: (message: SseMessage) => void;
  setDotnetSdks: (sdks: SdkInfo[]) => void;
  setDotnetRuntimes: (runtimes: RuntimeInfo[]) => void;
  setWhichDotNetPath: (path: string | null) => void;
  setDotnetInfo: (info: DotNetInfoResult | null) => void;
  setDotnetState: (state: dotnetState | null) => void;
}

const createInitialState = (): Pick<MessageState, 'messages' | 'dotnetSdks' | 'dotnetRuntimes' | 'whichDotNetPath' | 'dotnetInfo' | 'dotnetState'> => ({
  messages: [],
  dotnetState: null,
  dotnetSdks: [],
  dotnetRuntimes: [],
  whichDotNetPath: null,
  dotnetInfo: null
});

const addMessageToState = (state: MessageState) => (message: string) => ({
  messages: [...state.messages, { type: 'other' as const, contents: message }]
});

const addSSEMessageToState = (state: MessageState) => (message: SseMessage) => ({
  messages: [...state.messages, message]
});

const setDotnetSdksToState = (sdks: SdkInfo[]) => ({
  dotnetSdks: sdks
});

const setDotnetRuntimesToState = (runtimes: RuntimeInfo[]) => ({
  dotnetRuntimes: runtimes
});

const setWhichDotNetPathToState = (path: string | null) => ({
  whichDotNetPath: path
});

const setDotnetInfoToState = (info: DotNetInfoResult | null) => ({
  dotnetInfo: info
});

const setDotnetStateToState = (state: dotnetState | null) => ({
  dotnetState: state
});

const createMessageActions = (set: (fn: (state: MessageState) => Partial<MessageState>) => void) => ({
  addMessage: (message: string) => set((state) => addMessageToState(state)(message)),
  addSSEMessage: (message: SseMessage) => set((state) => addSSEMessageToState(state)(message)),
  setDotnetSdks: (sdks: SdkInfo[]) => set(() => setDotnetSdksToState(sdks)),
  setDotnetRuntimes: (runtimes: RuntimeInfo[]) => set(() => setDotnetRuntimesToState(runtimes)),
  setWhichDotNetPath: (path: string | null) => set(() => setWhichDotNetPathToState(path)),
  setDotnetInfo: (info: DotNetInfoResult | null) => set(() => setDotnetInfoToState(info)),
  setDotnetState: (state: dotnetState | null) => set(() => setDotnetStateToState(state))
});

export const useMessageStore = create<MessageState>((set) => ({
  ...createInitialState(),
  ...createMessageActions(set)
}));
