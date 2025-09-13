
import { parseDotnetSdks } from '../../../../../workflows/parseDotnetSdks';
import { sseFactory } from '@/workflows/sseFactory';

export const GET = sseFactory.createSseCommandHandler(
  {
    commandAndArgs: { command: 'dotnet', args: ['--list-sdks'] },
    parser: parseDotnetSdks,
    onSuccess: 'SDK list parsed successfully'
  }
);