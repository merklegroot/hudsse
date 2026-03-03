import { PackageRepositoryResult } from '../models/SseMessage';

export interface PackageRepository {
  packageManager: string;
  repository: string;
}

export function parsePackageRepositories(output: string): PackageRepositoryResult {
  const trimmedOutput = output.trim();
  
  if (!trimmedOutput || trimmedOutput === 'No repositories found') {
    return {
      repositories: []
    };
  }
  
  const lines = trimmedOutput.split('\n').filter(line => line.trim().length > 0);
  const repositories: PackageRepository[] = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Parse format: "PackageManager: repository info"
    const colonIndex = trimmedLine.indexOf(':');
    if (colonIndex > 0) {
      const packageManager = trimmedLine.substring(0, colonIndex).trim();
      const repository = trimmedLine.substring(colonIndex + 1).trim();
      
      if (packageManager && repository) {
        repositories.push({
          packageManager,
          repository
        });
      }
    }
  }
  
  return {
    repositories
  };
}
