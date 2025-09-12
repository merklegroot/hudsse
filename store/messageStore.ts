import { create } from 'zustand';
import { SseMessage, SdkInfo, RuntimeInfo, WhichDotNetResult, DotNetInfoResult } from '../models/SseMessage';

interface MessageState {
  messages: SseMessage[];
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
}

const createInitialState = (): Pick<MessageState, 'messages' | 'dotnetSdks' | 'dotnetRuntimes' | 'whichDotNetPath' | 'dotnetInfo'> => ({
  messages: [],
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

const createMessageActions = (set: (fn: (state: MessageState) => Partial<MessageState>) => void) => ({
  addMessage: (message: string) => set((state) => addMessageToState(state)(message)),
  addSSEMessage: (message: SseMessage) => set((state) => addSSEMessageToState(state)(message)),
  setDotnetSdks: (sdks: SdkInfo[]) => set(() => setDotnetSdksToState(sdks)),
  setDotnetRuntimes: (runtimes: RuntimeInfo[]) => set(() => setDotnetRuntimesToState(runtimes)),
  setWhichDotNetPath: (path: string | null) => set(() => setWhichDotNetPathToState(path)),
  setDotnetInfo: (info: DotNetInfoResult | null) => set(() => setDotnetInfoToState(info))
});

export const useMessageStore = create<MessageState>((set) => ({
  ...createInitialState(),
  ...createMessageActions(set)
}));
