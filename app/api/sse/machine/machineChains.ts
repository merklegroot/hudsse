import { parseHostname } from '@/workflows/parseHostname';
import { parseIpAddress } from '@/workflows/parseIpAddress';
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

const hostNameChain = {
    commandAndArgs: { command: 'hostname', args: [] },
    parser: parseHostname,
    onSuccess: 'Hostname retrieved successfully'
};

const ipAddressChain = {
    commandAndArgs: { command: 'hostname', args: ['-I'] },
    parser: parseIpAddress,
    onSuccess: 'IP address retrieved successfully'
};

export const machineChains = {
    hostNameChain,
    ipAddressChain,
    detectPlatformChain
};