import { parseWhichDotnet } from '../../../../../workflows/parseWhichDotnet';
import { sseFactory } from '@/workflows/sseFactory';

export const GET = sseFactory.createSseCommandHandlerWithParser(
  {
    command: 'which',
    args: ['dotnet']
  },
  parseWhichDotnet,
  'dotnet location found successfully'
);
