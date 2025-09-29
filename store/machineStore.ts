import { create } from 'zustand';
import { HostnameResult, PlatformResult, IpAddressResult, KernelVersionResult, CpuModelResult, DistroFlavorResult, SystemInfoResult, VirtualizationResult, MotherboardNameResult, MachineModelResult } from '../models/SseMessage';

interface MachineState {
  hostname: string | null;
  platform: string | null;
  ipAddress: string | null;
  kernelVersion: string | null;
  cpuModel: string | null;
  distroFlavor: string | null;
  systemInfo: SystemInfoResult | null;
  virtualization: number | null;
  motherboardName: string | null;
  hasTriedDetectingHostname: boolean;
  hasTriedDetectingPlatform: boolean;
  hasTriedDetectingIpAddress: boolean;
  hasTriedDetectingKernelVersion: boolean;
  hasTriedDetectingCpuModel: boolean;
  hasTriedDetectingDistroFlavor: boolean;
  hasTriedDetectingSystemInfo: boolean;
  hasTriedDetectingVirtualization: boolean;
  hasTriedDetectingMotherboardName: boolean;
}

interface MachineStore {
  machineState: MachineState | null;

  setHostname: (hostname: string | null) => void;
  setPlatform: (platform: string | null) => void;
  setIpAddress: (ipAddress: string | null) => void;
  setKernelVersion: (kernelVersion: string | null) => void;
  setCpuModel: (cpuModel: string | null) => void;
  setDistroFlavor: (distroFlavor: string | null) => void;
  setSystemInfo: (systemInfo: SystemInfoResult | null) => void;
  setVirtualization: (virtualization: number | null) => void;
  setMotherboardName: (motherboardName: string | null) => void;
  setHostnameResult: (result: HostnameResult | null) => void;
  setPlatformResult: (result: PlatformResult | null) => void;
  setIpAddressResult: (result: IpAddressResult | null) => void;
  setKernelVersionResult: (result: KernelVersionResult | null) => void;
  setCpuModelResult: (result: CpuModelResult | null) => void;
  setDistroFlavorResult: (result: DistroFlavorResult | null) => void;
  setSystemInfoResult: (result: SystemInfoResult | null) => void;
  setVirtualizationResult: (result: VirtualizationResult | null) => void;
  setMotherboardNameResult: (result: MotherboardNameResult | null) => void;
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

const setSystemInfoToState = (systemInfo: SystemInfoResult | null) => (state: MachineStore) => ({
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

const setHostnameResultToState = (result: HostnameResult | null) => (state: MachineStore) => ({
  machineState: result ? {
    hostname: result.hostname,
    platform: state.machineState?.platform || null,
    ipAddress: state.machineState?.ipAddress || null,
    kernelVersion: state.machineState?.kernelVersion || null,
    cpuModel: state.machineState?.cpuModel || null,
    distroFlavor: state.machineState?.distroFlavor || null,
    systemInfo: state.machineState?.systemInfo || null,
    virtualization: state.machineState?.virtualization || null,
    motherboardName: state.machineState?.motherboardName || null,
    hasTriedDetectingHostname: true,
    hasTriedDetectingPlatform: state.machineState?.hasTriedDetectingPlatform || false,
    hasTriedDetectingIpAddress: state.machineState?.hasTriedDetectingIpAddress || false,
    hasTriedDetectingKernelVersion: state.machineState?.hasTriedDetectingKernelVersion || false,
    hasTriedDetectingCpuModel: state.machineState?.hasTriedDetectingCpuModel || false,
    hasTriedDetectingDistroFlavor: state.machineState?.hasTriedDetectingDistroFlavor || false,
    hasTriedDetectingSystemInfo: state.machineState?.hasTriedDetectingSystemInfo || false,
    hasTriedDetectingVirtualization: state.machineState?.hasTriedDetectingVirtualization || false,
    hasTriedDetectingMotherboardName: state.machineState?.hasTriedDetectingMotherboardName || false
  } : state.machineState
});

const setPlatformResultToState = (result: PlatformResult | null) => (state: MachineStore) => ({
  machineState: result ? {
    hostname: state.machineState?.hostname || null,
    platform: result.platform,
    ipAddress: state.machineState?.ipAddress || null,
    kernelVersion: state.machineState?.kernelVersion || null,
    cpuModel: state.machineState?.cpuModel || null,
    distroFlavor: state.machineState?.distroFlavor || null,
    systemInfo: state.machineState?.systemInfo || null,
    virtualization: state.machineState?.virtualization || null,
    motherboardName: state.machineState?.motherboardName || null,
    hasTriedDetectingHostname: state.machineState?.hasTriedDetectingHostname || false,
    hasTriedDetectingPlatform: true,
    hasTriedDetectingIpAddress: state.machineState?.hasTriedDetectingIpAddress || false,
    hasTriedDetectingKernelVersion: state.machineState?.hasTriedDetectingKernelVersion || false,
    hasTriedDetectingCpuModel: state.machineState?.hasTriedDetectingCpuModel || false,
    hasTriedDetectingDistroFlavor: state.machineState?.hasTriedDetectingDistroFlavor || false,
    hasTriedDetectingSystemInfo: state.machineState?.hasTriedDetectingSystemInfo || false,
    hasTriedDetectingVirtualization: state.machineState?.hasTriedDetectingVirtualization || false,
    hasTriedDetectingMotherboardName: state.machineState?.hasTriedDetectingMotherboardName || false
  } : state.machineState
});

const setIpAddressResultToState = (result: IpAddressResult | null) => (state: MachineStore) => ({
  machineState: result ? {
    hostname: state.machineState?.hostname || null,
    platform: state.machineState?.platform || null,
    ipAddress: result.ipAddress,
    kernelVersion: state.machineState?.kernelVersion || null,
    cpuModel: state.machineState?.cpuModel || null,
    distroFlavor: state.machineState?.distroFlavor || null,
    systemInfo: state.machineState?.systemInfo || null,
    virtualization: state.machineState?.virtualization || null,
    motherboardName: state.machineState?.motherboardName || null,
    hasTriedDetectingHostname: state.machineState?.hasTriedDetectingHostname || false,
    hasTriedDetectingPlatform: state.machineState?.hasTriedDetectingPlatform || false,
    hasTriedDetectingIpAddress: true,
    hasTriedDetectingKernelVersion: state.machineState?.hasTriedDetectingKernelVersion || false,
    hasTriedDetectingCpuModel: state.machineState?.hasTriedDetectingCpuModel || false,
    hasTriedDetectingDistroFlavor: state.machineState?.hasTriedDetectingDistroFlavor || false,
    hasTriedDetectingSystemInfo: state.machineState?.hasTriedDetectingSystemInfo || false,
    hasTriedDetectingVirtualization: state.machineState?.hasTriedDetectingVirtualization || false,
    hasTriedDetectingMotherboardName: state.machineState?.hasTriedDetectingMotherboardName || false
  } : state.machineState
});

const setKernelVersionResultToState = (result: KernelVersionResult | null) => (state: MachineStore) => ({
  machineState: result ? {
    hostname: state.machineState?.hostname || null,
    platform: state.machineState?.platform || null,
    ipAddress: state.machineState?.ipAddress || null,
    kernelVersion: result.kernelVersion,
    cpuModel: state.machineState?.cpuModel || null,
    distroFlavor: state.machineState?.distroFlavor || null,
    systemInfo: state.machineState?.systemInfo || null,
    virtualization: state.machineState?.virtualization || null,
    motherboardName: state.machineState?.motherboardName || null,
    hasTriedDetectingHostname: state.machineState?.hasTriedDetectingHostname || false,
    hasTriedDetectingPlatform: state.machineState?.hasTriedDetectingPlatform || false,
    hasTriedDetectingIpAddress: state.machineState?.hasTriedDetectingIpAddress || false,
    hasTriedDetectingKernelVersion: true,
    hasTriedDetectingCpuModel: state.machineState?.hasTriedDetectingCpuModel || false,
    hasTriedDetectingDistroFlavor: state.machineState?.hasTriedDetectingDistroFlavor || false,
    hasTriedDetectingSystemInfo: state.machineState?.hasTriedDetectingSystemInfo || false,
    hasTriedDetectingVirtualization: state.machineState?.hasTriedDetectingVirtualization || false,
    hasTriedDetectingMotherboardName: state.machineState?.hasTriedDetectingMotherboardName || false
  } : state.machineState
});

const setCpuModelResultToState = (result: CpuModelResult | null) => (state: MachineStore) => ({
  machineState: result ? {
    hostname: state.machineState?.hostname || null,
    platform: state.machineState?.platform || null,
    ipAddress: state.machineState?.ipAddress || null,
    kernelVersion: state.machineState?.kernelVersion || null,
    cpuModel: result.cpuModel,
    distroFlavor: state.machineState?.distroFlavor || null,
    systemInfo: state.machineState?.systemInfo || null,
    virtualization: state.machineState?.virtualization || null,
    motherboardName: state.machineState?.motherboardName || null,
    hasTriedDetectingHostname: state.machineState?.hasTriedDetectingHostname || false,
    hasTriedDetectingPlatform: state.machineState?.hasTriedDetectingPlatform || false,
    hasTriedDetectingIpAddress: state.machineState?.hasTriedDetectingIpAddress || false,
    hasTriedDetectingKernelVersion: state.machineState?.hasTriedDetectingKernelVersion || false,
    hasTriedDetectingCpuModel: true,
    hasTriedDetectingDistroFlavor: state.machineState?.hasTriedDetectingDistroFlavor || false,
    hasTriedDetectingSystemInfo: state.machineState?.hasTriedDetectingSystemInfo || false,
    hasTriedDetectingVirtualization: state.machineState?.hasTriedDetectingVirtualization || false,
    hasTriedDetectingMotherboardName: state.machineState?.hasTriedDetectingMotherboardName || false
  } : state.machineState
});

const setDistroFlavorResultToState = (result: DistroFlavorResult | null) => (state: MachineStore) => ({
  machineState: result ? {
    hostname: state.machineState?.hostname || null,
    platform: state.machineState?.platform || null,
    ipAddress: state.machineState?.ipAddress || null,
    kernelVersion: state.machineState?.kernelVersion || null,
    cpuModel: state.machineState?.cpuModel || null,
    distroFlavor: result.distroFlavor,
    systemInfo: state.machineState?.systemInfo || null,
    virtualization: state.machineState?.virtualization || null,
    motherboardName: state.machineState?.motherboardName || null,
    hasTriedDetectingHostname: state.machineState?.hasTriedDetectingHostname || false,
    hasTriedDetectingPlatform: state.machineState?.hasTriedDetectingPlatform || false,
    hasTriedDetectingIpAddress: state.machineState?.hasTriedDetectingIpAddress || false,
    hasTriedDetectingKernelVersion: state.machineState?.hasTriedDetectingKernelVersion || false,
    hasTriedDetectingCpuModel: state.machineState?.hasTriedDetectingCpuModel || false,
    hasTriedDetectingDistroFlavor: true,
    hasTriedDetectingSystemInfo: state.machineState?.hasTriedDetectingSystemInfo || false,
    hasTriedDetectingVirtualization: state.machineState?.hasTriedDetectingVirtualization || false,
    hasTriedDetectingMotherboardName: state.machineState?.hasTriedDetectingMotherboardName || false
  } : state.machineState
});

const setSystemInfoResultToState = (result: SystemInfoResult | null) => (state: MachineStore) => ({
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
    hasTriedDetectingHostname: state.machineState?.hasTriedDetectingHostname || false,
    hasTriedDetectingPlatform: state.machineState?.hasTriedDetectingPlatform || false,
    hasTriedDetectingIpAddress: state.machineState?.hasTriedDetectingIpAddress || false,
    hasTriedDetectingKernelVersion: state.machineState?.hasTriedDetectingKernelVersion || false,
    hasTriedDetectingCpuModel: state.machineState?.hasTriedDetectingCpuModel || false,
    hasTriedDetectingDistroFlavor: state.machineState?.hasTriedDetectingDistroFlavor || false,
    hasTriedDetectingSystemInfo: true,
    hasTriedDetectingVirtualization: state.machineState?.hasTriedDetectingVirtualization || false,
    hasTriedDetectingMotherboardName: state.machineState?.hasTriedDetectingMotherboardName || false
  } : state.machineState
});

const setVirtualizationResultToState = (result: VirtualizationResult | null) => (state: MachineStore) => ({
  machineState: result ? {
    hostname: state.machineState?.hostname || null,
    platform: state.machineState?.platform || null,
    ipAddress: state.machineState?.ipAddress || null,
    kernelVersion: state.machineState?.kernelVersion || null,
    cpuModel: state.machineState?.cpuModel || null,
    distroFlavor: state.machineState?.distroFlavor || null,
    systemInfo: state.machineState?.systemInfo || null,
    virtualization: result.virtualization,
    motherboardName: state.machineState?.motherboardName || null,
    hasTriedDetectingHostname: state.machineState?.hasTriedDetectingHostname || false,
    hasTriedDetectingPlatform: state.machineState?.hasTriedDetectingPlatform || false,
    hasTriedDetectingIpAddress: state.machineState?.hasTriedDetectingIpAddress || false,
    hasTriedDetectingKernelVersion: state.machineState?.hasTriedDetectingKernelVersion || false,
    hasTriedDetectingCpuModel: state.machineState?.hasTriedDetectingCpuModel || false,
    hasTriedDetectingDistroFlavor: state.machineState?.hasTriedDetectingDistroFlavor || false,
    hasTriedDetectingSystemInfo: state.machineState?.hasTriedDetectingSystemInfo || false,
    hasTriedDetectingVirtualization: true,
    hasTriedDetectingMotherboardName: state.machineState?.hasTriedDetectingMotherboardName || false
  } : state.machineState
});

const setMotherboardNameResultToState = (result: MotherboardNameResult | null) => (state: MachineStore) => ({
  machineState: result ? {
    hostname: state.machineState?.hostname || null,
    platform: state.machineState?.platform || null,
    ipAddress: state.machineState?.ipAddress || null,
    kernelVersion: state.machineState?.kernelVersion || null,
    cpuModel: state.machineState?.cpuModel || null,
    distroFlavor: state.machineState?.distroFlavor || null,
    systemInfo: state.machineState?.systemInfo || null,
    virtualization: state.machineState?.virtualization || null,
    motherboardName: result.motherboardName,
    hasTriedDetectingHostname: state.machineState?.hasTriedDetectingHostname || false,
    hasTriedDetectingPlatform: state.machineState?.hasTriedDetectingPlatform || false,
    hasTriedDetectingIpAddress: state.machineState?.hasTriedDetectingIpAddress || false,
    hasTriedDetectingKernelVersion: state.machineState?.hasTriedDetectingKernelVersion || false,
    hasTriedDetectingCpuModel: state.machineState?.hasTriedDetectingCpuModel || false,
    hasTriedDetectingDistroFlavor: state.machineState?.hasTriedDetectingDistroFlavor || false,
    hasTriedDetectingSystemInfo: state.machineState?.hasTriedDetectingSystemInfo || false,
    hasTriedDetectingVirtualization: state.machineState?.hasTriedDetectingVirtualization || false,
    hasTriedDetectingMotherboardName: true
  } : state.machineState
});

const setMachineModelResultToState = (result: MachineModelResult | null) => (state: MachineStore) => ({
  machineState: result ? {
    hostname: state.machineState?.hostname || null,
    platform: state.machineState?.platform || null,
    ipAddress: state.machineState?.ipAddress || null,
    kernelVersion: state.machineState?.kernelVersion || null,
    cpuModel: state.machineState?.cpuModel || null,
    distroFlavor: state.machineState?.distroFlavor || null,
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
    virtualization: state.machineState?.virtualization || null,
    motherboardName: state.machineState?.motherboardName || null,
    hasTriedDetectingHostname: state.machineState?.hasTriedDetectingHostname || false,
    hasTriedDetectingPlatform: state.machineState?.hasTriedDetectingPlatform || false,
    hasTriedDetectingIpAddress: state.machineState?.hasTriedDetectingIpAddress || false,
    hasTriedDetectingKernelVersion: state.machineState?.hasTriedDetectingKernelVersion || false,
    hasTriedDetectingCpuModel: state.machineState?.hasTriedDetectingCpuModel || false,
    hasTriedDetectingDistroFlavor: state.machineState?.hasTriedDetectingDistroFlavor || false,
    hasTriedDetectingSystemInfo: state.machineState?.hasTriedDetectingSystemInfo || false,
    hasTriedDetectingVirtualization: state.machineState?.hasTriedDetectingVirtualization || false,
    hasTriedDetectingMotherboardName: state.machineState?.hasTriedDetectingMotherboardName || false
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

const createMachineActions = (set: (fn: (state: MachineStore) => Partial<MachineStore>) => void) => ({
  setHostname: (hostname: string | null) => set((state) => setHostnameToState(hostname)(state)),
  setPlatform: (platform: string | null) => set((state) => setPlatformToState(platform)(state)),
  setIpAddress: (ipAddress: string | null) => set((state) => setIpAddressToState(ipAddress)(state)),
  setKernelVersion: (kernelVersion: string | null) => set((state) => setKernelVersionToState(kernelVersion)(state)),
  setCpuModel: (cpuModel: string | null) => set((state) => setCpuModelToState(cpuModel)(state)),
  setDistroFlavor: (distroFlavor: string | null) => set((state) => setDistroFlavorToState(distroFlavor)(state)),
  setSystemInfo: (systemInfo: SystemInfoResult | null) => set((state) => setSystemInfoToState(systemInfo)(state)),
  setVirtualization: (virtualization: number | null) => set((state) => setVirtualizationToState(virtualization)(state)),
  setMotherboardName: (motherboardName: string | null) => set((state) => setMotherboardNameToState(motherboardName)(state)),
  setHostnameResult: (result: HostnameResult | null) => set((state) => setHostnameResultToState(result)(state)),
  setPlatformResult: (result: PlatformResult | null) => set((state) => setPlatformResultToState(result)(state)),
  setIpAddressResult: (result: IpAddressResult | null) => set((state) => setIpAddressResultToState(result)(state)),
  setKernelVersionResult: (result: KernelVersionResult | null) => set((state) => setKernelVersionResultToState(result)(state)),
  setCpuModelResult: (result: CpuModelResult | null) => set((state) => setCpuModelResultToState(result)(state)),
  setDistroFlavorResult: (result: DistroFlavorResult | null) => set((state) => setDistroFlavorResultToState(result)(state)),
  setSystemInfoResult: (result: SystemInfoResult | null) => set((state) => setSystemInfoResultToState(result)(state)),
  setVirtualizationResult: (result: VirtualizationResult | null) => set((state) => setVirtualizationResultToState(result)(state)),
  setMotherboardNameResult: (result: MotherboardNameResult | null) => set((state) => setMotherboardNameResultToState(result)(state)),
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
  setHasTriedDetectingMotherboardName: (hasTried: boolean) => set((state) => setHasTriedDetectingMotherboardNameToState(hasTried)(state))
});

export const useMachineStore = create<MachineStore>((set) => ({
  ...createInitialMachineState(),
  ...createMachineActions(set)
}));

export type { MachineState };
