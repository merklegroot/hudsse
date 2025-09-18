import { create } from 'zustand';
import { SseMessage } from '../models/SseMessage';

interface MessageState {
  messages: SseMessage[];
  processingState: ProcessingState;

  addMessage: (message: string) => void;
  addSSEMessage: (message: SseMessage) => void;
  
  // Processing actions
  startProcessing: (title: string, message: string) => void;
  completeProcessing: () => void;
}

interface ProcessingState {
  isProcessing: boolean;
  title: string;
  message: string;
}


const createInitialState = (): Pick<MessageState, 'messages' | 'processingState'> => ({
  messages: [],
  processingState: {
    isProcessing: false,
    title: '',
    message: ''
  }
});


const addMessageToState = (state: MessageState) => (message: string) => ({
  messages: [...state.messages, { type: 'other' as const, contents: message }]
});

const addSSEMessageToState = (state: MessageState) => (message: SseMessage) => ({
  messages: [...state.messages, message]
});

const startProcessingToState = (title: string, message: string) => (state: MessageState) => ({
  processingState: {
    isProcessing: true,
    title,
    message
  }
});

const completeProcessingToState = (state: MessageState) => ({
  processingState: {
    isProcessing: false,
    title: '',
    message: ''
  }
});

const createMessageActions = (set: (fn: (state: MessageState) => Partial<MessageState>) => void) => ({
  addMessage: (message: string) => set((state) => addMessageToState(state)(message)),
  addSSEMessage: (message: SseMessage) => set((state) => addSSEMessageToState(state)(message)),
  startProcessing: (title: string, message: string) => set((state) => startProcessingToState(title, message)(state)),
  completeProcessing: () => set((state) => completeProcessingToState(state))
});

export const useMessageStore = create<MessageState>((set) => ({
  ...createInitialState(),
  ...createMessageActions(set)
}));
