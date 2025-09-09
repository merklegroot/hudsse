import { create } from 'zustand';
import { sseMessage } from '../models/sseMessage';

interface MessageState {
  messages: sseMessage[];
  addMessage: (message: string) => void;
  addSSEMessage: (message: sseMessage) => void;
}

const createInitialState = (): Pick<MessageState, 'messages'> => ({
  messages: []
});

const addMessageToState = (state: MessageState) => (message: string) => ({
  messages: [...state.messages, { type: 'other', contents: message }]
});

const addSSEMessageToState = (state: MessageState) => (message: sseMessage) => ({
  messages: [...state.messages, message]
});

const createMessageActions = (set: (fn: (state: MessageState) => Partial<MessageState>) => void) => ({
  addMessage: (message: string) => set((state) => addMessageToState(state)(message)),
  addSSEMessage: (message: sseMessage) => set((state) => addSSEMessageToState(state)(message))
});

export const useMessageStore = create<MessageState>((set) => ({
  ...createInitialState(),
  ...createMessageActions(set)
}));
