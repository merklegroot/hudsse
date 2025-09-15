import { sseFactory } from '@/workflows/sseFactory';

export const GET = sseFactory.createSseCommandHandler({
  commandAndArgs: { command: 'bash', args: ['/home/goose/repo/sse/scripts/step_counter.sh'] },
  onSuccess: 'Step counter script completed successfully'
});
