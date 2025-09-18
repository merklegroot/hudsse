import { sseFactory } from '@/workflows/sseFactory';
import { parseHostname } from '@/workflows/parseHostname';

sseFactory.createChainedSseCommandsHandler([
  {
    commandAndArgs: { command: 'hostname', args: [] },
    parser: parseHostname,
    onSuccess: 'Hostname retrieved successfully'
  }
]);
