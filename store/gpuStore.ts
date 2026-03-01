import { create } from 'zustand';
import { GpuInfoResult, GpuResult } from '../models/SseMessage';

interface GpuState {
  gpus: GpuResult[];
  openGLRenderer: string | null;
  hasTriedDetectingGpuInfo: boolean;
}

interface GpuStore {
  gpuState: GpuState | null;

  setGpuInfoResult: (result: GpuInfoResult | null) => void;
  setGpuState: (state: GpuState | null) => void;
  setHasTriedDetectingGpuInfo: (hasTried: boolean) => void;
}

const createInitialGpuState = (): Pick<GpuStore, 'gpuState'> => ({
  gpuState: null
});

const createCompleteGpuState = (existingState: GpuState | null, updates: Partial<GpuState>): GpuState => ({
  gpus: existingState?.gpus || [],
  openGLRenderer: existingState?.openGLRenderer || null,
  hasTriedDetectingGpuInfo: existingState?.hasTriedDetectingGpuInfo || false,
  ...updates
});

const setGpuInfoResultToState = (result: GpuInfoResult | null) => (state: GpuStore) => ({
  gpuState: result ? createCompleteGpuState(state.gpuState, {
    gpus: result.gpus || [],
    openGLRenderer: result.openGLRenderer || null,
    hasTriedDetectingGpuInfo: true
  }) : state.gpuState
});

const setGpuStateToState = (newState: GpuState | null) => () => ({
  gpuState: newState
});

const setHasTriedDetectingGpuInfoToState = (hasTried: boolean) => (state: GpuStore) => ({
  gpuState: state.gpuState ? {
    ...state.gpuState,
    hasTriedDetectingGpuInfo: hasTried
  } : null
});

const createGpuActions = (set: (fn: (state: GpuStore) => Partial<GpuStore>) => void) => ({
  setGpuInfoResult: (result: GpuInfoResult | null) => set((state) => setGpuInfoResultToState(result)(state)),
  setGpuState: (newState: GpuState | null) => set(() => setGpuStateToState(newState)),
  setHasTriedDetectingGpuInfo: (hasTried: boolean) => set((state) => setHasTriedDetectingGpuInfoToState(hasTried)(state))
});

export const useGpuStore = create<GpuStore>((set) => ({
  ...createInitialGpuState(),
  ...createGpuActions(set)
}));

export type { GpuState };
