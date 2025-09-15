import { NextRequest } from 'next/server';
import { flexibleSseHandlerProps, sseFactory } from '@/workflows/sseFactory';
import { spawnAndGetDataWorkflow } from '@/workflows/spawnAndGetDataWorkflow';
import * as fs from 'fs';
import { sseDotNetWorkflow } from '@/workflows/sseDotNetWorkflow';
import { DotNetInfoResult } from '@/models/SseMessage';

/** Given the .NET base path, which often looks like this:  /home/username/.dotnet/sdk/9.0.304/,
 * return the root path which often looks like this: /home/username/.dotnet */
function getDotnetRootPath(basePath: string): string {
    let dotnetRootPath = basePath;
    if (dotnetRootPath.includes('/sdk/')) {
        dotnetRootPath = basePath.replace(/\/sdk\/.*$/, '');
    }
    
    return dotnetRootPath;
}

function getSdkPath(result: DotNetInfoResult, version: string): string | undefined {
    const dotnetRootPath = getDotnetRootPath(result.runtimeEnvironment?.basePath || '');
    return `${dotnetRootPath}/sdk/${version}`;
}

// Execute runtime uninstall command
async function executeRuntimeUninstall(props: flexibleSseHandlerProps, version: string): Promise<boolean> {
    props.sendMessage({ type: 'command', contents: `Finding runtime installation paths for version ${version}...` });

    try {
        const result = await sseDotNetWorkflow.executeDotNetInfo(props);

        if (!result.wasSuccessful) {
            props.sendMessage({ type: 'result', contents: `❌ Failed to get dotnet info for runtime removal. Exit code: ${result.exitCode}, stderr: "${result.stderr}"` });
            return false;
        }

        // Get the base path from the result
        let basePath = result.parsedData?.runtimeEnvironment?.basePath;
        if (!basePath) {
            props.sendMessage({ type: 'result', contents: '❌ Could not find base path in dotnet info' });
            return false;
        }

        props.sendMessage({ type: 'stdout', contents: `Found .NET base path: ${basePath}` });

        let dotnetRootPath = getDotnetRootPath(basePath);
        props.sendMessage({ type: 'stdout', contents: `Found .NET root path: ${dotnetRootPath}` });

        // Look for runtime directories
        const aspNetPath = `${dotnetRootPath}/shared/Microsoft.AspNetCore.App/${version}`;
        const netCorePath = `${dotnetRootPath}/shared/Microsoft.NETCore.App/${version}`;

        props.sendMessage({ type: 'stdout', contents: `Looking for runtimes at: ${aspNetPath} and ${netCorePath}` });

        let foundAny = false;
        let removedAny = false;

        // Check and remove ASP.NET Core runtime
        if (fs.existsSync(aspNetPath)) {
            props.sendMessage({ type: 'stdout', contents: `Found ASP.NET Core runtime directory, removing: ${aspNetPath}` });
            foundAny = true;
            
            const rmResult = await spawnAndGetDataWorkflow.executeWithFallback({
                command: 'rm',
                args: ['-rf', aspNetPath],
                timeout: 30000,
                dataCallback: (data: string) => {
                    props.sendMessage({ type: 'stdout', contents: data });
                }
            });

            if (!fs.existsSync(aspNetPath)) {
                props.sendMessage({ type: 'stdout', contents: `✅ Successfully removed ASP.NET Core runtime: ${aspNetPath}` });
                removedAny = true;
            } else {
                props.sendMessage({ type: 'result', contents: `❌ Failed to remove ASP.NET Core runtime: ${aspNetPath}` });
            }
        }

        // Check and remove .NET Core runtime
        if (fs.existsSync(netCorePath)) {
            props.sendMessage({ type: 'stdout', contents: `Found .NET Core runtime directory, removing: ${netCorePath}` });
            foundAny = true;
            
            const rmResult = await spawnAndGetDataWorkflow.executeWithFallback({
                command: 'rm',
                args: ['-rf', netCorePath],
                timeout: 30000,
                dataCallback: (data: string) => {
                    props.sendMessage({ type: 'stdout', contents: data });
                }
            });

            if (!fs.existsSync(netCorePath)) {
                props.sendMessage({ type: 'stdout', contents: `✅ Successfully removed .NET Core runtime: ${netCorePath}` });
                removedAny = true;
            } else {
                props.sendMessage({ type: 'result', contents: `❌ Failed to remove .NET Core runtime: ${netCorePath}` });
            }
        }

        if (!foundAny) {
            props.sendMessage({ type: 'result', contents: `❌ No runtime directories found for version ${version} at expected paths` });
            return false;
        }

        if (removedAny) {
            props.sendMessage({ type: 'result', contents: `✅ Successfully removed runtime components for version ${version}` });
            return true;
        } else {
            props.sendMessage({ type: 'result', contents: `❌ Failed to remove runtime components for version ${version}` });
            return false;
        }

    } catch (error) {
        props.sendMessage({ type: 'result', contents: `❌ Error during runtime removal: ${error instanceof Error ? error.message : 'Unknown error'}` });
        return false;
    }
}

