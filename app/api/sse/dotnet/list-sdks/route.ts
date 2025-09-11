
import { parseDotnetSdks } from '../../../../../workflows/parseDotnetSdks';
import { sseFactory } from '@/workflows/sseFactory';

export const GET = sseFactory.createSseCommandHandlerWithParser(
  {
    command: 'dotnet',
    args: ['--list-sdks']
  },
  parseDotnetSdks,
  'SDK list parsed successfully'
);

