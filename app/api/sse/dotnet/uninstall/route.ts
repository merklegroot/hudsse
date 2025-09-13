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
        // Check if this is a runtime - throw exception for now
        if (appName.toLowerCase() !== 'sdk') {
            sendSseMessage(controller, 'result', `❌ Runtime uninstall not yet supported. Cannot uninstall ${appName} ${version}.`);
            resolve(false);
            return;
        }
        
        // For SDK, find and remove the specific version folder
        sendSseMessage(controller, 'command', `Finding SDK installation path for version ${version}...`);
        executeManualSdkRemoval(version, controller).then(resolve);
    });
}

// Manual SDK removal by finding and deleting the SDK directory
async function executeManualSdkRemoval(version: string, controller: ReadableStreamDefaultController): Promise<boolean> {
    return new Promise((resolve) => {
        // First, get dotnet info to find the base path
        const child = spawn('dotnet', ['--info'], {
            stdio: ['pipe', 'pipe', 'pipe'],
            env: { ...process.env },
            shell: false,
            detached: false
        });
        
        let stdout = '';
        
        child.stdout?.on('data', (data: Buffer) => {
            const output = data.toString();
            stdout += output;
            sendSseMessage(controller, 'stdout', output);
        });
        
        child.on('close', (code: number | null) => {
            if (code === 0) {
                // Parse the dotnet info to find the base path
                const lines = stdout.split('\n');
                const basePathLine = lines.find(line => line.includes('Base Path:'));
                
                if (basePathLine) {
                    // Extract the base path
                    const match = basePathLine.match(/Base Path:\s*(.+)/);
                    if (match && match[1]) {
                        let basePath = match[1].trim();
                        sendSseMessage(controller, 'stdout', `Found .NET base path: ${basePath}`);
                        
                        // If the base path ends with a specific SDK version, go up to the parent directory
                        if (basePath.includes('/sdk/')) {
                            basePath = basePath.replace(/\/sdk\/.*$/, '');
                            sendSseMessage(controller, 'stdout', `Adjusted base path to: ${basePath}`);
                        }
                        
                        // Look for SDKs in the base path
                        const sdkPath = `${basePath}/sdk/${version}`;
                        sendSseMessage(controller, 'stdout', `Looking for SDK at: ${sdkPath}`);
                        
                        // Check if the SDK directory exists and remove it
                        const fs = require('fs');
                        if (fs.existsSync(sdkPath)) {
                            sendSseMessage(controller, 'stdout', `Found SDK directory, removing: ${sdkPath}`);
                            
                            // Remove the SDK directory
                            const rmChild = spawn('rm', ['-rf', sdkPath], {
                                stdio: ['pipe', 'pipe', 'pipe'],
                                env: { ...process.env },
                                shell: false,
                                detached: false
                            });
                            
                            rmChild.on('close', (rmCode: number | null) => {
                                if (rmCode === 0) {
                                    sendSseMessage(controller, 'result', `✅ Successfully removed SDK directory: ${sdkPath}`);
                                    resolve(true);
                                } else {
                                    sendSseMessage(controller, 'result', `❌ Failed to remove SDK directory: ${sdkPath}`);
                                    resolve(false);
                                }
                            });
                            
                            rmChild.on('error', (error: Error) => {
                                sendSseMessage(controller, 'result', `❌ Error removing SDK directory: ${error.message}`);
                                resolve(false);
                            });
                        } else {
                            sendSseMessage(controller, 'result', `❌ SDK version ${version} not found at expected path: ${sdkPath}`);
                            resolve(false);
                        }
                    } else {
                        sendSseMessage(controller, 'result', `❌ Could not parse base path from dotnet --info output`);
                        resolve(false);
                    }
                } else {
                    sendSseMessage(controller, 'result', `❌ Could not find base path in dotnet --info output`);
                    resolve(false);
                }
            } else {
                sendSseMessage(controller, 'result', '❌ Failed to get dotnet info for SDK removal');
                resolve(false);
            }
        });
        
        child.on('error', (error: Error) => {
            sendSseMessage(controller, 'result', `❌ Error getting dotnet info: ${error.message}`);
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
    
    // Additional validation for version parameter
    if (version.trim() === '') {
        return new Response(JSON.stringify({ error: 'Version parameter cannot be empty.' }), {
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
