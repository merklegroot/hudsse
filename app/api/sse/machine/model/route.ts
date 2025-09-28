import { machineChains } from '../machineChains';
import { createSseHandler } from '@/workflows/sseFactory';

export const GET = createSseHandler([machineChains.machineModelChain]);
