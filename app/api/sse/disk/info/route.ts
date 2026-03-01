import { sseFactory } from '@/workflows/sseFactory';
import { diskChains } from '../diskChains';

export const GET = sseFactory.createChainedSseCommandsHandler([
  diskChains.diskInfoChain,
]);
