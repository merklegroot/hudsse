import { KernelVersionResult } from '../models/SseMessage';

export function parseKernelVersion(output: string): KernelVersionResult {
  const trimmedOutput = output.trim();
  
  if (!trimmedOutput) {
    throw new Error('No output from kernel version command');
  }
  
  // The kernel version command returns the kernel version string
  // We'll return the trimmed output as the kernel version
  const lines = trimmedOutput.split('\n').filter(line => line.trim().length > 0);
  
  if (lines.length === 0) {
    throw new Error('No kernel version found in command output');
  }
  
  // Return the first line as the kernel version
  return {
    kernelVersion: lines[0].trim()
  };
}
