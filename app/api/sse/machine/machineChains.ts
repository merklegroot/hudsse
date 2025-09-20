import { parseSystemInfo } from '@/workflows/parseSystemInfo';
import { flexibleSseHandlerProps } from '@/workflows/sseFactory';
import { platformUtil } from '@/utils/platformUtil';

const detectPlatformChain = {
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

const systemInfoChain = {
    commandAndArgs: { command: './scripts/read_system_info.sh', args: [] },
    parser: parseSystemInfo,
    onSuccess: 'System information retrieved successfully'
};

export const machineChains = {
    detectPlatformChain,
    systemInfoChain
};