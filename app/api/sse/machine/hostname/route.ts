import { sseFactory } from '@/workflows/sseFactory';
import { parseHostname } from '@/workflows/parseHostname';

export const GET = sseFactory.createSseCommandHandler(
  {
    commandAndArgs: { command: 'hostname', args: [] },
    parser: parseHostname,
    onSuccess: 'Hostname retrieved successfully'
  }
);
