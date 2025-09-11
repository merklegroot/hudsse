export type SseMessageType = 'other' | 'command' | 'stdout' | 'result';

export interface SdkInfo {
    version: string;
    path: string;
}

export interface ListSdksResult {
    sdks: SdkInfo[];
}

export interface SseMessage {
    type: SseMessageType;
    contents: string;
    result?: string;
}