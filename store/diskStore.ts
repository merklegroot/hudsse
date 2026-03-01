import { create } from 'zustand';
import { DiskInfoResult } from '../models/SseMessage';

interface DiskState {
  diskInfo: DiskInfoResult | null;
  hasTriedDetectingDiskInfo: boolean;
}

interface DiskStore {
  diskState: DiskState | null;
  setDiskInfoResult: (result: DiskInfoResult | null) => void;
  setHasTriedDetectingDiskInfo: (hasTried: boolean) => void;
}

const createInitialDiskState = (): Pick<DiskStore, 'diskState'> => ({
  diskState: null
});

const createCompleteDiskState = (existingState: DiskState | null, updates: Partial<DiskState>): DiskState => ({
  diskInfo: existingState?.diskInfo || null,
  hasTriedDetectingDiskInfo: existingState?.hasTriedDetectingDiskInfo || false,
  ...updates
});

const setDiskInfoResultToState = (result: DiskInfoResult | null) => (state: DiskStore) => ({
  diskState: result ? createCompleteDiskState(state.diskState, {
    diskInfo: result,
    hasTriedDetectingDiskInfo: true
  }) : state.diskState
});

const setHasTriedDetectingDiskInfoToState = (hasTried: boolean) => (state: DiskStore) => ({
  diskState: state.diskState ? {
    ...state.diskState,
    hasTriedDetectingDiskInfo: hasTried
  } : null
});

const createDiskActions = (set: (fn: (state: DiskStore) => Partial<DiskStore>) => void) => ({
  setDiskInfoResult: (result: DiskInfoResult | null) => set((state) => setDiskInfoResultToState(result)(state)),
  setHasTriedDetectingDiskInfo: (hasTried: boolean) => set((state) => setHasTriedDetectingDiskInfoToState(hasTried)(state)),
});

export const useDiskStore = create<DiskStore>((set) => ({
  ...createInitialDiskState(),
  ...createDiskActions(set)
}));

export type { DiskState };
