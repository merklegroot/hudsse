import { parseSystemInfo } from '@/workflows/parseSystemInfo';
import { flexibleSseHandlerProps, flexibleChainProp, commandArgsChainProp } from '@/workflows/sseFactory';
import { platformType, platformUtil } from '@/utils/platformUtil';
import { virtualizationUtil } from '@/utils/virtualizationUtil';
import { platform } from 'os';
import { parseHostname } from '@/workflows/parseHostname';

const detectPlatformChain: flexibleChainProp = {
    workflow: async (props: flexibleSseHandlerProps) => {
        const detectedPlatform = platformUtil.detectPlatform();
        const platformResult = { platform: detectedPlatform };

        props.sendMessage({
            type: 'result',
            contents: `Platform: ${detectedPlatform}`,
            result: JSON.stringify(platformResult)
        });
    },
    onSuccess: 'Platform detected successfully'
};

const currentPlatform = platformUtil.detectPlatform();

const hostnameChainLinux: commandArgsChainProp = {
    commandAndArgs: { command: 'hostname', args: [] },
    parser: parseHostname,
    onSuccess: 'Hostname retrieved successfully'
};

const hostNameChainWindows: commandArgsChainProp = {
    commandAndArgs: { command: 'powershell.exe', args: ['-ExecutionPolicy', 'Bypass', '-Command', '[System.Net.Dns]::GetHostName()'] },
    parser: parseHostname,
    onSuccess: 'Hostname retrieved successfully'
};

const hostnameChain = currentPlatform === platformType.windows 
    ? hostNameChainWindows 
    : hostnameChainLinux;

const systemInfoChainLinux: commandArgsChainProp = {
    commandAndArgs: { command: './scripts/read_system_info.sh', args: [] },
    parser: parseSystemInfo,
    onSuccess: 'System information retrieved successfully'
};

const systemInfoChainWindows: commandArgsChainProp = {
    commandAndArgs: { command: 'powershell.exe', args: ['-ExecutionPolicy', 'Bypass', '-File', './scripts/read_system_info.ps1'] },
    parser: parseSystemInfo,
    onSuccess: 'System information retrieved successfully'
};

const systemInfoChain = currentPlatform === platformType.windows 
    ? systemInfoChainWindows 
    : systemInfoChainLinux;

const detectVirtualizationChain: flexibleChainProp = {
    workflow: async (props: flexibleSseHandlerProps) => {
        const detectedVirtualization = virtualizationUtil.getVirtualizationFromEnv();
        const virtualizationResult = { virtualization: detectedVirtualization };

        props.sendMessage({
            type: 'result',
            contents: `Virtualization: ${virtualizationUtil.getVirtualizationFriendlyName(detectedVirtualization)}`,
            result: JSON.stringify(virtualizationResult)
        });
    },
    onSuccess: 'Virtualization detected successfully'
};

export const machineChains = {
    detectPlatformChain,
    hostnameChain,
    systemInfoChain,
    detectVirtualizationChain
};