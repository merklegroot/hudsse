import { NextRequest } from 'next/server';
import { spawn } from 'child_process';

// Common SSE response headers
const SSE_HEADERS = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control',
    'X-Accel-Buffering': 'no' // Disable nginx buffering
};

// Utility function to send SSE messages
function sendSseMessage(controller: ReadableStreamDefaultController, type: string, contents: string) {
    const message = { type, contents };
    const data = `data: ${JSON.stringify(message)}\n\n`;
    controller.enqueue(new TextEncoder().encode(data));
}

// Execute dotnet uninstall command
async function executeDotnetUninstall(appName: string, version: string, controller: ReadableStreamDefaultController): Promise<boolean> {
    return new Promise((resolve) => {
        // Use dotnet workload uninstall or dotnet tool uninstall depending on the component type
        let command: string;
        let args: string[];
        
        if (appName.toLowerCase() === 'sdk') {
            // For SDK, we need to use a different approach since there's no direct uninstall command
            // We'll use dotnet --list-sdks to find the path and then remove it
            command = 'dotnet';
            args = ['--list-sdks'];
        } else {
            // For runtimes, try to use dotnet workload uninstall
            command = 'dotnet';
            args = ['workload', 'uninstall', appName];
        }
        
        sendSseMessage(controller, 'command', `Executing: ${command} ${args.join(' ')}`);
        
        const child = spawn(command, args, {
            stdio: ['pipe', 'pipe', 'pipe'],
            env: { 
                ...process.env,
                NODE_ENV: 'development' 
            },
            shell: false,
            detached: false
        });
        
        let stdout = '';
        let stderr = '';
        
        // Collect stdout data
        child.stdout?.on('data', (data: Buffer) => {
            const output = data.toString();
            stdout += output;
            sendSseMessage(controller, 'stdout', output);
        });
        
        // Collect stderr data
        child.stderr?.on('data', (data: Buffer) => {
            const output = data.toString();
            stderr += output;
            sendSseMessage(controller, 'stdout', output); // Show stderr as stdout for user visibility
        });
        
        // Handle process completion
        child.on('close', (code: number | null) => {
            if (code === 0) {
                sendSseMessage(controller, 'result', `Successfully uninstalled ${appName} ${version}`);
                resolve(true);
            } else {
                // For SDK uninstall, we might need to manually remove the directory
                if (appName.toLowerCase() === 'sdk' && code !== 0) {
                    sendSseMessage(controller, 'stdout', 'Attempting manual SDK removal...');
                    // Try to find and remove the SDK directory
                    executeManualSdkRemoval(version, controller).then(resolve);
                } else {
                    sendSseMessage(controller, 'result', `Uninstall failed with exit code ${code}. Error: ${stderr}`);
                    resolve(false);
                }
            }
        });
        
        // Handle process errors
        child.on('error', (error: Error) => {
            sendSseMessage(controller, 'result', `Failed to execute uninstall: ${error.message}`);
            resolve(false);
        });
        
        // Set a timeout (2 minutes for uninstall)
        const timeoutHandle = setTimeout(() => {
            child.kill('SIGKILL');
            sendSseMessage(controller, 'result', 'Uninstall timed out after 2 minutes');
            resolve(false);
        }, 2 * 60 * 1000);
        
        // Clear timeout when process completes
        child.on('close', () => {
            clearTimeout(timeoutHandle);
        });
    });
}

// Manual SDK removal by finding and deleting the SDK directory
async function executeManualSdkRemoval(version: string, controller: ReadableStreamDefaultController): Promise<boolean> {
    return new Promise((resolve) => {
        // First, get the list of SDKs to find the path
        const child = spawn('dotnet', ['--list-sdks'], {
            stdio: ['pipe', 'pipe', 'pipe'],
            env: { ...process.env },
            shell: false,
            detached: false
        });
        
        let stdout = '';
        
        child.stdout?.on('data', (data: Buffer) => {
            stdout += data.toString();
        });
        
        child.on('close', (code: number | null) => {
            if (code === 0) {
                // Parse the SDK list to find the version and path
                const lines = stdout.split('\n');
                const sdkLine = lines.find(line => line.includes(version));
                
                if (sdkLine) {
                    // Extract the path from the SDK line (format: "version [path]")
                    const match = sdkLine.match(/\d+\.\d+\.\d+.*?\[(.*?)\]/);
                    if (match && match[1]) {
                        const sdkPath = match[1].trim();
                        sendSseMessage(controller, 'stdout', `Found SDK at: ${sdkPath}`);
                        
                        // Remove the SDK directory
                        const rmChild = spawn('rm', ['-rf', sdkPath], {
                            stdio: ['pipe', 'pipe', 'pipe'],
                            env: { ...process.env },
                            shell: false,
                            detached: false
                        });
                        
                        rmChild.on('close', (rmCode: number | null) => {
                            if (rmCode === 0) {
                                sendSseMessage(controller, 'result', `Successfully removed SDK directory: ${sdkPath}`);
                                resolve(true);
                            } else {
                                sendSseMessage(controller, 'result', `Failed to remove SDK directory: ${sdkPath}`);
                                resolve(false);
                            }
                        });
                        
                        rmChild.on('error', (error: Error) => {
                            sendSseMessage(controller, 'result', `Error removing SDK directory: ${error.message}`);
                            resolve(false);
                        });
                    } else {
                        sendSseMessage(controller, 'result', `Could not parse SDK path from: ${sdkLine}`);
                        resolve(false);
                    }
                } else {
                    sendSseMessage(controller, 'result', `SDK version ${version} not found in installed SDKs`);
                    resolve(false);
                }
            } else {
                sendSseMessage(controller, 'result', 'Failed to list SDKs for manual removal');
                resolve(false);
            }
        });
        
        child.on('error', (error: Error) => {
            sendSseMessage(controller, 'result', `Error listing SDKs: ${error.message}`);
            resolve(false);
        });
    });
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const appName = searchParams.get('appName');
    const version = searchParams.get('version');
    
    if (!appName || !version) {
        return new Response(JSON.stringify({ error: 'Missing appName or version parameters.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    const stream = new ReadableStream({
        async start(controller) {
            try {
                sendSseMessage(controller, 'other', `Starting uninstall of ${appName} version ${version}...`);
                
                // Execute the uninstall
                sendSseMessage(controller, 'other', `Uninstalling ${appName} ${version}...`);
                const success = await executeDotnetUninstall(appName, version, controller);
                
                if (success) {
                    sendSseMessage(controller, 'result', `✅ ${appName} ${version} uninstalled successfully!`);
                } else {
                    sendSseMessage(controller, 'result', `❌ Failed to uninstall ${appName} ${version}. Check the output above for details.`);
                }
                
            } catch (error) {
                sendSseMessage(controller, 'result', `❌ Uninstall error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
                controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
                controller.close();
            }
        }
    });
    
    return new Response(stream, { headers: SSE_HEADERS });
}
