import { create } from 'zustand';
import { SseMessage, SdkInfo, RuntimeInfo } from '../models/SseMessage';

interface MessageState {
  messages: SseMessage[];
  dotnetSdks: SdkInfo[];
  dotnetRuntimes: RuntimeInfo[];
  addMessage: (message: string) => void;
  addSSEMessage: (message: SseMessage) => void;
  setDotnetSdks: (sdks: SdkInfo[]) => void;
  setDotnetRuntimes: (runtimes: RuntimeInfo[]) => void;
}

const createInitialState = (): Pick<MessageState, 'messages' | 'dotnetSdks' | 'dotnetRuntimes'> => ({
  messages: [],
  dotnetSdks: [],
  dotnetRuntimes: []
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

const createMessageActions = (set: (fn: (state: MessageState) => Partial<MessageState>) => void) => ({
  addMessage: (message: string) => set((state) => addMessageToState(state)(message)),
  addSSEMessage: (message: SseMessage) => set((state) => addSSEMessageToState(state)(message)),
  setDotnetSdks: (sdks: SdkInfo[]) => set(() => setDotnetSdksToState(sdks)),
  setDotnetRuntimes: (runtimes: RuntimeInfo[]) => set(() => setDotnetRuntimesToState(runtimes))
});

export const useMessageStore = create<MessageState>((set) => ({
  ...createInitialState(),
  ...createMessageActions(set)
}));
