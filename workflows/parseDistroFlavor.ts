import { DistroFlavorResult } from '../models/SseMessage';

export function parseDistroFlavor(output: string): DistroFlavorResult {
  const trimmedOutput = output.trim();
  
  if (!trimmedOutput) {
    throw new Error('No output from distro flavor command');
  }
  
  // The distro flavor command returns the detected flavor string
  // We'll return the trimmed output as the distro flavor
  const lines = trimmedOutput.split('\n').filter(line => line.trim().length > 0);
  
  if (lines.length === 0) {
    throw new Error('No distro flavor found in command output');
  }
  
  // Return the first line as the distro flavor
  return {
    distroFlavor: lines[0].trim()
  };
}
