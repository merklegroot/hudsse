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
    // Cache sizes (in KB)
    l1dCache?: number;
    l1iCache?: number;
    l2Cache?: number;
    l3Cache?: number;
}

export interface DistroFlavorResult {
    distroFlavor: string;
}

export interface GpuResult {
    index: number;
    name: string;
    bus: string;
    revision: string;
    driver: string;
    memoryTotal?: string;
    memoryUsed?: string;
    memoryFree?: string;
    utilization?: number;
    temperature?: number;
}

export interface GpuInfoResult {
    gpus: GpuResult[];
    openGLRenderer?: string;
}

export interface DiskInfo {
    mount: string;
    total: string;
    used: string;
    available: string;
    usedPercent: number;
    filesystem: string;
}

export interface PhysicalDisk {
    device: string;
    size: string;
    model: string;
    type: string;
}

export interface DiskInfoResult {
    disks: DiskInfo[];
    physicalDisks: PhysicalDisk[];
}

export interface TopProcess {
    pid: string;
    name: string;
    memoryUsage: string;
    memoryPercent: number;
    memoryAbsolute: string;
}

export interface MemoryInfoResult {
    totalRAM: string;
    freeRAM: string;
    usedRAM: string;
    topProcesses: TopProcess[];
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

export interface ProfileFile {
    path: string;
    description: string;
    exists: boolean;
    isMainProfile?: boolean;
}

export interface ProfileInfo {
    platform: string;
    platformType: string;
    distroInfo?: string;
    distroFamily?: string;
    profileFiles?: ProfileFile[];
    profileInstructions: {
        title: string;
        description: string;
        methods: {
            name: string;
            description: string;
            steps: string[];
        }[];
    };
}

export interface SseMessage {
    type: SseMessageType;
    contents: string;
    result?: string;
}