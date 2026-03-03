import { MemoryInfoResult, TopProcess } from '../models/SseMessage';
import { platformType, platformUtil } from '@/utils/platformUtil';
import { totalmem, freemem } from 'os';

// Helper to format bytes (similar to old project)
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function parseTopProcesses(output: string): TopProcess[] {
  const currentPlatform = platformUtil.detectPlatform();
  const totalMemoryBytes = totalmem();
  const processes: TopProcess[] = [];
  const lines = output.split('\n').filter(line => line.trim().length > 0);

  if (currentPlatform === platformType.linux) {
    // Parse ps aux output: USER PID %CPU %MEM VSZ RSS TTY STAT START TIME COMMAND
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 11) {
        const pid = parts[1];
        const memPercent = parseFloat(parts[3]) || 0;
        const command = parts.slice(10).join(' ');
        // Extract just the process name (first part of command)
        const processName = command.split(' ')[0].split('/').pop() || command;
        
        // Calculate absolute memory usage
        const memoryBytes = (memPercent / 100) * totalMemoryBytes;
        const memoryAbsolute = formatBytes(memoryBytes);
        
        processes.push({
          pid,
          name: processName.length > 30 ? processName.substring(0, 30) + '...' : processName,
          memoryUsage: `${memPercent.toFixed(1)}%`,
          memoryPercent: Math.round(memPercent * 100) / 100,
          memoryAbsolute
        });
      }
    }
  } else if (currentPlatform === platformType.mac) {
    // Parse ps aux output for macOS (similar to Linux)
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 11) {
        const pid = parts[1];
        const memPercent = parseFloat(parts[3]) || 0;
        const command = parts.slice(10).join(' ');
        const processName = command.split(' ')[0].split('/').pop() || command;
        
        // Calculate absolute memory usage
        const memoryBytes = (memPercent / 100) * totalMemoryBytes;
        const memoryAbsolute = formatBytes(memoryBytes);
        
        processes.push({
          pid,
          name: processName.length > 30 ? processName.substring(0, 30) + '...' : processName,
          memoryUsage: `${memPercent.toFixed(1)}%`,
          memoryPercent: Math.round(memPercent * 100) / 100,
          memoryAbsolute
        });
      }
    }
  } else if (currentPlatform === platformType.windows) {
    // Parse wmic process output (CSV format)
    for (const line of lines) {
      if (!line.includes(',')) continue;
      const parts = line.split(',');
      if (parts.length >= 4 && parts[1] && parts[2] && parts[3]) {
        const name = parts[1].trim();
        const pid = parts[2].trim();
        const workingSetBytes = parseInt(parts[3]) || 0;
        const memoryAbsolute = formatBytes(workingSetBytes);
        const memPercent = totalMemoryBytes > 0 ? (workingSetBytes / totalMemoryBytes) * 100 : 0;
        
        processes.push({
          pid,
          name: name.length > 30 ? name.substring(0, 30) + '...' : name,
          memoryUsage: `${memPercent.toFixed(1)}%`,
          memoryPercent: Math.round(memPercent * 100) / 100,
          memoryAbsolute
        });
      }
    }
  }

  return processes;
}

export function parseMemoryInfo(topProcessesOutput: string): MemoryInfoResult {
  const totalRAM = formatBytes(totalmem());
  const freeRAM = formatBytes(freemem());
  const usedRAM = formatBytes(totalmem() - freemem());
  const topProcesses = parseTopProcesses(topProcessesOutput);

  return {
    totalRAM,
    freeRAM,
    usedRAM,
    topProcesses
  };
}