// Execute dotnet uninstall command
async function executeDotnetUninstall(props: flexibleSseHandlerProps, appName: string, version: string): Promise<boolean> {
    // Handle runtime uninstall
    if (appName.toLowerCase() === 'runtime') {
        return await executeRuntimeUninstall(props, version);
    }
    
    // Handle SDK uninstall
    if (appName.toLowerCase() !== 'sdk') {
        props.sendMessage({ type: 'result', contents: `❌ Unsupported app type: ${appName}. Only 'sdk' and 'runtime' are supported.` });
        return false;
    }

    // For SDK, find and remove the specific version folder
    props.sendMessage({ type: 'command', contents: `Finding SDK installation path for version ${version}...` });

    try {
        const result = await sseDotNetWorkflow.executeDotNetInfo(props);

        if (!result.wasSuccessful) {
            props.sendMessage({ type: 'result', contents: `❌ Failed to get dotnet info for SDK removal. Exit code: ${result.exitCode}, stderr: "${result.stderr}"` });
            return false;
        }

        // get the bath path from the result
        let basePath = result.parsedData?.runtimeEnvironment?.basePath;
        if (!basePath) {
            props.sendMessage({ type: 'result', contents: '❌ Could not find base path in dotnet info' });
            return false;
        }

        props.sendMessage({ type: 'stdout', contents: `Found .NET base path: ${basePath}` });


        let dotnetRootPath = getDotnetRootPath(basePath);

        props.sendMessage({ type: 'stdout', contents: `Found .NET root path: ${dotnetRootPath}` });

        // Look for SDKs in the base path
        const sdkPath = `${dotnetRootPath}/sdk/${version}`;
        props.sendMessage({ type: 'stdout', contents: `Looking for SDK at: ${sdkPath}` });

        // Check if the SDK directory exists and remove it
        if (!fs.existsSync(sdkPath)) {
            props.sendMessage({ type: 'result', contents: `❌ SDK version ${version} not found at expected path: ${sdkPath}` });
            return false;
        }

        props.sendMessage({ type: 'stdout', contents: `Found SDK directory, removing: ${sdkPath}` });

        // Remove the SDK directory
        const rmResult = await spawnAndGetDataWorkflow.executeWithFallback({
            command: 'rm',
            args: ['-rf', sdkPath],
            timeout: 30000,
            dataCallback: (data: string) => {
                props.sendMessage({ type: 'stdout', contents: data });
            }
        });

        // Log the rm command result for debugging
        props.sendMessage({ type: 'stdout', contents: `RM command exit code: ${rmResult.exitCode}, stdout: "${rmResult.stdout}", stderr: "${rmResult.stderr}"` });

        // Verify that the directory was actually removed
        const stillExists = fs.existsSync(sdkPath);

        if (stillExists) {
            props.sendMessage({ type: 'result', contents: `❌ SDK directory still exists after removal attempt: ${sdkPath}` });
            return false;
        }

        // Directory was successfully removed
        props.sendMessage({ type: 'result', contents: `✅ Successfully removed SDK directory: ${sdkPath}` });
        return true;
    } catch (error) {
        props.sendMessage({ type: 'result', contents: `❌ Error during SDK removal: ${error instanceof Error ? error.message : 'Unknown error'}` });
        return false;
    }
}

export const GET = sseFactory.createFlexibleSseHandler(async (props: flexibleSseHandlerProps) => {
    const { searchParams } = new URL(props.req.url);
    const appName = searchParams.get('appName');
    const version = searchParams.get('version');

    if (!appName || !version) {
        return props.onError('Missing appName or version parameters.');
    }

    // Additional validation for version parameter
    if (version.trim() === '') {
        return props.onError('Version parameter cannot be empty.');
    }

    props.sendMessage({ type: 'other', contents: `Starting uninstall of ${appName} version ${version}...` });
    props.sendMessage({ type: 'other', contents: `Uninstalling ${appName} ${version}...` });

    const success = await executeDotnetUninstall(props, appName, version);

    if (success) {
        props.sendMessage({ type: 'result', contents: `✅ ${appName} ${version} uninstalled successfully!` });
    } else {
        props.sendMessage({ type: 'result', contents: `❌ Failed to uninstall ${appName} ${version}. Check the output above for details.` });
    }

    await sseDotNetWorkflow.executeDotNetInfo(props);
});
