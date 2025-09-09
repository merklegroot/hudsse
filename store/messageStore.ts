import { create } from 'zustand';
import { SseMessage } from '../models/SseMessage';

interface MessageState {
  messages: SseMessage[];
  addMessage: (message: string) => void;
  addSSEMessage: (message: SseMessage) => void;
}

const createInitialState = (): Pick<MessageState, 'messages'> => ({
  messages: []
});

const addMessageToState = (state: MessageState) => (message: string) => ({
  messages: [...state.messages, { type: 'other', contents: message }]
});

const addSSEMessageToState = (state: MessageState) => (message: SseMessage) => ({
  messages: [...state.messages, message]
});

const createMessageActions = (set: (fn: (state: MessageState) => Partial<MessageState>) => void) => ({
  addMessage: (message: string) => set((state) => addMessageToState(state)(message)),
  addSSEMessage: (message: SseMessage) => set((state) => addSSEMessageToState(state)(message))
});

export const useMessageStore = create<MessageState>((set) => ({
  ...createInitialState(),
  ...createMessageActions(set)
}));
