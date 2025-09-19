import { create } from 'zustand';
import { HostnameResult, PlatformResult } from '../models/SseMessage';

interface MachineState {
  hostname: string | null;
  platform: string | null;
  hasTriedDetectingHostname: boolean;
  hasTriedDetectingPlatform: boolean;
}

interface MachineStore {
  machineState: MachineState | null;

  setHostname: (hostname: string | null) => void;
  setPlatform: (platform: string | null) => void;
  setHostnameResult: (result: HostnameResult | null) => void;
  setPlatformResult: (result: PlatformResult | null) => void;
  setMachineState: (state: MachineState | null) => void;
  setHasTriedDetectingHostname: (hasTried: boolean) => void;
  setHasTriedDetectingPlatform: (hasTried: boolean) => void;
}

const createInitialMachineState = (): Pick<MachineStore, 'machineState'> => ({
  machineState: null
});

const setHostnameToState = (hostname: string | null) => (state: MachineStore) => ({
  machineState: state.machineState ? {
    ...state.machineState,
    hostname: hostname
  } : null
});

const setPlatformToState = (platform: string | null) => (state: MachineStore) => ({
  machineState: state.machineState ? {
    ...state.machineState,
    platform: platform
  } : null
});

const setHostnameResultToState = (result: HostnameResult | null) => (state: MachineStore) => ({
  machineState: result ? {
    ...state.machineState,
    hostname: result.hostname,
    hasTriedDetectingHostname: true
  } : state.machineState
});

const setPlatformResultToState = (result: PlatformResult | null) => (state: MachineStore) => ({
  machineState: result ? {
    ...state.machineState,
    platform: result.platform,
    hasTriedDetectingPlatform: true
  } : state.machineState
});

const setMachineStateToState = (state: MachineState | null) => ({
  machineState: state
});

const setHasTriedDetectingHostnameToState = (hasTried: boolean) => (state: MachineStore) => ({
  machineState: state.machineState ? {
    ...state.machineState,
    hasTriedDetectingHostname: hasTried
  } : null
});

const setHasTriedDetectingPlatformToState = (hasTried: boolean) => (state: MachineStore) => ({
  machineState: state.machineState ? {
    ...state.machineState,
    hasTriedDetectingPlatform: hasTried
  } : null
});

const createMachineActions = (set: (fn: (state: MachineStore) => Partial<MachineStore>) => void) => ({
  setHostname: (hostname: string | null) => set((state) => setHostnameToState(hostname)(state)),
  setPlatform: (platform: string | null) => set((state) => setPlatformToState(platform)(state)),
  setHostnameResult: (result: HostnameResult | null) => set((state) => setHostnameResultToState(result)(state)),
  setPlatformResult: (result: PlatformResult | null) => set((state) => setPlatformResultToState(result)(state)),
  setMachineState: (state: MachineState | null) => set(() => setMachineStateToState(state)),
  setHasTriedDetectingHostname: (hasTried: boolean) => set((state) => setHasTriedDetectingHostnameToState(hasTried)(state)),
  setHasTriedDetectingPlatform: (hasTried: boolean) => set((state) => setHasTriedDetectingPlatformToState(hasTried)(state))
});

export const useMachineStore = create<MachineStore>((set) => ({
  ...createInitialMachineState(),
  ...createMachineActions(set)
}));

export type { MachineState };
