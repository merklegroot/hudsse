export interface SpawnResult {
    wasSuccessful: boolean;
    stdout: string;
    stderr: string;
    exitCode: number | null;
}