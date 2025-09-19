import { flexibleSseHandlerProps, sseFactory } from '@/workflows/sseFactory';
import { parseHostname } from '@/workflows/parseHostname';
import { platform } from 'os';

export enum platformType {
  linux = 'linux',
  windows = 'windows',
  mac = 'mac',
  aix = 'aix',
  freebsd = 'freebsd',
  openbsd = 'openbsd',
  sunos = 'sunos',
  android = 'android',
  unknown = 'unknown'
}

export function detectPlatform(): platformType {
  const plat = (platform() || '').trim().toLowerCase();
  
  if (plat === 'linux') return platformType.linux;
  if (plat === 'win32') return platformType.windows;
  if (plat === 'darwin') return platformType.mac;
  if (plat === 'aix') return platformType.aix;
  if (plat === 'freebsd') return platformType.freebsd;
  if (plat === 'openbsd') return platformType.openbsd;
  if (plat === 'sunos') return platformType.sunos;
  if (plat === 'android') return platformType.android;
  
  return platformType.unknown;
}

export const GET = sseFactory.createChainedSseCommandsHandler([
  {
    commandAndArgs: { command: 'hostname', args: [] },
    parser: parseHostname,
    onSuccess: 'Hostname retrieved successfully'
  },{
    workflow: async (props: flexibleSseHandlerProps) => {
      const detectedPlatform = detectPlatform();
      const platformResult = { platform: detectedPlatform };
      props.sendMessage({ 
        type: 'result', 
        contents: `Platform: ${detectedPlatform}`,
        result: JSON.stringify(platformResult)
      });
    },
    onSuccess: 'Platform detected successfully'
  }
]);
