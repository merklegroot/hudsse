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

export interface CpuModelResult {
    cpuModel: string;
}

export interface PlatformResult {
    platform: string;
}

export interface VirtualizationResult {
    virtualization: number;
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

export interface PathResult {
    path: string;
    folders: string[];
}

export interface SseMessage {
    type: SseMessageType;
    contents: string;
    result?: string;
}