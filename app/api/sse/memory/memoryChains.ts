import { flexibleSseHandlerProps, flexibleChainProp } from '@/workflows/sseFactory';
import { platformType, platformUtil } from '@/utils/platformUtil';
import { parseMemoryInfo } from '@/workflows/parseMemoryInfo';
import { MemoryInfoResult } from '@/models/SseMessage';
import { spawnAndGetDataWorkflow } from '@/workflows/spawnAndGetDataWorkflow';
import { SpawnOptions } from '@/models/SpawnOptions';

const currentPlatform = platformUtil.detectPlatform();

const memoryInfoChainLinux: flexibleChainProp = {
    workflow: async (props: flexibleSseHandlerProps) => {
        try {
            let allProcessOutput = '';

            // Get top processes by memory usage
            props.sendMessage({
                type: 'command',
                contents: 'ps aux --sort=-%mem --no-headers | head -3'
            });

            const processSpawnOptions: SpawnOptions = {
                command: 'sh',
                args: ['-c', 'ps aux --sort=-%mem --no-headers | head -3'],
                timeout: 30000,
                dataCallback: (data: string) => {
                    allProcessOutput += data;
                    const lines = data.split('\n').filter(line => line.trim().length > 0);
                    for (const line of lines) {
                        props.sendMessage({
                            type: 'stdout',
                            contents: line.trim()
                        });
                    }
                }
            };

            const processResult = await spawnAndGetDataWorkflow.executeWithFallback(processSpawnOptions);

            if (!processResult.wasSuccessful) {
                props.onError(`Failed to retrieve memory info: ${processResult.stderr}`);
                return;
            }

            const memoryInfo = parseMemoryInfo(allProcessOutput);

            props.sendMessage({
                type: 'result',
                contents: 'Memory info retrieved successfully',
                result: JSON.stringify(memoryInfo)
            });
        } catch (error) {
            props.onError(`Failed to retrieve memory info: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    onSuccess: 'Memory info retrieved successfully'
};

const memoryInfoChainMac: flexibleChainProp = {
    workflow: async (props: flexibleSseHandlerProps) => {
        try {
            let allProcessOutput = '';

            // Get top processes by memory usage
            props.sendMessage({
                type: 'command',
                contents: 'ps aux -r | head -4 | tail -3'
            });

            const processSpawnOptions: SpawnOptions = {
                command: 'sh',
                args: ['-c', 'ps aux -r | head -4 | tail -3'],
                timeout: 30000,
                dataCallback: (data: string) => {
                    allProcessOutput += data;
                    const lines = data.split('\n').filter(line => line.trim().length > 0);
                    for (const line of lines) {
                        props.sendMessage({
                            type: 'stdout',
                            contents: line.trim()
                        });
                    }
                }
            };

            const processResult = await spawnAndGetDataWorkflow.executeWithFallback(processSpawnOptions);

            if (!processResult.wasSuccessful) {
                props.onError(`Failed to retrieve memory info: ${processResult.stderr}`);
                return;
            }

            const memoryInfo = parseMemoryInfo(allProcessOutput);

            props.sendMessage({
                type: 'result',
                contents: 'Memory info retrieved successfully',
                result: JSON.stringify(memoryInfo)
            });
        } catch (error) {
            props.onError(`Failed to retrieve memory info: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    onSuccess: 'Memory info retrieved successfully'
};

const memoryInfoChainWindows: flexibleChainProp = {
    workflow: async (props: flexibleSseHandlerProps) => {
        try {
            let allProcessOutput = '';

            // Get top processes by memory usage using PowerShell
            const powershellCommand = 'Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 3 | ForEach-Object { Write-Output "Node,$($_.ProcessName),$($_.Id),$($_.WorkingSet64)" }';
            
            props.sendMessage({
                type: 'command',
                contents: `powershell.exe -ExecutionPolicy Bypass -Command "${powershellCommand}"`
            });

            const processSpawnOptions: SpawnOptions = {
                command: 'powershell.exe',
                args: ['-ExecutionPolicy', 'Bypass', '-Command', powershellCommand],
                timeout: 30000,
                dataCallback: (data: string) => {
                    allProcessOutput += data;
                    const lines = data.split('\n').filter(line => line.trim().length > 0);
                    for (const line of lines) {
                        props.sendMessage({
                            type: 'stdout',
                            contents: line.trim()
                        });
                    }
                }
            };

            const processResult = await spawnAndGetDataWorkflow.executeWithFallback(processSpawnOptions);

            if (!processResult.wasSuccessful) {
                props.onError(`Failed to retrieve memory info: ${processResult.stderr}`);
                return;
            }

            const memoryInfo = parseMemoryInfo(allProcessOutput);

            props.sendMessage({
                type: 'result',
                contents: 'Memory info retrieved successfully',
                result: JSON.stringify(memoryInfo)
            });
        } catch (error) {
            props.onError(`Failed to retrieve memory info: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    onSuccess: 'Memory info retrieved successfully'
};

const memoryInfoChain = currentPlatform === platformType.windows
    ? memoryInfoChainWindows
    : currentPlatform === platformType.mac
    ? memoryInfoChainMac
    : memoryInfoChainLinux;

export const memoryChains = {
    memoryInfoChain
};
