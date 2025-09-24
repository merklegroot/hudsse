import { PathResult } from '../models/SseMessage';

export function parsePath(output: string): PathResult {
  const trimmedOutput = output.trim();
  
  if (!trimmedOutput) {
    throw new Error('No output from echo $PATH command');
  }
  
  // Cross-platform PATH splitting:
  // - Windows uses semicolon (;) as PATH separator
  // - Unix-like systems (Linux, macOS) use colon (:) as PATH separator
  const pathSeparator = process.platform === 'win32' ? ';' : ':';
  const folders = trimmedOutput.split(pathSeparator).filter(folder => folder.trim().length > 0);
  
  if (folders.length === 0) {
    throw new Error('No valid path folders found in PATH environment variable');
  }
  
  // Deduplicate folders while preserving order (first occurrence wins)
  const trimmedFolders = folders.map(folder => folder.trim());
  const uniqueFolders: string[] = [];
  for (const folder of trimmedFolders) {
    if (!uniqueFolders.includes(folder)) {
      uniqueFolders.push(folder);
    }
  }

  // Sort folders alphabetically (case-insensitive for better user experience)
  const sortedFolders = uniqueFolders
    .slice()
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  
  return {
    path: trimmedOutput,
    folders: sortedFolders
  };
}

