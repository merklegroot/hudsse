import { sseFactory } from '@/workflows/sseFactory';  
import { machineChains } from '../../machine/machineChains';

export const GET = sseFactory.createChainedSseCommandsHandler([
  machineChains.packageManagerChain
]);
