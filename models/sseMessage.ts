export type sseMessageType = 'stdout' | 'other';

export interface sseMessage {
    type: sseMessageType;
    contents: string;
}