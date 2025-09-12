import { parseDotnetRuntimes } from '../../../../../workflows/parseDotnetRuntimes';
import { sseFactory } from '@/workflows/sseFactory';

export const GET = sseFactory.createSseCommandHandlerWithParser(
  {
    command: 'dotnet',
    args: ['--list-runtimes']
  },
  parseDotnetRuntimes,
  'Runtime list parsed successfully'
);
