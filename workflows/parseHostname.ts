import { HostnameResult } from '../models/SseMessage';

export function parseHostname(output: string): HostnameResult {
  const trimmedOutput = output.trim();
  
  if (!trimmedOutput) {
    throw new Error('No output from hostname command');
  }
  
  // The 'hostname' command returns the hostname of the machine
  // We'll return the first non-empty line as the hostname
  const lines = trimmedOutput.split('\n').filter(line => line.trim().length > 0);
  
  if (lines.length === 0) {
    throw new Error('No valid hostname found in hostname command output');
  }
  
  return {
    hostname: lines[0].trim()
  };
}
