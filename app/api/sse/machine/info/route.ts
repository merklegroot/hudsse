import { sseFactory } from '@/workflows/sseFactory';  
import { machineChains } from '../machineChains';

export const GET = sseFactory.createChainedSseCommandsHandler([
  machineChains.hostNameChain,
  machineChains.detectPlatformChain,
  machineChains.ipAddressChain
]);
