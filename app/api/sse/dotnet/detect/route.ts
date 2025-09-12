
import { parseDotnetRuntimes } from '@/workflows/parseDotnetRuntimes';
import { parseDotnetSdks } from '../../../../../workflows/parseDotnetSdks';
import { sseFactory } from '@/workflows/sseFactory';

export const GET = sseFactory.createChainedSseCommandsHandlerWithParsers([
  {
    commandAndArgs: { command: 'dotnet', args: ['--list-sdks'] },
    parser: parseDotnetSdks,
    successMessage: 'SDK list parsed successfully'
  },
  {
    commandAndArgs: { command: 'dotnet', args: ['--list-runtimes'] },
    parser: parseDotnetRuntimes,
    successMessage: 'Runtime list parsed successfully'
  }
]);

