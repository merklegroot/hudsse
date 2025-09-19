import { sseFactory } from '@/workflows/sseFactory';
import { parseIpAddress } from '@/workflows/parseIpAddress';

export const GET = sseFactory.createSseCommandHandler(
  {
    commandAndArgs: { command: 'hostname', args: ['-I'] },
    parser: parseIpAddress,
    onSuccess: 'IP address retrieved successfully'
  }
);

