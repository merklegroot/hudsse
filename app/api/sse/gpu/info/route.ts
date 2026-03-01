import { sseFactory } from '@/workflows/sseFactory';  
import { gpuChains } from '../gpuChains';
import { platformType, platformUtil } from '@/utils/platformUtil';

const currentPlatform = platformUtil.detectPlatform();

export const GET = currentPlatform === platformType.windows
  ? sseFactory.createChainedSseCommandsHandler([
      gpuChains.gpuInfoChain,
    ])
  : gpuChains.gpuInfoWithOpenGLChain
    ? sseFactory.createChainedSseCommandsHandler([
        gpuChains.gpuInfoWithOpenGLChain,
      ])
    : sseFactory.createChainedSseCommandsHandler([
        gpuChains.gpuInfoChain,
      ]);
