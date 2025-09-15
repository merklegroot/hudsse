export interface SpawnResult {
    wasSuccessful: boolean;
    stdout: string;
    stderr: string;
    exitCode: number | null;
}

export interface SpawnResultWithParsedData<T> extends SpawnResult {
    parsedData: T | undefined;
}