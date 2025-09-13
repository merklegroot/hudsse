import { parseDotnetRuntimes } from '../../../../../workflows/parseDotnetRuntimes';
import { sseFactory } from '@/workflows/sseFactory';

export const GET = sseFactory.createSseCommandHandler(
  {
    commandAndArgs: { command: 'dotnet', args: ['--list-runtimes'] },
    parser: parseDotnetRuntimes,
    onSuccess: 'Runtime list parsed successfully'
  }
);