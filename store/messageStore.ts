import { create } from 'zustand';

interface MessageState {
  messages: string[];
  addMessage: (message: string) => void;
  addSSEMessage: (message: string) => void;
}

const createInitialState = (): Pick<MessageState, 'messages'> => ({
  messages: []
});

const addMessageToState = (state: MessageState) => (message: string) => ({
  messages: [...state.messages, message]
});

const addSSEMessageToState = (state: MessageState) => (message: string) => ({
  messages: [...state.messages, `[SSE] ${message}`]
});

const createMessageActions = (set: (fn: (state: MessageState) => Partial<MessageState>) => void) => ({
  addMessage: (message: string) => set((state) => addMessageToState(state)(message)),
  addSSEMessage: (message: string) => set((state) => addSSEMessageToState(state)(message))
});

export const useMessageStore = create<MessageState>((set) => ({
  ...createInitialState(),
  ...createMessageActions(set)
}));
