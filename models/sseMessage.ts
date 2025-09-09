export type sseMessageType = 'stdout' | 'other' | 'result';

export interface sdkInfo {
    version: string;
    path: string;
}

export interface listSdksResult {
    sdks: sdkInfo[];
}

export interface sseMessage {
    type: sseMessageType;
    contents: string;
}