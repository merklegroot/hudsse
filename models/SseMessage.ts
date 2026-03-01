export type SseMessageType = 'other' | 'command' | 'stdout' | 'result' | 'info';

export interface SdkInfo {
    version: string;
    path: string;
}

export interface ListSdksResult {
    sdks: SdkInfo[];
}

export interface RuntimeInfo {
    name: string;
    version: string;
    path: string;
}

export interface AppVersions {
    [appName: string]: string[];
}

export interface ListRuntimesResult {
    runtimes: RuntimeInfo[];
}

export interface WhichDotNetResult {
    path: string;
}

export interface DotNetSdkInfo {
    version: string;
    commit: string;
    workloadVersion: string;
    msbuildVersion: string;
}

export interface RuntimeEnvironment {
    osName: string;
    osVersion: string;
    osPlatform: string;
    rid: string;
    basePath: string;
}

export interface DotNetHost {
    version: string;
    architecture: string;
    commit: string;
}

export interface InstalledSdk {
    version: string;
    path: string;
}

export interface InstalledRuntime {
    name: string;
    version: string;
    path: string;
}

export interface DotNetInfoResult {
    sdk: DotNetSdkInfo;
    runtimeEnvironment: RuntimeEnvironment;
    host: DotNetHost;
    installedSdks: InstalledSdk[];
    installedRuntimes: InstalledRuntime[];
    workloadsInstalled: string;
    otherArchitectures: string[];
    environmentVariables: Record<string, string>;
    globalJsonFile: string;
}

export interface HostnameResult {
    hostname: string;
}

export interface IpAddressResult {
    ipAddress: string;
}

export interface KernelVersionResult {
    kernelVersion: string;
}

export interface CpuInfoResult {
    cpuModel: string;
    cpuCores?: number;
    architecture?: string;
    cpuMhz?: number;
    threadsPerCore?: number;
    coresPerSocket?: number;
    sockets?: number;
    virtualization?: string;
    cpuFlags?: string;
    vendor?: string;
    // CPU Feature Flags
    sse?: boolean;
    sse2?: boolean;
    sse3?: boolean;
    ssse3?: boolean;
    sse4_1?: boolean;
    sse4_2?: boolean;
    avx?: boolean;
    avx2?: boolean;
    avx512?: boolean;
    fma?: boolean;
    aes?: boolean;
    sha?: boolean;
    neon?: boolean;
}

export interface DistroFlavorResult {
    distroFlavor: string;
}

export interface PlatformResult {
    platform: string;
}

export interface VirtualizationResult {
    virtualization: number;
}

export interface MachineModelResult {
    productName: string | null;
    boardName: string | null;
    manufacturer: string | null;
}

export interface MotherboardNameResult {
    motherboardName: string | null;
}

export interface PackageManagerResult {
    packageManager: string | null;
}

export interface PathResult {
    path: string;
    folders: string[];
}

export interface SystemInfoResult {
    hostname: string | null;
    ipAddress: string | null;
    kernelVersion: string | null;
    cpuModel: string | null;
    baseDistro: string | null;
    desktopEnvironment: string | null;
    productName: string | null;
    boardName: string | null;
}

export interface SseMessage {
    type: SseMessageType;
    contents: string;
    result?: string;
}