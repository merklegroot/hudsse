import { parseWhichDotnet } from '../../../../../workflows/parseWhichDotnet';
import { sseFactory } from '@/workflows/sseFactory';

export const GET = sseFactory.createSseCommandHandler(
  {
    commandAndArgs: { command: 'which', args: ['dotnet'] },
    parser: parseWhichDotnet,
    onSuccess: 'dotnet location found successfully'
  }
);
