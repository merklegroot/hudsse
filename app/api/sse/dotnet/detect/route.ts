
import { parseDotnetRuntimes } from '@/workflows/parseDotnetRuntimes';
import { parseDotnetSdks } from '../../../../../workflows/parseDotnetSdks';
import { sseFactory } from '@/workflows/sseFactory';

export const GET = sseFactory.createChainedSseCommandsHandler([
  {
    commandAndArgs: { command: 'dotnet', args: ['--list-sdks'] },
    parser: parseDotnetSdks,
    onSuccess: 'SDK list parsed successfully'
  },
  {
    commandAndArgs: { command: 'dotnet', args: ['--list-runtimes'] },
    parser: parseDotnetRuntimes,
    onSuccess: 'Runtime list parsed successfully'
  }
]);

