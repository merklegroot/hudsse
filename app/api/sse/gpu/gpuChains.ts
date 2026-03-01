import { flexibleSseHandlerProps, flexibleChainProp, commandArgsChainProp } from '@/workflows/sseFactory';
import { platformType, platformUtil } from '@/utils/platformUtil';
import { parseGpuInfo, parseOpenGLRenderer } from '@/workflows/parseGpuInfo';
import { GpuInfoResult } from '@/models/SseMessage';
import { spawnAndGetDataWorkflow } from '@/workflows/spawnAndGetDataWorkflow';
import { SpawnOptions } from '@/models/SpawnOptions';

const currentPlatform = platformUtil.detectPlatform();

// GPU detection chain for Linux - try nvidia-smi first, then lspci
const gpuInfoChainLinux: commandArgsChainProp = {
    commandAndArgs: { 
        command: 'sh', 
        args: ['-c', 'nvidia-smi --query-gpu=index,name,memory.total,memory.used,memory.free,utilization.gpu,temperature.gpu,driver_version --format=csv,noheader,nounits 2>/dev/null || lspci -v | grep -A 20 -i "vga\\|3d\\|display"'] 
    },
    parser: parseGpuInfo,
    onSuccess: 'GPU info retrieved successfully'
};

// GPU detection chain for Windows
const gpuInfoChainWindows: commandArgsChainProp = {
    commandAndArgs: { 
        command: 'powershell.exe', 
        args: ['-ExecutionPolicy', 'Bypass', '-Command', 'Get-WmiObject -Class Win32_VideoController | ForEach-Object { Write-Output "$($_.Index),$($_.Name),$($_.AdapterRAM),0,0,$($_.AdapterRAM),0,0,$($_.DriverVersion)" }'] 
    },
    parser: parseGpuInfo,
    onSuccess: 'GPU info retrieved successfully'
};

const gpuInfoChain = currentPlatform === platformType.windows 
    ? gpuInfoChainWindows 
    : gpuInfoChainLinux;

// Combined GPU info chain that includes OpenGL renderer (Linux only)
const gpuInfoWithOpenGLChainLinux: flexibleChainProp = {
    workflow: async (props: flexibleSseHandlerProps) => {
        try {
            let allGpuOutput = '';
            
            // Send command message for GPU info
            props.sendMessage({
                type: 'command',
                contents: 'sh -c "nvidia-smi --query-gpu=index,name,memory.total,memory.used,memory.free,utilization.gpu,temperature.gpu,driver_version --format=csv,noheader,nounits 2>/dev/null || lspci -v | grep -A 20 -i \\"vga\\\\|3d\\\\|display\\""'
            });
            
            // Execute GPU info command
            const gpuSpawnOptions: SpawnOptions = {
                command: 'sh',
                args: ['-c', 'nvidia-smi --query-gpu=index,name,memory.total,memory.used,memory.free,utilization.gpu,temperature.gpu,driver_version --format=csv,noheader,nounits 2>/dev/null || lspci -v | grep -A 20 -i "vga\\|3d\\|display"'],
                timeout: 30000,
                dataCallback: (data: string) => {
                    allGpuOutput += data;
                    const lines = data.split('\n').filter(line => line.trim().length > 0);
                    for (const line of lines) {
                        props.sendMessage({
                            type: 'stdout',
                            contents: line.trim()
                        });
                    }
                }
            };
            
            const gpuResult = await spawnAndGetDataWorkflow.executeWithFallback(gpuSpawnOptions);
            
            if (!gpuResult.wasSuccessful) {
                props.onError(`Failed to retrieve GPU info: ${gpuResult.stderr}`);
                return;
            }
            
            const gpuInfo = parseGpuInfo(allGpuOutput);
            
            // Get OpenGL renderer
            let openGLRenderer: string | undefined = undefined;
            let allOpenGLOutput = '';
            
            try {
                // Send command message for OpenGL renderer
                props.sendMessage({
                    type: 'command',
                    contents: 'sh -c "glxinfo | grep \\"OpenGL renderer\\" 2>/dev/null || echo \\"\\""'
                });
                
                const openGLSpawnOptions: SpawnOptions = {
                    command: 'sh',
                    args: ['-c', 'glxinfo | grep "OpenGL renderer" 2>/dev/null || echo ""'],
                    timeout: 10000,
                    dataCallback: (data: string) => {
                        allOpenGLOutput += data;
                        const lines = data.split('\n').filter(line => line.trim().length > 0);
                        for (const line of lines) {
                            props.sendMessage({
                                type: 'stdout',
                                contents: line.trim()
                            });
                        }
                    }
                };
                
                const openGLResult = await spawnAndGetDataWorkflow.executeWithFallback(openGLSpawnOptions);
                
                if (openGLResult.wasSuccessful) {
                    const glRenderer = parseOpenGLRenderer(allOpenGLOutput);
                    openGLRenderer = glRenderer.openGLRenderer || undefined;
                }
            } catch {
                // glxinfo may not be available, that's ok
            }
            
            const combinedResult: GpuInfoResult = {
                gpus: gpuInfo.gpus,
                openGLRenderer: openGLRenderer
            };
            
            props.sendMessage({
                type: 'result',
                contents: 'GPU info retrieved successfully',
                result: JSON.stringify(combinedResult)
            });
        } catch (error) {
            props.onError(`Failed to retrieve GPU info: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    onSuccess: 'GPU info retrieved successfully'
};

// For Windows, just use the basic GPU info chain
const gpuInfoWithOpenGLChain = currentPlatform === platformType.windows 
    ? undefined 
    : gpuInfoWithOpenGLChainLinux;

export const gpuChains = {
    gpuInfoChain,
    gpuInfoWithOpenGLChain
};
