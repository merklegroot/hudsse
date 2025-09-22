import { PathResult } from '../models/SseMessage';

export function parsePath(output: string): PathResult {
  const trimmedOutput = output.trim();
  
  if (!trimmedOutput) {
    throw new Error('No output from echo $PATH command');
  }
  
  // The 'echo $PATH' command returns the PATH environment variable
  // Split by colon to get individual folder paths
  const folders = trimmedOutput.split(':').filter(folder => folder.trim().length > 0);
  
  if (folders.length === 0) {
    throw new Error('No valid path folders found in PATH environment variable');
  }
  
  return {
    path: trimmedOutput,
    folders: folders.map(folder => folder.trim())
  };
}

