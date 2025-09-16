import { DotNetInfoResult, DotNetSdkInfo, RuntimeEnvironment, DotNetHost, InstalledSdk, InstalledRuntime } from '../models/SseMessage';

export function parseDotnetInfo(output: string): DotNetInfoResult {
  const lines = output.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Remove duplicated content by finding the first occurrence of "Host:" and removing everything before it
  // that appears again later in the output
  const hostIndex = lines.findIndex(line => line === 'Host:');
  if (hostIndex > 0) {
    // Check if there's a duplicate "Host:" section
    const secondHostIndex = lines.findIndex((line, index) => line === 'Host:' && index > hostIndex);
    if (secondHostIndex > hostIndex) {
      // Remove the duplicated content
      lines.splice(secondHostIndex);
    }
  }
  
  let currentSection = '';
  const result: Partial<DotNetInfoResult> = {
    installedSdks: [],
    installedRuntimes: [],
    otherArchitectures: [],
    environmentVariables: {}
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect sections
    if (line === '.NET SDK:') {
      currentSection = 'sdk';
      continue;
    } else if (line === 'Runtime Environment:') {
      currentSection = 'runtime';
      continue;
    } else if (line === 'Host:') {
      currentSection = 'host';
      continue;
    } else if (line === '.NET workloads installed:') {
      currentSection = 'workloads';
      continue;
    } else if (line === '.NET SDKs installed:') {
      currentSection = 'sdks';
      continue;
    } else if (line === '.NET runtimes installed:') {
      currentSection = 'runtimes';
      continue;
    } else if (line === 'Other architectures found:') {
      currentSection = 'architectures';
      continue;
    } else if (line === 'Environment variables:') {
      currentSection = 'envvars';
      continue;
    } else if (line === 'global.json file:') {
      currentSection = 'globaljson';
      continue;
    }

    // Parse based on current section
    switch (currentSection) {
      case 'sdk':
        if (line.startsWith('Version:')) {
          const version = line.replace('Version:', '').trim();
          result.sdk = { ...result.sdk, version } as DotNetSdkInfo;
        } else if (line.startsWith('Commit:')) {
          const commit = line.replace('Commit:', '').trim();
          result.sdk = { ...result.sdk, commit } as DotNetSdkInfo;
        } else if (line.startsWith('Workload version:')) {
          const workloadVersion = line.replace('Workload version:', '').trim();
          result.sdk = { ...result.sdk, workloadVersion } as DotNetSdkInfo;
        } else if (line.startsWith('MSBuild version:')) {
          const msbuildVersion = line.replace('MSBuild version:', '').trim();
          result.sdk = { ...result.sdk, msbuildVersion } as DotNetSdkInfo;
        }
        break;

      case 'runtime':
        if (line.startsWith('OS Name:')) {
          const osName = line.replace('OS Name:', '').trim();
          result.runtimeEnvironment = { ...result.runtimeEnvironment, osName } as RuntimeEnvironment;
        } else if (line.startsWith('OS Version:')) {
          const osVersion = line.replace('OS Version:', '').trim();
          result.runtimeEnvironment = { ...result.runtimeEnvironment, osVersion } as RuntimeEnvironment;
        } else if (line.startsWith('OS Platform:')) {
          const osPlatform = line.replace('OS Platform:', '').trim();
          result.runtimeEnvironment = { ...result.runtimeEnvironment, osPlatform } as RuntimeEnvironment;
        } else if (line.startsWith('RID:')) {
          const rid = line.replace('RID:', '').trim();
          result.runtimeEnvironment = { ...result.runtimeEnvironment, rid } as RuntimeEnvironment;
        } else if (line.startsWith('Base Path:')) {
          const basePath = line.replace('Base Path:', '').trim();
          result.runtimeEnvironment = { ...result.runtimeEnvironment, basePath } as RuntimeEnvironment;
        }
        break;

      case 'host':
        if (line.startsWith('Version:')) {
          const version = line.replace('Version:', '').trim();
          result.host = { ...result.host, version } as DotNetHost;
        } else if (line.startsWith('Architecture:')) {
          const architecture = line.replace('Architecture:', '').trim();
          result.host = { ...result.host, architecture } as DotNetHost;
        } else if (line.startsWith('Commit:')) {
          const commit = line.replace('Commit:', '').trim();
          result.host = { ...result.host, commit } as DotNetHost;
        }
        break;

      case 'workloads':
        if (line === 'There are no installed workloads to display.') {
          result.workloadsInstalled = 'None';
        } else if (line.startsWith('Configured to use')) {
          result.workloadsInstalled = line;
        } else if (line && !line.startsWith('Learn more:') && !line.startsWith('Download .NET:')) {
          result.workloadsInstalled = line;
        }
        break;

      case 'sdks':
        if (line.includes('[') && line.includes(']')) {
          const match = line.match(/^(.+?)\s+\[(.+?)\]$/);
          if (match) {
            result.installedSdks!.push({
              version: match[1].trim(),
              path: match[2].trim()
            });
          }
        }
        break;

      case 'runtimes':
        if (line.includes('[') && line.includes(']')) {
          // Parse format: "Microsoft.AspNetCore.App 7.0.20 [/path/to/runtime]"
          const match = line.match(/^(.+?)\s+(\S+)\s+\[(.+?)\]$/);
          if (match) {
            result.installedRuntimes!.push({
              name: match[1].trim(),
              version: match[2].trim(), // Extract the version number
              path: match[3].trim()
            });
          }
        }
        break;

      case 'architectures':
        if (line === 'None') {
          result.otherArchitectures = [];
        } else if (line && !line.startsWith('Learn more:') && !line.startsWith('Download .NET:')) {
          result.otherArchitectures!.push(line);
        }
        break;

      case 'envvars':
        if (line.includes('[') && line.includes(']')) {
          const match = line.match(/^(.+?)\s+\[(.+?)\]$/);
          if (match) {
            result.environmentVariables![match[1].trim()] = match[2].trim();
          }
        }
        break;

      case 'globaljson':
        if (line === 'Not found') {
          result.globalJsonFile = 'Not found';
        } else if (line && !line.startsWith('Learn more:') && !line.startsWith('Download .NET:') && !line.startsWith('env:') && !line.includes('No such file or directory') && !line.includes('dotnet-core-applaunch') && !line.startsWith('To install missing framework')) {
          result.globalJsonFile = line;
        }
        break;
    }
  }

  // Try to extract missing information from the output if sections were not found
  if (!result.sdk || !result.runtimeEnvironment) {
    for (const line of lines) {
      // Try to extract .NET location for basePath
      if (line.startsWith('.NET location:') && !result.runtimeEnvironment?.basePath) {
        const basePath = line.replace('.NET location:', '').trim();
        result.runtimeEnvironment = { ...result.runtimeEnvironment, basePath } as RuntimeEnvironment;
      }
      
      // Try to extract RID from the output
      if (line.startsWith('RID:') && !result.runtimeEnvironment?.rid) {
        const rid = line.replace('RID:', '').trim();
        result.runtimeEnvironment = { ...result.runtimeEnvironment, rid } as RuntimeEnvironment;
      }
      
      // Try to extract Architecture from the output
      if (line.startsWith('Architecture:') && !result.host?.architecture) {
        const architecture = line.replace('Architecture:', '').trim();
        result.host = { ...result.host, architecture } as DotNetHost;
      }
    }
  }

  // Handle global.json file detection more robustly
  if (!result.globalJsonFile || result.globalJsonFile === 'Unknown') {
    // Look for "Not found" in the output
    const hasNotFound = lines.some(line => line === 'Not found');
    if (hasNotFound) {
      result.globalJsonFile = 'Not found';
    }
  }

  // If global.json file is still not properly set, force it to 'Not found' for problematic outputs
  if (result.globalJsonFile && (result.globalJsonFile.includes('https://') || result.globalJsonFile.includes('dotnet'))) {
    result.globalJsonFile = 'Not found';
  }

  // Ensure all required fields have default values
  const parsedResult: DotNetInfoResult = {
    sdk: result.sdk || { version: '', commit: '', workloadVersion: '', msbuildVersion: '' },
    runtimeEnvironment: result.runtimeEnvironment || { osName: '', osVersion: '', osPlatform: '', rid: '', basePath: '' },
    host: result.host || { version: '', architecture: '', commit: '' },
    installedSdks: result.installedSdks || [],
    installedRuntimes: result.installedRuntimes || [],
    workloadsInstalled: result.workloadsInstalled || 'Unknown',
    otherArchitectures: result.otherArchitectures || [],
    environmentVariables: result.environmentVariables || {},
    globalJsonFile: result.globalJsonFile || 'Not found'
  };

  return parsedResult;
}
