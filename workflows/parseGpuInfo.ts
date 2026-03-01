import { GpuInfoResult, GpuResult } from '../models/SseMessage';

function parseLspciOutput(lspciOutput: string): GpuResult[] {
  const sections = lspciOutput.split('--\n').filter(section => section.trim());
  const gpus: GpuResult[] = [];
  
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const lines = section.split('\n').map(line => line.trim()).filter(line => line);
    
    if (lines.length === 0) {
      continue;
    }
    
    // Find the first line that contains VGA/3D/Display controller (the actual GPU line)
    let gpuLineIndex = -1;
    let firstLine = '';
    
    for (let j = 0; j < lines.length; j++) {
      if (lines[j].match(/(?:VGA compatible controller|3D controller|Display controller):/i)) {
        gpuLineIndex = j;
        firstLine = lines[j];
        // Check if the device name continues on the next line (common with long names)
        if (j + 1 < lines.length && !lines[j + 1].includes(':') && !lines[j + 1].includes('Subsystem') && !lines[j + 1].includes('Flags')) {
          firstLine += ' ' + lines[j + 1].trim();
        }
        break;
      }
    }
    
    // Skip this section if no GPU controller line found
    if (gpuLineIndex === -1) {
      continue;
    }
    
    // Parse bus ID and device info from the GPU line
    // Format: "01:00.0 VGA compatible controller: NVIDIA Corporation GA107M [GeForce RTX 3050 Ti Mobile] (rev a1)"
    const busMatch = firstLine.match(/^([0-9a-f]{2}:[0-9a-f]{2}\.[0-9a-f])/i);
    const deviceMatch = firstLine.match(/(?:VGA compatible controller|3D controller|Display controller):\s*(.+)/i);
    const revMatch = firstLine.match(/\(rev\s+([a-f0-9]+)\)/i);
    
    const busId = busMatch ? busMatch[1] : 'Unknown';
    let deviceName = deviceMatch ? deviceMatch[1].trim() : 'Unknown GPU';
    const revision = revMatch ? revMatch[1] : 'Unknown';
    
    // Remove revision info from device name if it's included
    deviceName = deviceName.replace(/\s*\(rev\s+[a-f0-9]+\).*$/i, '');
    // Remove (prog-if XX [...]) info if present
    deviceName = deviceName.replace(/\s*\(prog-if\s+[^)]+\).*$/i, '');
    
    // Try to find driver info in the section
    let driver = 'Unknown';
    for (const line of lines) {
      const driverMatch = line.match(/Kernel driver in use:\s*(.+)/i);
      if (driverMatch) {
        driver = driverMatch[1].trim();
        break;
      }
    }
    
    gpus.push({
      index: gpus.length,
      name: deviceName,
      bus: busId,
      revision: revision,
      driver: driver
    });
  }

  return gpus;
}

function parseNvidiaSmiOutput(nvidiaOutput: string): GpuResult[] {
  if (!nvidiaOutput.trim()) {
    return [];
  }

  const lines = nvidiaOutput.split('\n').filter(line => line.trim());
  const gpus: GpuResult[] = [];
  
  for (const line of lines) {
    const parts = line.split(',').map(part => part.trim());
    if (parts.length >= 7) {
      const memoryTotalMB = parseInt(parts[2], 10) || 0;
      const memoryUsedMB = parseInt(parts[3], 10) || 0;
      const memoryFreeMB = parseInt(parts[4], 10) || 0;
      
      gpus.push({
        index: parseInt(parts[0], 10) || 0,
        name: parts[1] || 'Unknown GPU',
        bus: 'Unknown',
        revision: 'Unknown',
        driver: parts[7] || 'Unknown',
        memoryTotal: memoryTotalMB > 0 ? formatBytes(memoryTotalMB * 1024 * 1024) : undefined,
        memoryUsed: memoryUsedMB > 0 ? formatBytes(memoryUsedMB * 1024 * 1024) : undefined,
        memoryFree: memoryFreeMB > 0 ? formatBytes(memoryFreeMB * 1024 * 1024) : undefined,
        utilization: parseInt(parts[5], 10) || undefined,
        temperature: parseInt(parts[6], 10) || undefined
      });
    }
  }
  
  return gpus;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return '0 B';
  }
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function parseGpuInfo(output: string): GpuInfoResult {
  const trimmedOutput = output.trim();
  
  if (!trimmedOutput) {
    return { gpus: [] };
  }
  
  // Check if this is nvidia-smi output (CSV format with commas)
  if (trimmedOutput.includes(',') && trimmedOutput.match(/\d+,\s*.+,\s*\d+/)) {
    const gpus = parseNvidiaSmiOutput(trimmedOutput);
    return { gpus };
  }
  
  // Otherwise, treat as lspci output
  const gpus = parseLspciOutput(trimmedOutput);
  return { gpus };
}

export function parseOpenGLRenderer(output: string): { openGLRenderer: string } {
  const trimmed = output.trim();
  if (!trimmed) {
    return { openGLRenderer: '' };
  }
  
  const match = trimmed.match(/OpenGL renderer string:\s*(.+)/i);
  return { openGLRenderer: match ? match[1].trim() : '' };
}
