import { NextRequest } from 'next/server';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

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

// Download the dotnet-install.sh script
async function downloadDotnetInstallScript(): Promise<string> {
    const scriptUrl = 'https://dot.net/v1/dotnet-install.sh';
    const tempDir = os.tmpdir();
    const scriptPath = path.join(tempDir, 'dotnet-install.sh');

    try {
        const response = await fetch(scriptUrl);
        if (!response.ok) {
            throw new Error(`Failed to download script: ${response.statusText}`);
        }

        const scriptContent = await response.text();
        await fs.writeFile(scriptPath, scriptContent, { mode: 0o755 });

        return scriptPath;
    } catch (error) {
        throw new Error(`Failed to download dotnet-install.sh: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// Execute the dotnet-install.sh script
async function executeDotnetInstall(scriptPath: string, majorVersion: number, controller: ReadableStreamDefaultController): Promise<boolean> {
    return new Promise((resolve) => {
        const channel = majorVersion === 8 ? 'LTS'
            // : majorVersion === 9 ? 'STS'
            : majorVersion.toString();

        const args = [
            '--channel', channel,
            '--install-dir', path.join(os.homedir(), '.dotnet'),
            '--verbose'
        ];

        sendSseMessage(controller, 'command', `Executing: bash ${scriptPath} ${args.join(' ')}`);

        const child = spawn('bash', [scriptPath, ...args], {
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
                sendSseMessage(controller, 'result', `Successfully installed .NET ${majorVersion} SDK`);
                resolve(true);
            } else {
                sendSseMessage(controller, 'result', `Installation failed with exit code ${code}. Error: ${stderr}`);
                resolve(false);
            }
        });

        // Handle process errors
        child.on('error', (error: Error) => {
            sendSseMessage(controller, 'result', `Failed to execute installation: ${error.message}`);
            resolve(false);
        });

        // Set a timeout (10 minutes for installation)
        const timeoutHandle = setTimeout(() => {
            child.kill('SIGKILL');
            sendSseMessage(controller, 'result', 'Installation timed out after 10 minutes');
            resolve(false);
        }, 10 * 60 * 1000);

        // Clear timeout when process completes
        child.on('close', () => {
            clearTimeout(timeoutHandle);
        });
    });
}

// Clean up temporary files
async function cleanup(scriptPath: string) {
    try {
        await fs.unlink(scriptPath);
    } catch (error) {
        console.warn('Failed to clean up temporary script file:', error);
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const majorVersion = parseInt(searchParams.get('version') || '8');

    if (isNaN(majorVersion) || majorVersion < 6 || majorVersion > 10) {
        return new Response(JSON.stringify({ error: 'Invalid version. Must be between 6 and 10.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Block .NET 5 and 7 specifically for now
    if (majorVersion === 5 || majorVersion === 7) {
        return new Response(JSON.stringify({
            error: `Installation of.NET ${majorVersion} is not yet supported in this app.`
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const stream = new ReadableStream({
        async start(controller) {
            let scriptPath = '';

            try {
                sendSseMessage(controller, 'other', `Starting .NET ${majorVersion} SDK installation...`);

                // Download the installation script
                sendSseMessage(controller, 'other', 'Downloading dotnet-install.sh script...');
                scriptPath = await downloadDotnetInstallScript();
                sendSseMessage(controller, 'other', 'Script downloaded successfully');

                // Execute the installation
                sendSseMessage(controller, 'other', `Installing .NET ${majorVersion} SDK...`);
                const success = await executeDotnetInstall(scriptPath, majorVersion, controller);

                if (success) {
                    sendSseMessage(controller, 'result', `✅ .NET ${majorVersion} SDK installation completed successfully!`);
                } else {
                    sendSseMessage(controller, 'result', `❌ .NET ${majorVersion} SDK installation failed. Check the output above for details.`);
                }

            } catch (error) {
                sendSseMessage(controller, 'result', `❌ Installation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
                // Clean up
                if (scriptPath) {
                    await cleanup(scriptPath);
                }

                controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
                controller.close();
            }
        }
    });

    return new Response(stream, { headers: SSE_HEADERS });
}
