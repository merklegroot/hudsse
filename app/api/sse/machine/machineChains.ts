import { parseSystemInfo } from '@/workflows/parseSystemInfo';
import { flexibleSseHandlerProps, flexibleChainProp, commandArgsChainProp } from '@/workflows/sseFactory';
import { platformUtil } from '@/utils/platformUtil';
import { virtualizationUtil } from '@/utils/virtualizationUtil';

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

const systemInfoChain: commandArgsChainProp = {
    commandAndArgs: { command: './scripts/read_system_info.sh', args: [] },
    parser: parseSystemInfo,
    onSuccess: 'System information retrieved successfully'
};

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

export const machineChains: {
    detectPlatformChain: flexibleChainProp;
    systemInfoChain: commandArgsChainProp;
    detectVirtualizationChain: flexibleChainProp;
} = {
    detectPlatformChain,
    systemInfoChain,
    detectVirtualizationChain
};