import { sseFactory } from '@/workflows/sseFactory';
import { parsePath } from '@/workflows/parsePath';

export const GET = sseFactory.createSseCommandHandler(
  {
    commandAndArgs: { command: 'bash', args: ['-c', 'echo $PATH'] },
    parser: parsePath,
    onSuccess: 'Path retrieved successfully'
  }
);

