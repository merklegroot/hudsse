export type sseMessageType = 'stdout' | 'other' | 'result';

export interface SdkInfo {
    version: string;
    path: string;
}

export interface ListSdksResult {
    sdks: SdkInfo[];
}

export interface SseMessage {
    type: sseMessageType;
    contents: string;
    result?: string;
}