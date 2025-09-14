import { NextRequest } from 'next/server';
import { flexibleSseHandlerProps, sseFactory } from '@/workflows/sseFactory';
import { spawnAndGetDataWorkflow } from '@/workflows/spawnAndGetDataWorkflow';

// Execute dotnet uninstall command
async function executeDotnetUninstall(props: flexibleSseHandlerProps, appName: string, version: string): Promise<boolean> {
    // Check if this is a runtime - throw exception for now
    if (appName.toLowerCase() !== 'sdk') {
        props.sendMessage({ type: 'result', contents: `❌ Runtime uninstall not yet supported. Cannot uninstall ${appName} ${version}.` });
        return false;
    }

    // For SDK, find and remove the specific version folder
    props.sendMessage({ type: 'command', contents: `Finding SDK installation path for version ${version}...` });
    return await executeManualSdkRemoval(props, version);
}

// Manual SDK removal by finding and deleting the SDK directory
async function executeManualSdkRemoval(props: flexibleSseHandlerProps, version: string): Promise<boolean> {
    try {
        // First, get dotnet info to find the base path
        const result = await spawnAndGetDataWorkflow.executeWithFallback({
            command: 'dotnet',
            args: ['--info'],
            timeout: 30000,
            dataCallback: (data: string) => {
                props.sendMessage({ type: 'stdout', contents: data });
            }
        });

        if (!result.wasSuccessful) {
            props.sendMessage({ type: 'result', contents: '❌ Failed to get dotnet info for SDK removal' });
            return false;
        }

        // Parse the dotnet info to find the base path
        const lines = result.stdout.split('\n');
        const basePathLine = lines.find(line => line.includes('Base Path:'));

        if (!basePathLine) {
            props.sendMessage({ type: 'result', contents: '❌ Could not find base path in dotnet --info output' });
            return false;
        }

        // Extract the base path
        const match = basePathLine.match(/Base Path:\s*(.+)/);
        if (!match || !match[1]) {
            props.sendMessage({ type: 'result', contents: '❌ Could not parse base path from dotnet --info output' });
            return false;
        }

        let basePath = match[1].trim();
        props.sendMessage({ type: 'stdout', contents: `Found .NET base path: ${basePath}` });

        // If the base path ends with a specific SDK version, go up to the parent directory
        if (basePath.includes('/sdk/')) {
            basePath = basePath.replace(/\/sdk\/.*$/, '');
            props.sendMessage({ type: 'stdout', contents: `Adjusted base path to: ${basePath}` });
        }

        // Look for SDKs in the base path
        const sdkPath = `${basePath}/sdk/${version}`;
        props.sendMessage({ type: 'stdout', contents: `Looking for SDK at: ${sdkPath}` });

        // Check if the SDK directory exists and remove it
        const fs = require('fs');
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

        if (rmResult.wasSuccessful) {
            props.sendMessage({ type: 'result', contents: `✅ Successfully removed SDK directory: ${sdkPath}` });
            return true;
        }

        props.sendMessage({ type: 'result', contents: `❌ Failed to remove SDK directory: ${sdkPath}` });
        return false;
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
});
