import { create } from 'zustand';
import { HostnameResult, PlatformResult, IpAddressResult } from '../models/SseMessage';

interface MachineState {
  hostname: string | null;
  platform: string | null;
  ipAddress: string | null;
  hasTriedDetectingHostname: boolean;
  hasTriedDetectingPlatform: boolean;
  hasTriedDetectingIpAddress: boolean;
}

interface MachineStore {
  machineState: MachineState | null;

  setHostname: (hostname: string | null) => void;
  setPlatform: (platform: string | null) => void;
  setIpAddress: (ipAddress: string | null) => void;
  setHostnameResult: (result: HostnameResult | null) => void;
  setPlatformResult: (result: PlatformResult | null) => void;
  setIpAddressResult: (result: IpAddressResult | null) => void;
  setMachineState: (state: MachineState | null) => void;
  setHasTriedDetectingHostname: (hasTried: boolean) => void;
  setHasTriedDetectingPlatform: (hasTried: boolean) => void;
  setHasTriedDetectingIpAddress: (hasTried: boolean) => void;
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

const setIpAddressToState = (ipAddress: string | null) => (state: MachineStore) => ({
  machineState: state.machineState ? {
    ...state.machineState,
    ipAddress: ipAddress
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

const setIpAddressResultToState = (result: IpAddressResult | null) => (state: MachineStore) => ({
  machineState: result ? {
    ...state.machineState,
    ipAddress: result.ipAddress,
    hasTriedDetectingIpAddress: true
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

const setHasTriedDetectingIpAddressToState = (hasTried: boolean) => (state: MachineStore) => ({
  machineState: state.machineState ? {
    ...state.machineState,
    hasTriedDetectingIpAddress: hasTried
  } : null
});

const createMachineActions = (set: (fn: (state: MachineStore) => Partial<MachineStore>) => void) => ({
  setHostname: (hostname: string | null) => set((state) => setHostnameToState(hostname)(state)),
  setPlatform: (platform: string | null) => set((state) => setPlatformToState(platform)(state)),
  setIpAddress: (ipAddress: string | null) => set((state) => setIpAddressToState(ipAddress)(state)),
  setHostnameResult: (result: HostnameResult | null) => set((state) => setHostnameResultToState(result)(state)),
  setPlatformResult: (result: PlatformResult | null) => set((state) => setPlatformResultToState(result)(state)),
  setIpAddressResult: (result: IpAddressResult | null) => set((state) => setIpAddressResultToState(result)(state)),
  setMachineState: (state: MachineState | null) => set(() => setMachineStateToState(state)),
  setHasTriedDetectingHostname: (hasTried: boolean) => set((state) => setHasTriedDetectingHostnameToState(hasTried)(state)),
  setHasTriedDetectingPlatform: (hasTried: boolean) => set((state) => setHasTriedDetectingPlatformToState(hasTried)(state)),
  setHasTriedDetectingIpAddress: (hasTried: boolean) => set((state) => setHasTriedDetectingIpAddressToState(hasTried)(state))
});

export const useMachineStore = create<MachineStore>((set) => ({
  ...createInitialMachineState(),
  ...createMachineActions(set)
}));

export type { MachineState };
