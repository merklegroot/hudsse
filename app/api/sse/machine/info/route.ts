import { sseFactory } from '@/workflows/sseFactory';  
import { machineChains } from '../machineChains';

export const GET = sseFactory.createChainedSseCommandsHandler([
  machineChains.detectPlatformChain,  
  machineChains.hostnameChain,
  machineChains.ipAddressChain,
  machineChains.kernelVersionChain,
  machineChains.cpuInfoChain,
  machineChains.distroFlavorChain,
  machineChains.machineModelChain,
  machineChains.motherboardNameChain,
  machineChains.packageManagerChain,
  // machineChains.systemInfoChain,
  machineChains.detectVirtualizationChain
]);
