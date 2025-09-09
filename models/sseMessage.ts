export type sseMessageType = 'other';

export interface sseMessage {
    type: sseMessageType;
    contents: string;
}