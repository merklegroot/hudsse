import { IpAddressResult } from '../models/SseMessage';

export function parseIpAddress(output: string): IpAddressResult {
  const trimmedOutput = output.trim();
  
  if (!trimmedOutput) {
    throw new Error('No output from IP address command');
  }
  
  // The 'hostname -I' command returns the IP addresses of the machine
  // We'll return the first IP address found
  const lines = trimmedOutput.split('\n').filter(line => line.trim().length > 0);
  
  if (lines.length === 0) {
    throw new Error('No IP address found in hostname command output');
  }
  
  // Extract IP addresses from the first line
  // hostname -I typically returns space-separated IP addresses
  const ipAddresses = lines[0].trim().split(/\s+/);
  
  if (ipAddresses.length === 0 || !ipAddresses[0]) {
    throw new Error('No valid IP address found in command output');
  }
  
  // Return the first IP address (usually the primary one)
  return {
    ipAddress: ipAddresses[0]
  };
}

