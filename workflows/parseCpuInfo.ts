import { CpuInfoResult } from '../models/SseMessage';

function parseVendor(vendorId: string): string {
  const upperVendorId = vendorId.toUpperCase();
  
  if (upperVendorId.includes('AUTHENTICAMD') || upperVendorId.includes('AMD')) {
    return 'AMD';
  }
  
  if (upperVendorId.includes('GENUINEINTEL') || upperVendorId.includes('INTEL')) {
    return 'Intel';
  }
  
  if (upperVendorId.includes('ARM')) {
    return 'ARM';
  }
  
  return vendorId;
}

function parseCpuFeatures(flags: string): Partial<CpuInfoResult> {
  const upperFlags = flags.toUpperCase();
  const flagArray = upperFlags.split(/\s+/);
  
  return {
    sse: flagArray.includes('SSE'),
    sse2: flagArray.includes('SSE2'),
    sse3: flagArray.includes('SSE3'),
    ssse3: flagArray.includes('SSSE3'),
    sse4_1: flagArray.includes('SSE4_1') || flagArray.includes('SSE4.1'),
    sse4_2: flagArray.includes('SSE4_2') || flagArray.includes('SSE4.2'),
    avx: flagArray.includes('AVX'),
    avx2: flagArray.includes('AVX2'),
    avx512: flagArray.includes('AVX512F') || flagArray.includes('AVX512'),
    fma: flagArray.includes('FMA'),
    aes: flagArray.includes('AES'),
    sha: flagArray.includes('SHA_NI') || flagArray.includes('SHA-NI'),
    neon: flagArray.includes('NEON')
  };
}

export function parseCpuInfo(output: string): CpuInfoResult {
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
    let architecture: string | undefined = undefined;
    let cpuMhz: number | undefined = undefined;
    let threadsPerCore: number | undefined = undefined;
    let coresPerSocket: number | undefined = undefined;
    let sockets: number | undefined = undefined;
    let virtualization: string | undefined = undefined;
    let cpuFlags: string | undefined = undefined;
    let vendor: string | undefined = undefined;
    
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;
      
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      const upperKey = key.toUpperCase();
      
      if (upperKey === 'VENDOR ID' || upperKey === 'VENDOR') {
        vendor = parseVendor(value);
      }

      if (upperKey === 'MODEL NAME') {
        cpuModel = value;
      }

      if (upperKey === 'CPU(S)') {
        // Total number of logical CPUs
        const cores = parseInt(value, 10);
        if (!isNaN(cores) && cores > 0) {
          cpuCores = cores;
        }
      }

      if (upperKey === 'ARCHITECTURE') {
        architecture = value;
      }

      if (upperKey === 'CPU MHZ' || upperKey === 'CPU MAX MHZ') {
        const mhz = parseFloat(value);
        if (!isNaN(mhz) && mhz > 0) {
          cpuMhz = Math.round(mhz);
        }
      }

      if (upperKey === 'THREAD(S) PER CORE') {
        const threads = parseInt(value, 10);
        if (!isNaN(threads) && threads > 0) {
          threadsPerCore = threads;
        }
      }

      if (upperKey === 'CORE(S) PER SOCKET') {
        const cores = parseInt(value, 10);
        if (!isNaN(cores) && cores > 0) {
          coresPerSocket = cores;
        }
      }
      
      if (upperKey === 'SOCKET(S)') {
        const socketCount = parseInt(value, 10);
        if (!isNaN(socketCount) && socketCount > 0) {
          sockets = socketCount;
        }
      }

      if (upperKey === 'VIRTUALIZATION') {
        virtualization = value;
      }

      if (upperKey === 'FLAGS') {
        cpuFlags = value;
      }
    }
    
    if (!cpuModel) {
      throw new Error('CPU model name not found in lscpu output');
    }
    
    const baseResult: CpuInfoResult = {
      cpuModel,
      cpuCores,
      architecture,
      cpuMhz,
      threadsPerCore,
      coresPerSocket,
      sockets,
      virtualization,
      cpuFlags,
      vendor
    };
    
    // Parse CPU feature flags if available
    if (cpuFlags) {
      const features = parseCpuFeatures(cpuFlags);
      return {
        ...baseResult,
        ...features
      };
    }
    
    return baseResult;
  } else {
    // Windows PowerShell output - just the processor name
    return {
      cpuModel: lines[0].trim()
    };
  }
}
