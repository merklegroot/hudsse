import { ListSdksResult, SdkInfo } from '../models/SseMessage';

/**
 * Parses the output from 'dotnet --list-sdks' command
 * Expected format: "8.0.100 [/path/to/sdk]"
 */
export function parseDotnetSdks(output: string): ListSdksResult {
  const lines = output.split('\n').filter(line => line.trim().length > 0);
  const sdks: SdkInfo[] = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines or lines that don't look like SDK entries
    if (!trimmedLine || !trimmedLine.includes('[') || !trimmedLine.includes(']')) {
      continue;
    }
    
    // Parse format: "version [path]"
    const match = trimmedLine.match(/^(.+?)\s+\[(.+)\]$/);
    if (match) {
      const version = match[1].trim();
      const path = match[2].trim();
      
      sdks.push({
        version,
        path
      });
    }
  }
  
  return { sdks };
}
