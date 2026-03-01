import { CpuModelResult } from '../models/SseMessage';

export function parseCpuModel(output: string): CpuModelResult {
  const trimmedOutput = output.trim();
  
  if (!trimmedOutput) {
    throw new Error('No output from CPU model command');
  }
  
  const lines = trimmedOutput.split('\n').filter(line => line.trim().length > 0);
  
  if (lines.length === 0) {
    throw new Error('No CPU model found in command output');
  }
  
  // Check if this is lscpu output (contains colons indicating key-value pairs)
  const isLscpuOutput = lines.some(line => line.includes(':'));
  
  if (isLscpuOutput) {
    // Parse lscpu output
    let cpuModel: string | null = null;
    let cpuCores: number | undefined = undefined;
    
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;
      
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      
      if (key === 'Model name') {
        cpuModel = value;
      } else if (key === 'CPU(s)') {
        // Total number of logical CPUs
        const cores = parseInt(value, 10);
        if (!isNaN(cores) && cores > 0) {
          cpuCores = cores;
        }
      }
    }
    
    if (!cpuModel) {
      throw new Error('CPU model name not found in lscpu output');
    }
    
    return {
      cpuModel,
      cpuCores
    };
  } else {
    // Windows PowerShell output - just the processor name
    return {
      cpuModel: lines[0].trim()
    };
  }
}
