import { flexibleSseHandlerProps, flexibleChainProp, commandArgsChainProp } from '@/workflows/sseFactory';
import { platformType, platformUtil } from '@/utils/platformUtil';
import { parseDiskInfo, parsePhysicalDisks } from '@/workflows/parseDiskInfo';
import { DiskInfoResult } from '@/models/SseMessage';
import { spawnAndGetDataWorkflow } from '@/workflows/spawnAndGetDataWorkflow';
import { SpawnOptions } from '@/models/SpawnOptions';

const currentPlatform = platformUtil.detectPlatform();

// Combined disk info chain that gets both disk usage and physical disks
const diskInfoChainLinux: flexibleChainProp = {
    workflow: async (props: flexibleSseHandlerProps) => {
        try {
            let allDiskOutput = '';
            let allPhysicalDiskOutput = '';

            // Get disk usage info
            props.sendMessage({
                type: 'command',
                contents: 'df -h --output=source,target,size,used,avail,pcent'
            });

            const diskSpawnOptions: SpawnOptions = {
                command: 'df',
                args: ['-h', '--output=source,target,size,used,avail,pcent'],
                timeout: 30000,
                dataCallback: (data: string) => {
                    allDiskOutput += data;
                    const lines = data.split('\n').filter(line => line.trim().length > 0);
                    for (const line of lines) {
                        props.sendMessage({
                            type: 'stdout',
                            contents: line.trim()
                        });
                    }
                }
            };

            const diskResult = await spawnAndGetDataWorkflow.executeWithFallback(diskSpawnOptions);

            if (!diskResult.wasSuccessful) {
                props.onError(`Failed to retrieve disk info: ${diskResult.stderr}`);
                return;
            }

            const disks = parseDiskInfo(allDiskOutput);

            // Get physical disk info
            props.sendMessage({
                type: 'command',
                contents: 'lsblk -d -o NAME,SIZE,MODEL,ROTA -n'
            });

            const physicalDiskSpawnOptions: SpawnOptions = {
                command: 'sh',
                args: ['-c', 'lsblk -d -o NAME,SIZE,MODEL,ROTA -n 2>/dev/null || echo ""'],
                timeout: 30000,
                dataCallback: (data: string) => {
                    allPhysicalDiskOutput += data;
                    const lines = data.split('\n').filter(line => line.trim().length > 0);
                    for (const line of lines) {
                        props.sendMessage({
                            type: 'stdout',
                            contents: line.trim()
                        });
                    }
                }
            };

            const physicalDiskResult = await spawnAndGetDataWorkflow.executeWithFallback(physicalDiskSpawnOptions);
            const physicalDisks = physicalDiskResult.wasSuccessful ? parsePhysicalDisks(allPhysicalDiskOutput) : [];

            const combinedResult: DiskInfoResult = {
                disks,
                physicalDisks
            };

            props.sendMessage({
                type: 'result',
                contents: 'Disk info retrieved successfully',
                result: JSON.stringify(combinedResult)
            });
        } catch (error) {
            props.onError(`Failed to retrieve disk info: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    onSuccess: 'Disk info retrieved successfully'
};

const diskInfoChainWindows: flexibleChainProp = {
    workflow: async (props: flexibleSseHandlerProps) => {
        try {
            let allDiskOutput = '';
            let allPhysicalDiskOutput = '';

            // Get disk usage info
            props.sendMessage({
                type: 'command',
                contents: 'wmic logicaldisk get size,freespace,caption /format:csv'
            });

            const diskSpawnOptions: SpawnOptions = {
                command: 'wmic',
                args: ['logicaldisk', 'get', 'size,freespace,caption', '/format:csv'],
                timeout: 30000,
                dataCallback: (data: string) => {
                    allDiskOutput += data;
                    const lines = data.split('\n').filter(line => line.trim().length > 0);
                    for (const line of lines) {
                        props.sendMessage({
                            type: 'stdout',
                            contents: line.trim()
                        });
                    }
                }
            };

            const diskResult = await spawnAndGetDataWorkflow.executeWithFallback(diskSpawnOptions);

            if (!diskResult.wasSuccessful) {
                props.onError(`Failed to retrieve disk info: ${diskResult.stderr}`);
                return;
            }

            const disks = parseDiskInfo(allDiskOutput);

            // Get physical disk info
            props.sendMessage({
                type: 'command',
                contents: 'wmic diskdrive get size,model,caption /format:csv'
            });

            const physicalDiskSpawnOptions: SpawnOptions = {
                command: 'wmic',
                args: ['diskdrive', 'get', 'size,model,caption', '/format:csv'],
                timeout: 30000,
                dataCallback: (data: string) => {
                    allPhysicalDiskOutput += data;
                    const lines = data.split('\n').filter(line => line.trim().length > 0);
                    for (const line of lines) {
                        props.sendMessage({
                            type: 'stdout',
                            contents: line.trim()
                        });
                    }
                }
            };

            const physicalDiskResult = await spawnAndGetDataWorkflow.executeWithFallback(physicalDiskSpawnOptions);
            const physicalDisks = physicalDiskResult.wasSuccessful ? parsePhysicalDisks(allPhysicalDiskOutput) : [];

            const combinedResult: DiskInfoResult = {
                disks,
                physicalDisks
            };

            props.sendMessage({
                type: 'result',
                contents: 'Disk info retrieved successfully',
                result: JSON.stringify(combinedResult)
            });
        } catch (error) {
            props.onError(`Failed to retrieve disk info: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    onSuccess: 'Disk info retrieved successfully'
};

const diskInfoChain = currentPlatform === platformType.windows
    ? diskInfoChainWindows
    : diskInfoChainLinux;

export const diskChains = {
    diskInfoChain
};
