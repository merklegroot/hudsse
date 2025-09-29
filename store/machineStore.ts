import { create } from 'zustand';
import { HostnameResult, PlatformResult, IpAddressResult, KernelVersionResult, CpuModelResult, DistroFlavorResult, VirtualizationResult, MotherboardNameResult, MachineModelResult, PackageManagerResult } from '../models/SseMessage';

interface MachineState {
  hostname: string | null;
  platform: string | null;
  ipAddress: string | null;
  kernelVersion: string | null;
  cpuModel: string | null;
  distroFlavor: string | null;
  systemInfo: MachineModelResult | null;
  virtualization: number | null;
  motherboardName: string | null;
  packageManager: string | null;
  hasTriedDetectingHostname: boolean;
  hasTriedDetectingPlatform: boolean;
  hasTriedDetectingIpAddress: boolean;
  hasTriedDetectingKernelVersion: boolean;
  hasTriedDetectingCpuModel: boolean;
  hasTriedDetectingDistroFlavor: boolean;
  hasTriedDetectingSystemInfo: boolean;
  hasTriedDetectingVirtualization: boolean;
  hasTriedDetectingMotherboardName: boolean;
  hasTriedDetectingPackageManager: boolean;
}

interface MachineStore {
  machineState: MachineState | null;

  setHostname: (hostname: string | null) => void;
  setPlatform: (platform: string | null) => void;
  setIpAddress: (ipAddress: string | null) => void;
  setKernelVersion: (kernelVersion: string | null) => void;
  setCpuModel: (cpuModel: string | null) => void;
  setDistroFlavor: (distroFlavor: string | null) => void;
  setSystemInfo: (systemInfo: MachineModelResult | null) => void;
  setVirtualization: (virtualization: number | null) => void;
  setMotherboardName: (motherboardName: string | null) => void;
  setPackageManager: (packageManager: string | null) => void;
  setHostnameResult: (result: HostnameResult | null) => void;
  setPlatformResult: (result: PlatformResult | null) => void;
  setIpAddressResult: (result: IpAddressResult | null) => void;
  setKernelVersionResult: (result: KernelVersionResult | null) => void;
  setCpuModelResult: (result: CpuModelResult | null) => void;
  setDistroFlavorResult: (result: DistroFlavorResult | null) => void;
  setSystemInfoResult: (result: MachineModelResult | null) => void;
  setVirtualizationResult: (result: VirtualizationResult | null) => void;
  setMotherboardNameResult: (result: MotherboardNameResult | null) => void;
  setPackageManagerResult: (result: PackageManagerResult | null) => void;
  setMachineModelResult: (result: MachineModelResult | null) => void;
  setMachineState: (state: MachineState | null) => void;
  setHasTriedDetectingHostname: (hasTried: boolean) => void;
  setHasTriedDetectingPlatform: (hasTried: boolean) => void;
  setHasTriedDetectingIpAddress: (hasTried: boolean) => void;
  setHasTriedDetectingKernelVersion: (hasTried: boolean) => void;
  setHasTriedDetectingCpuModel: (hasTried: boolean) => void;
  setHasTriedDetectingDistroFlavor: (hasTried: boolean) => void;
  setHasTriedDetectingSystemInfo: (hasTried: boolean) => void;
  setHasTriedDetectingVirtualization: (hasTried: boolean) => void;
  setHasTriedDetectingMotherboardName: (hasTried: boolean) => void;
  setHasTriedDetectingPackageManager: (hasTried: boolean) => void;
}

const createInitialMachineState = (): Pick<MachineStore, 'machineState'> => ({
  machineState: null
});

