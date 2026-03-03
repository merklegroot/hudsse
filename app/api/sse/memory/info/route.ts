import { sseFactory } from '@/workflows/sseFactory';
import { memoryChains } from '../memoryChains';

export const GET = sseFactory.createChainedSseCommandsHandler([
  memoryChains.memoryInfoChain,
]);
