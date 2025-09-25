import { ListRuntimesResult, RuntimeInfo } from '../models/SseMessage';

/**
 * Parses the output from 'dotnet --list-runtimes' command
 * Expected format: "Microsoft.AspNetCore.App 7.0.20 [/path/to/runtime]"
 */
export function parseDotnetRuntimes(output: string): ListRuntimesResult {
  const lines = output.split('\n').filter(line => line.trim().length > 0);
  const runtimes: RuntimeInfo[] = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines or lines that don't look like runtime entries
    if (!trimmedLine || !trimmedLine.includes('[') || !trimmedLine.includes(']')) {
      continue;
    }
    
    // Parse format: "name version [path]"
    // Example: "Microsoft.AspNetCore.App 7.0.20 [/home/localuser/.dotnet/shared/Microsoft.AspNetCore.App]"
    const match = trimmedLine.match(/^(.+?)\s+(\S+)\s+\[(.+)\]$/);
    if (match) {
      const name = match[1].trim();
      const version = match[2].trim();
      const path = match[3].trim();
      
      runtimes.push({
        name,
        version,
        path
      });
    }
  }
  
  return { runtimes };
}
