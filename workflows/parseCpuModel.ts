import { CpuModelResult } from '../models/SseMessage';

export function parseCpuModel(output: string): CpuModelResult {
  const trimmedOutput = output.trim();
  
  if (!trimmedOutput) {
    throw new Error('No output from CPU model command');
  }
  
  // The CPU model command returns the CPU model string
  // We'll return the trimmed output as the CPU model
  const lines = trimmedOutput.split('\n').filter(line => line.trim().length > 0);
  
  if (lines.length === 0) {
    throw new Error('No CPU model found in command output');
  }
  
  // Return the first line as the CPU model
  return {
    cpuModel: lines[0].trim()
  };
}
