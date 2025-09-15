import { sseDotNetWorkflow } from '@/workflows/sseDotNetWorkflow';
import { parseDotnetInfo } from '../../../../../workflows/parseDotnetInfo';
import { flexibleSseHandlerProps, sseFactory } from '@/workflows/sseFactory';

export const GET = sseFactory.createFlexibleSseHandler(async (props: flexibleSseHandlerProps) => {
  await sseDotNetWorkflow.executeDotNetInfo(props);
});
