export type SseMessageType = 'other' | 'command' | 'stdout' | 'result';

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

export interface ListRuntimesResult {
    runtimes: RuntimeInfo[];
}

export interface WhichDotNetResult {
    path: string;
}

export interface SseMessage {
    type: SseMessageType;
    contents: string;
    result?: string;
}