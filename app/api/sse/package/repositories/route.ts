import { sseFactory } from '@/workflows/sseFactory';  
import { packageChains } from '../packageChains';

export const GET = sseFactory.createChainedSseCommandsHandler([
  packageChains.packageRepositoriesChain
]);
