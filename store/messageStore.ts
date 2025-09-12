import { create } from 'zustand';
import { SseMessage, SdkInfo, RuntimeInfo, WhichDotNetResult } from '../models/SseMessage';

interface MessageState {
  messages: SseMessage[];
  dotnetSdks: SdkInfo[];
  dotnetRuntimes: RuntimeInfo[];
  whichDotNetPath: string | null;
  addMessage: (message: string) => void;
  addSSEMessage: (message: SseMessage) => void;
  setDotnetSdks: (sdks: SdkInfo[]) => void;
  setDotnetRuntimes: (runtimes: RuntimeInfo[]) => void;
  setWhichDotNetPath: (path: string | null) => void;
}

const createInitialState = (): Pick<MessageState, 'messages' | 'dotnetSdks' | 'dotnetRuntimes' | 'whichDotNetPath'> => ({
  messages: [],
  dotnetSdks: [],
  dotnetRuntimes: [],
  whichDotNetPath: null
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

const createMessageActions = (set: (fn: (state: MessageState) => Partial<MessageState>) => void) => ({
  addMessage: (message: string) => set((state) => addMessageToState(state)(message)),
  addSSEMessage: (message: SseMessage) => set((state) => addSSEMessageToState(state)(message)),
  setDotnetSdks: (sdks: SdkInfo[]) => set(() => setDotnetSdksToState(sdks)),
  setDotnetRuntimes: (runtimes: RuntimeInfo[]) => set(() => setDotnetRuntimesToState(runtimes)),
  setWhichDotNetPath: (path: string | null) => set(() => setWhichDotNetPathToState(path))
});

export const useMessageStore = create<MessageState>((set) => ({
  ...createInitialState(),
  ...createMessageActions(set)
}));
