import { flexibleSseHandlerProps, sseFactory } from '@/workflows/sseFactory';
import { ssePathWorkflow } from '@/workflows/ssePathWorkflow';


export const GET = sseFactory.createFlexibleSseHandler(async (props: flexibleSseHandlerProps) => {
  const result = await ssePathWorkflow.executePath(props);
  props.sendMessage({ type: 'result', contents: 'Path retrieved successfully', result: JSON.stringify(result.parsedData) });
});
