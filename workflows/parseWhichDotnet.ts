import { WhichDotNetResult } from '../models/SseMessage';

export function parseWhichDotnet(output: string): WhichDotNetResult {
  const trimmedOutput = output.trim();
  
  if (!trimmedOutput) {
    throw new Error('No output from which command');
  }
  
  // The 'which' command returns the full path to the executable
  // We'll return the first non-empty line as the path
  const lines = trimmedOutput.split('\n').filter(line => line.trim().length > 0);
  
  if (lines.length === 0) {
    throw new Error('No valid path found in which command output');
  }
  
  return {
    path: lines[0].trim()
  };
}
