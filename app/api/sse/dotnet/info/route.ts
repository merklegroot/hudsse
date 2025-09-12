import { parseDotnetInfo } from '../../../../../workflows/parseDotnetInfo';
import { sseFactory } from '@/workflows/sseFactory';

export const GET = sseFactory.createSseCommandHandlerWithParser(
  {
    command: 'dotnet',
    args: ['--info']
  },
  parseDotnetInfo,
  'dotnet info parsed successfully'
);
