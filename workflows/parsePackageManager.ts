import { PackageManagerResult } from '../models/SseMessage';

export function parsePackageManager(output: string): PackageManagerResult {
  const trimmedOutput = output.trim();
  
  if (!trimmedOutput) {
    throw new Error('No output from package manager detection command');
  }
  
  // The package manager detection command returns the detected package manager string
  // We'll return the trimmed output as the package manager
  const lines = trimmedOutput.split('\n').filter(line => line.trim().length > 0);
  
  if (lines.length === 0) {
    throw new Error('No package manager found in command output');
  }
  
  // Return the first line as the package manager
  return {
    packageManager: lines[0].trim()
  };
}
