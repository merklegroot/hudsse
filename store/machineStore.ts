import { create } from 'zustand';
import { HostnameResult, PlatformResult, IpAddressResult, KernelVersionResult, CpuInfoResult, DistroFlavorResult, VirtualizationResult, MotherboardNameResult, MachineModelResult, PackageManagerResult } from '../models/SseMessage';

interface MachineState {
  hostname: string | null;
  platform: string | null;
  ipAddress: string | null;
  kernelVersion: string | null;
  cpuModel: string | null;
  cpuCores: number | null;
  cpuArchitecture: string | null;
  cpuMhz: number | null;
  cpuThreadsPerCore: number | null;
  cpuCoresPerSocket: number | null;
  cpuSockets: number | null;
  cpuVirtualization: string | null;
  cpuFlags: string | null;
  cpuVendor: string | null;
  cpuSse: boolean | null;
  cpuSse2: boolean | null;
  cpuSse3: boolean | null;
  cpuSsse3: boolean | null;
  cpuSse4_1: boolean | null;
  cpuSse4_2: boolean | null;
  cpuAvx: boolean | null;
  cpuAvx2: boolean | null;
  cpuAvx512: boolean | null;
  cpuFma: boolean | null;
  cpuAes: boolean | null;
  cpuSha: boolean | null;
  cpuNeon: boolean | null;
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
  setCpuInfoResult: (result: CpuInfoResult | null) => void;
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
  cpuCores: existingState?.cpuCores || null,
  cpuArchitecture: existingState?.cpuArchitecture || null,
  cpuMhz: existingState?.cpuMhz || null,
  cpuThreadsPerCore: existingState?.cpuThreadsPerCore || null,
  cpuCoresPerSocket: existingState?.cpuCoresPerSocket || null,
  cpuSockets: existingState?.cpuSockets || null,
  cpuVirtualization: existingState?.cpuVirtualization || null,
  cpuFlags: existingState?.cpuFlags || null,
  cpuVendor: existingState?.cpuVendor || null,
  cpuSse: existingState?.cpuSse || null,
  cpuSse2: existingState?.cpuSse2 || null,
  cpuSse3: existingState?.cpuSse3 || null,
  cpuSsse3: existingState?.cpuSsse3 || null,
  cpuSse4_1: existingState?.cpuSse4_1 || null,
  cpuSse4_2: existingState?.cpuSse4_2 || null,
  cpuAvx: existingState?.cpuAvx || null,
  cpuAvx2: existingState?.cpuAvx2 || null,
  cpuAvx512: existingState?.cpuAvx512 || null,
  cpuFma: existingState?.cpuFma || null,
  cpuAes: existingState?.cpuAes || null,
  cpuSha: existingState?.cpuSha || null,
  cpuNeon: existingState?.cpuNeon || null,
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

const setCpuInfoResultToState = (result: CpuInfoResult | null) => (state: MachineStore) => ({
  machineState: result ? createCompleteMachineState(state.machineState, {
    cpuModel: result.cpuModel,
    cpuCores: result.cpuCores !== undefined ? result.cpuCores : null,
    cpuArchitecture: result.architecture !== undefined ? result.architecture : null,
    cpuMhz: result.cpuMhz !== undefined ? result.cpuMhz : null,
    cpuThreadsPerCore: result.threadsPerCore !== undefined ? result.threadsPerCore : null,
    cpuCoresPerSocket: result.coresPerSocket !== undefined ? result.coresPerSocket : null,
    cpuSockets: result.sockets !== undefined ? result.sockets : null,
    cpuVirtualization: result.virtualization !== undefined ? result.virtualization : null,
    cpuFlags: result.cpuFlags !== undefined ? result.cpuFlags : null,
    cpuVendor: result.vendor !== undefined ? result.vendor : null,
    cpuSse: result.sse !== undefined ? result.sse : null,
    cpuSse2: result.sse2 !== undefined ? result.sse2 : null,
    cpuSse3: result.sse3 !== undefined ? result.sse3 : null,
    cpuSsse3: result.ssse3 !== undefined ? result.ssse3 : null,
    cpuSse4_1: result.sse4_1 !== undefined ? result.sse4_1 : null,
    cpuSse4_2: result.sse4_2 !== undefined ? result.sse4_2 : null,
    cpuAvx: result.avx !== undefined ? result.avx : null,
    cpuAvx2: result.avx2 !== undefined ? result.avx2 : null,
    cpuAvx512: result.avx512 !== undefined ? result.avx512 : null,
    cpuFma: result.fma !== undefined ? result.fma : null,
    cpuAes: result.aes !== undefined ? result.aes : null,
    cpuSha: result.sha !== undefined ? result.sha : null,
    cpuNeon: result.neon !== undefined ? result.neon : null,
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
    cpuCores: state.machineState?.cpuCores || null,
    cpuArchitecture: state.machineState?.cpuArchitecture || null,
    cpuMhz: state.machineState?.cpuMhz || null,
    cpuThreadsPerCore: state.machineState?.cpuThreadsPerCore || null,
    cpuCoresPerSocket: state.machineState?.cpuCoresPerSocket || null,
    cpuSockets: state.machineState?.cpuSockets || null,
    cpuVirtualization: state.machineState?.cpuVirtualization || null,
    cpuFlags: state.machineState?.cpuFlags || null,
    cpuVendor: state.machineState?.cpuVendor || null,
    cpuSse: state.machineState?.cpuSse || null,
    cpuSse2: state.machineState?.cpuSse2 || null,
    cpuSse3: state.machineState?.cpuSse3 || null,
    cpuSsse3: state.machineState?.cpuSsse3 || null,
    cpuSse4_1: state.machineState?.cpuSse4_1 || null,
    cpuSse4_2: state.machineState?.cpuSse4_2 || null,
    cpuAvx: state.machineState?.cpuAvx || null,
    cpuAvx2: state.machineState?.cpuAvx2 || null,
    cpuAvx512: state.machineState?.cpuAvx512 || null,
    cpuFma: state.machineState?.cpuFma || null,
    cpuAes: state.machineState?.cpuAes || null,
    cpuSha: state.machineState?.cpuSha || null,
    cpuNeon: state.machineState?.cpuNeon || null,
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
  setCpuInfoResult: (result: CpuInfoResult | null) => set((state) => setCpuInfoResultToState(result)(state)),
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
