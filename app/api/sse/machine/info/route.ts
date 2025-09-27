import { sseFactory } from '@/workflows/sseFactory';  
import { machineChains } from '../machineChains';

export const GET = sseFactory.createChainedSseCommandsHandler([
  machineChains.detectPlatformChain,
  machineChains.hostnameChain,
  machineChains.systemInfoChain,
  machineChains.detectVirtualizationChain
]);
