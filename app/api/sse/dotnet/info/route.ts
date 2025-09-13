import { parseDotnetInfo } from '../../../../../workflows/parseDotnetInfo';
import { sseFactory } from '@/workflows/sseFactory';

export const GET = sseFactory.createSseCommandHandler({
  commandAndArgs: { command: 'dotnet', args: ['--info'] },
  parser: parseDotnetInfo,
  onSuccess: 'dotnet info parsed successfully'
});