import { create } from 'zustand';
import { MemoryInfoResult } from '../models/SseMessage';

interface MemoryState {
  memoryInfo: MemoryInfoResult | null;
  hasTriedDetectingMemoryInfo: boolean;
}

interface MemoryStore {
  memoryState: MemoryState | null;
  setMemoryInfoResult: (result: MemoryInfoResult | null) => void;
  setHasTriedDetectingMemoryInfo: (hasTried: boolean) => void;
}

const createInitialMemoryState = (): Pick<MemoryStore, 'memoryState'> => ({
  memoryState: null
});

const createCompleteMemoryState = (existingState: MemoryState | null, updates: Partial<MemoryState>): MemoryState => ({
  memoryInfo: existingState?.memoryInfo || null,
  hasTriedDetectingMemoryInfo: existingState?.hasTriedDetectingMemoryInfo || false,
  ...updates
});

const setMemoryInfoResultToState = (result: MemoryInfoResult | null) => (state: MemoryStore) => ({
  memoryState: result ? createCompleteMemoryState(state.memoryState, {
    memoryInfo: result,
    hasTriedDetectingMemoryInfo: true
  }) : state.memoryState
});

const setHasTriedDetectingMemoryInfoToState = (hasTried: boolean) => (state: MemoryStore) => ({
  memoryState: state.memoryState ? {
    ...state.memoryState,
    hasTriedDetectingMemoryInfo: hasTried
  } : null
});

const createMemoryActions = (set: (fn: (state: MemoryStore) => Partial<MemoryStore>) => void) => ({
  setMemoryInfoResult: (result: MemoryInfoResult | null) => set((state) => setMemoryInfoResultToState(result)(state)),
  setHasTriedDetectingMemoryInfo: (hasTried: boolean) => set((state) => setHasTriedDetectingMemoryInfoToState(hasTried)(state)),
});

export const useMemoryStore = create<MemoryStore>((set) => ({
  ...createInitialMemoryState(),
  ...createMemoryActions(set)
}));

export type { MemoryState };
