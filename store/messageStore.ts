import { create } from 'zustand'

interface MessageState {
  messages: string[]
  addMessage: (message: string) => void
}

export const useMessageStore = create<MessageState>((set) => ({
  messages: [],
  addMessage: (message: string) =>
    set((state) => ({
      messages: [...state.messages, message]
    }))
}))