// Helper function to create a complete machine state with all fields
const createCompleteMachineState = (existingState: MachineState | null, updates: Partial<MachineState>): MachineState => ({
  hostname: existingState?.hostname || null,
  platform: existingState?.platform || null,
  ipAddress: existingState?.ipAddress || null,
  kernelVersion: existingState?.kernelVersion || null,
  cpuModel: existingState?.cpuModel || null,
  distroFlavor: existingState?.distroFlavor || null,
  systemInfo: existingState?.systemInfo || null,
  virtualization: existingState?.virtualization || null,
  motherboardName: existingState?.motherboardName || null,
  packageManager: existingState?.packageManager || null,
  hasTriedDetectingHostname: existingState?.hasTriedDetectingHostname || false,
  hasTriedDetectingPlatform: existingState?.hasTriedDetectingPlatform || false,
  hasTriedDetectingIpAddress: existingState?.hasTriedDetectingIpAddress || false,
  hasTriedDetectingKernelVersion: existingState?.hasTriedDetectingKernelVersion || false,
  hasTriedDetectingCpuModel: existingState?.hasTriedDetectingCpuModel || false,
  hasTriedDetectingDistroFlavor: existingState?.hasTriedDetectingDistroFlavor || false,
  hasTriedDetectingSystemInfo: existingState?.hasTriedDetectingSystemInfo || false,
  hasTriedDetectingVirtualization: existingState?.hasTriedDetectingVirtualization || false,
  hasTriedDetectingMotherboardName: existingState?.hasTriedDetectingMotherboardName || false,
  hasTriedDetectingPackageManager: existingState?.hasTriedDetectingPackageManager || false,
  ...updates
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

const setKernelVersionToState = (kernelVersion: string | null) => (state: MachineStore) => ({
  machineState: state.machineState ? {
    ...state.machineState,
    kernelVersion: kernelVersion
  } : null
});

const setCpuModelToState = (cpuModel: string | null) => (state: MachineStore) => ({
  machineState: state.machineState ? {
    ...state.machineState,
    cpuModel: cpuModel
  } : null
});

const setDistroFlavorToState = (distroFlavor: string | null) => (state: MachineStore) => ({
  machineState: state.machineState ? {
    ...state.machineState,
    distroFlavor: distroFlavor
  } : null
});

const setSystemInfoToState = (systemInfo: MachineModelResult | null) => (state: MachineStore) => ({
  machineState: state.machineState ? {
    ...state.machineState,
    systemInfo: systemInfo
  } : null
});

const setVirtualizationToState = (virtualization: number | null) => (state: MachineStore) => ({
  machineState: state.machineState ? {
    ...state.machineState,
    virtualization: virtualization
  } : null
});

const setMotherboardNameToState = (motherboardName: string | null) => (state: MachineStore) => ({
  machineState: state.machineState ? {
    ...state.machineState,
    motherboardName: motherboardName
  } : null
});

const setPackageManagerToState = (packageManager: string | null) => (state: MachineStore) => ({
  machineState: state.machineState ? {
    ...state.machineState,
    packageManager: packageManager
  } : null
});

const setHostnameResultToState = (result: HostnameResult | null) => (state: MachineStore) => ({
  machineState: result ? createCompleteMachineState(state.machineState, {
    hostname: result.hostname,
    hasTriedDetectingHostname: true
  }) : state.machineState
});

const setPlatformResultToState = (result: PlatformResult | null) => (state: MachineStore) => ({
  machineState: result ? createCompleteMachineState(state.machineState, {
    platform: result.platform,
    hasTriedDetectingPlatform: true
  }) : state.machineState
});

const setIpAddressResultToState = (result: IpAddressResult | null) => (state: MachineStore) => ({
  machineState: result ? createCompleteMachineState(state.machineState, {
    ipAddress: result.ipAddress,
    hasTriedDetectingIpAddress: true
  }) : state.machineState
});

const setKernelVersionResultToState = (result: KernelVersionResult | null) => (state: MachineStore) => ({
  machineState: result ? createCompleteMachineState(state.machineState, {
    kernelVersion: result.kernelVersion,
    hasTriedDetectingKernelVersion: true
  }) : state.machineState
});

const setCpuModelResultToState = (result: CpuModelResult | null) => (state: MachineStore) => ({
  machineState: result ? createCompleteMachineState(state.machineState, {
    cpuModel: result.cpuModel,
    hasTriedDetectingCpuModel: true
  }) : state.machineState
});

const setDistroFlavorResultToState = (result: DistroFlavorResult | null) => (state: MachineStore) => ({
  machineState: result ? createCompleteMachineState(state.machineState, {
    distroFlavor: result.distroFlavor,
    hasTriedDetectingDistroFlavor: true
  }) : state.machineState
});

const setSystemInfoResultToState = (result: MachineModelResult | null) => (state: MachineStore) => ({
  machineState: result ? {
    hostname: state.machineState?.hostname || null,
    platform: state.machineState?.platform || null,
    ipAddress: state.machineState?.ipAddress || null,
    kernelVersion: state.machineState?.kernelVersion || null,
    cpuModel: state.machineState?.cpuModel || null,
    distroFlavor: state.machineState?.distroFlavor || null,
    systemInfo: result,
    virtualization: state.machineState?.virtualization || null,
    motherboardName: state.machineState?.motherboardName || null,
    packageManager: state.machineState?.packageManager || null,
    hasTriedDetectingHostname: state.machineState?.hasTriedDetectingHostname || false,
    hasTriedDetectingPlatform: state.machineState?.hasTriedDetectingPlatform || false,
    hasTriedDetectingIpAddress: state.machineState?.hasTriedDetectingIpAddress || false,
    hasTriedDetectingKernelVersion: state.machineState?.hasTriedDetectingKernelVersion || false,
    hasTriedDetectingCpuModel: state.machineState?.hasTriedDetectingCpuModel || false,
    hasTriedDetectingDistroFlavor: state.machineState?.hasTriedDetectingDistroFlavor || false,
    hasTriedDetectingSystemInfo: true,
    hasTriedDetectingVirtualization: state.machineState?.hasTriedDetectingVirtualization || false,
    hasTriedDetectingMotherboardName: state.machineState?.hasTriedDetectingMotherboardName || false,
    hasTriedDetectingPackageManager: state.machineState?.hasTriedDetectingPackageManager || false
  } : state.machineState
});

const setVirtualizationResultToState = (result: VirtualizationResult | null) => (state: MachineStore) => ({
  machineState: result ? createCompleteMachineState(state.machineState, {
    virtualization: result.virtualization,
    hasTriedDetectingVirtualization: true
  }) : state.machineState
});

const setMotherboardNameResultToState = (result: MotherboardNameResult | null) => (state: MachineStore) => ({
  machineState: result ? createCompleteMachineState(state.machineState, {
    motherboardName: result.motherboardName,
    hasTriedDetectingMotherboardName: true
  }) : state.machineState
});

const setPackageManagerResultToState = (result: PackageManagerResult | null) => (state: MachineStore) => ({
  machineState: result ? createCompleteMachineState(state.machineState, {
    packageManager: result.packageManager,
    hasTriedDetectingPackageManager: true
  }) : state.machineState
});

const setMachineModelResultToState = (result: MachineModelResult | null) => (state: MachineStore) => ({
  machineState: result ? createCompleteMachineState(state.machineState, {
    systemInfo: state.machineState?.systemInfo ? {
      ...state.machineState.systemInfo,
      productName: result.productName,
      boardName: result.boardName,
      manufacturer: result.manufacturer
    } : {
      productName: result.productName,
      boardName: result.boardName,
      manufacturer: result.manufacturer
    },
    hasTriedDetectingSystemInfo: true
  }) : state.machineState
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

const setHasTriedDetectingKernelVersionToState = (hasTried: boolean) => (state: MachineStore) => ({
  machineState: state.machineState ? {
    ...state.machineState,
    hasTriedDetectingKernelVersion: hasTried
  } : null
});

const setHasTriedDetectingCpuModelToState = (hasTried: boolean) => (state: MachineStore) => ({
  machineState: state.machineState ? {
    ...state.machineState,
    hasTriedDetectingCpuModel: hasTried
  } : null
});

const setHasTriedDetectingDistroFlavorToState = (hasTried: boolean) => (state: MachineStore) => ({
  machineState: state.machineState ? {
    ...state.machineState,
    hasTriedDetectingDistroFlavor: hasTried
  } : null
});

const setHasTriedDetectingSystemInfoToState = (hasTried: boolean) => (state: MachineStore) => ({
  machineState: state.machineState ? {
    ...state.machineState,
    hasTriedDetectingSystemInfo: hasTried
  } : null
});

const setHasTriedDetectingVirtualizationToState = (hasTried: boolean) => (state: MachineStore) => ({
  machineState: state.machineState ? {
    ...state.machineState,
    hasTriedDetectingVirtualization: hasTried
  } : null
});

const setHasTriedDetectingMotherboardNameToState = (hasTried: boolean) => (state: MachineStore) => ({
  machineState: state.machineState ? {
    ...state.machineState,
    hasTriedDetectingMotherboardName: hasTried
  } : null
});

const setHasTriedDetectingPackageManagerToState = (hasTried: boolean) => (state: MachineStore) => ({
  machineState: state.machineState ? {
    ...state.machineState,
    hasTriedDetectingPackageManager: hasTried
  } : null
});

const createMachineActions = (set: (fn: (state: MachineStore) => Partial<MachineStore>) => void) => ({
  setHostname: (hostname: string | null) => set((state) => setHostnameToState(hostname)(state)),
  setPlatform: (platform: string | null) => set((state) => setPlatformToState(platform)(state)),
  setIpAddress: (ipAddress: string | null) => set((state) => setIpAddressToState(ipAddress)(state)),
  setKernelVersion: (kernelVersion: string | null) => set((state) => setKernelVersionToState(kernelVersion)(state)),
  setCpuModel: (cpuModel: string | null) => set((state) => setCpuModelToState(cpuModel)(state)),
  setDistroFlavor: (distroFlavor: string | null) => set((state) => setDistroFlavorToState(distroFlavor)(state)),
  setSystemInfo: (systemInfo: MachineModelResult | null) => set((state) => setSystemInfoToState(systemInfo)(state)),
  setVirtualization: (virtualization: number | null) => set((state) => setVirtualizationToState(virtualization)(state)),
  setMotherboardName: (motherboardName: string | null) => set((state) => setMotherboardNameToState(motherboardName)(state)),
  setPackageManager: (packageManager: string | null) => set((state) => setPackageManagerToState(packageManager)(state)),
  setHostnameResult: (result: HostnameResult | null) => set((state) => setHostnameResultToState(result)(state)),
  setPlatformResult: (result: PlatformResult | null) => set((state) => setPlatformResultToState(result)(state)),
  setIpAddressResult: (result: IpAddressResult | null) => set((state) => setIpAddressResultToState(result)(state)),
  setKernelVersionResult: (result: KernelVersionResult | null) => set((state) => setKernelVersionResultToState(result)(state)),
  setCpuModelResult: (result: CpuModelResult | null) => set((state) => setCpuModelResultToState(result)(state)),
  setDistroFlavorResult: (result: DistroFlavorResult | null) => set((state) => setDistroFlavorResultToState(result)(state)),
  setSystemInfoResult: (result: MachineModelResult | null) => set((state) => setSystemInfoResultToState(result)(state)),
  setVirtualizationResult: (result: VirtualizationResult | null) => set((state) => setVirtualizationResultToState(result)(state)),
  setMotherboardNameResult: (result: MotherboardNameResult | null) => set((state) => setMotherboardNameResultToState(result)(state)),
  setPackageManagerResult: (result: PackageManagerResult | null) => set((state) => setPackageManagerResultToState(result)(state)),
  setMachineModelResult: (result: MachineModelResult | null) => set((state) => setMachineModelResultToState(result)(state)),
  setMachineState: (state: MachineState | null) => set(() => setMachineStateToState(state)),
  setHasTriedDetectingHostname: (hasTried: boolean) => set((state) => setHasTriedDetectingHostnameToState(hasTried)(state)),
  setHasTriedDetectingPlatform: (hasTried: boolean) => set((state) => setHasTriedDetectingPlatformToState(hasTried)(state)),
  setHasTriedDetectingIpAddress: (hasTried: boolean) => set((state) => setHasTriedDetectingIpAddressToState(hasTried)(state)),
  setHasTriedDetectingKernelVersion: (hasTried: boolean) => set((state) => setHasTriedDetectingKernelVersionToState(hasTried)(state)),
  setHasTriedDetectingCpuModel: (hasTried: boolean) => set((state) => setHasTriedDetectingCpuModelToState(hasTried)(state)),
  setHasTriedDetectingDistroFlavor: (hasTried: boolean) => set((state) => setHasTriedDetectingDistroFlavorToState(hasTried)(state)),
  setHasTriedDetectingSystemInfo: (hasTried: boolean) => set((state) => setHasTriedDetectingSystemInfoToState(hasTried)(state)),
  setHasTriedDetectingVirtualization: (hasTried: boolean) => set((state) => setHasTriedDetectingVirtualizationToState(hasTried)(state)),
  setHasTriedDetectingMotherboardName: (hasTried: boolean) => set((state) => setHasTriedDetectingMotherboardNameToState(hasTried)(state)),
  setHasTriedDetectingPackageManager: (hasTried: boolean) => set((state) => setHasTriedDetectingPackageManagerToState(hasTried)(state))
});

export const useMachineStore = create<MachineStore>((set) => ({
  ...createInitialMachineState(),
  ...createMachineActions(set)
}));

export type { MachineState };
