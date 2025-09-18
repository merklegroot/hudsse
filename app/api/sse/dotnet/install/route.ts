import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import { createGunzip } from 'zlib';
import { extract } from 'tar';
import { flexibleSseHandlerProps, sseFactory } from '@/workflows/sseFactory';
import { spawnAndGetDataWorkflow } from '@/workflows/spawnAndGetDataWorkflow';
import { sseDotNetWorkflow } from '@/workflows/sseDotNetWorkflow';
import { DotNetInfoResult } from '@/models/SseMessage';

function getAppDownloadFolder(): string {
    // return os.tmpdir();
    return path.join(process.cwd(), "download");
}

/** Given the .NET base path, which often looks like this:  /home/username/.dotnet/sdk/9.0.304/,
 * return the root path which often looks like this: /home/username/.dotnet */
function getDotnetRootPath(basePath: string): string {
    let dotnetRootPath = basePath;
    if (dotnetRootPath.includes('/sdk/')) {
        dotnetRootPath = basePath.replace(/\/sdk\/.*$/, '');
    }
    
    return dotnetRootPath;
}

async function downloadFile(props: flexibleSseHandlerProps, url: string, localFilePath: string): Promise<string> {
    // if the file already exists, just return the local file path
    try {
        await fs.stat(localFilePath);
        return localFilePath;
    } catch (error) {
        // File doesn't exist, proceed with download
    }

    // Ensure the directory exists
    const dir = path.dirname(localFilePath);
    await fs.mkdir(dir, { recursive: true });

    // otherwise, download the file
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    await fs.writeFile(localFilePath, Buffer.from(buffer));

    return localFilePath;
}

// Download the .NET 7 SDK archive
async function downloadDotNet7SdkArchive(props: flexibleSseHandlerProps): Promise<string> {
    const url = 'https://builds.dotnet.microsoft.com/dotnet/Sdk/7.0.410/dotnet-sdk-7.0.410-linux-x64.tar.gz'
    const tempDir = getAppDownloadFolder();
    const archivePath = path.join(tempDir, 'dotnet-sdk-7.0.410-linux-x64.tar.gz');

    return await downloadFile(props, url, archivePath);
}

// Extract the .NET 7 SDK archive
async function extractDotNet7SdkArchive(props: flexibleSseHandlerProps, archivePath: string, installDir: string): Promise<string> {
    try {
        props.sendMessage({ type: 'other', contents: `Extracting .NET 7 SDK archive to ${installDir}...` });
        
        // Ensure the install directory exists
        await fs.mkdir(installDir, { recursive: true });
        
        await extract({
            file: archivePath,
            cwd: installDir,
            onentry: (entry) => {
                props.sendMessage({ type: 'other', contents: `Extracting: ${entry.path}` });
            }
        });

        // Make the dotnet executable executable
        const dotnetExecutable = path.join(installDir, 'dotnet');
        await fs.chmod(dotnetExecutable, 0o755);

        props.sendMessage({ type: 'other', contents: 'Archive extracted successfully' });
        return installDir;
    } catch (error) {
        throw new Error(`Failed to extract .NET 7 SDK archive: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// Verify the .NET 7 SDK installation
async function installDotNet7Sdk(props: flexibleSseHandlerProps, installDir: string): Promise<void> {
    try {
        props.sendMessage({ type: 'other', contents: `Verifying .NET 7 SDK installation at ${installDir}...` });
        
        // Verify the dotnet executable exists and is executable
        const dotnetExecutable = path.join(installDir, 'dotnet');
        const stat = await fs.stat(dotnetExecutable);
        
        if (!stat.isFile()) {
            throw new Error('dotnet executable not found');
        }

        props.sendMessage({ type: 'other', contents: '.NET 7 SDK installation verified successfully' });
    } catch (error) {
        throw new Error(`Failed to verify .NET 7 SDK installation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// Download the dotnet-install.sh script
async function downloadDotnetInstallScript(props: flexibleSseHandlerProps): Promise<string> {
    const scriptUrl = 'https://dot.net/v1/dotnet-install.sh';

    props.sendMessage({ type: 'other', contents: 'Downloading dotnet-install.sh script...' });
    

    try {
        const downloadedFileFullPath = await downloadFile(props, scriptUrl, path.join(getAppDownloadFolder(), 'dotnet-install.sh'));
        props.sendMessage({ type: 'other', contents: 'Script downloaded successfully' });

        props.sendMessage({ type: 'other', contents: 'Making script executable...' });
        await fs.chmod(downloadedFileFullPath, 0o755);
        props.sendMessage({ type: 'other', contents: 'Script made executable successfully' });

        return downloadedFileFullPath;
    } catch (error) {
        throw new Error(`Failed to download dotnet-install.sh: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

function getDotNetInstallArgs(majorVersion: number): string[] {
    type installerArgType = Record<string, string | boolean | number | undefined | null>;    

    const installDirArg: installerArgType = { '--install-dir': path.join(os.homedir(), '.dotnet') };
    const verboseArg: installerArgType = { '--verbose': true };

    function getChannelAndVersion(majorVersion: number): installerArgType[] {
        // if it's majorVersion 8, use channel LTS.
        // if it's majorVersion 9, use channel STS.
        // otherwise, give it the version and not the channel
        if (majorVersion === 8)
            return [{ channel: 'LTS', version: majorVersion.toString() }];
        
        if (majorVersion === 9)
            return [{ channel: 'STS', version: majorVersion.toString() }];

        // weird, microsoft. this is weird of you.
        if (majorVersion === 7)
            return [{ channel: '7.0' }];

        throw Error(`Not implemented for version ${majorVersion} yet.`);
    }
    
    const channelAndVersionArgs: installerArgType[] = getChannelAndVersion(majorVersion);
    const argKvps: installerArgType[] = [ installDirArg, verboseArg, ...channelAndVersionArgs];

    // now we just want an array of strings. note that if the value is empty-ish, just ignore it.
    const args: string[] = [];
    for (const argKvp of argKvps) {
        for (const [key, value] of Object.entries(argKvp)) {
            if (value) {
                args.push(`${key} ${value}`);
            }
        }
    }

    return args;
}

// Execute the dotnet-install.sh script
async function executeDotnetInstall(props: flexibleSseHandlerProps, scriptPath: string, majorVersion: number) {
    return new Promise<void>(async (resolve) => {
        const args = getDotNetInstallArgs(majorVersion);

        props.sendMessage({ type: 'command', contents: `Executing: bash ${scriptPath} ${args.join(' ')}` });
        const result = await spawnAndGetDataWorkflow.executeWithFallback({
            command: 'bash',
            args: [scriptPath, ...args],
            timeout: 10 * 60 * 1000,
            dataCallback: (data: string) => {
                props.sendMessage({ type: 'stdout', contents: data });
            }
        });

        if (result.wasSuccessful) {
            props.sendMessage({ type: 'result', contents: `✅ .NET ${majorVersion} SDK installation completed successfully!` });
        } else {
            props.sendMessage({ type: 'result', contents: `❌ .NET ${majorVersion} SDK installation failed. Check the output above for details.` });
        }

        resolve();
    });
}

export const GET = sseFactory.createFlexibleSseHandler(async (props: flexibleSseHandlerProps) => {
    const { searchParams } = new URL(props.req.url);
    const majorVersion = parseInt(searchParams.get('version') || '8');

    if (isNaN(majorVersion) || majorVersion < 6 || majorVersion > 10) {
        return props.onError(`Not implemented for version ${majorVersion}. Must be between 6 and 10.`);
    }

    props.sendMessage({ type: 'other', contents: `Starting .NET ${majorVersion} SDK installation...` });

    // Special handling for .NET 7 SDK - use direct download instead of install script
    if (majorVersion === 7) {
        try {
            // First, get the current .NET installation path
            props.sendMessage({ type: 'other', contents: 'Getting current .NET installation path...' });
            const dotnetInfoResult = await sseDotNetWorkflow.executeDotNetInfo(props);
            
            let installDir: string;
            if (dotnetInfoResult.parsedData?.runtimeEnvironment?.basePath) {
                installDir = getDotnetRootPath(dotnetInfoResult.parsedData.runtimeEnvironment.basePath);
                props.sendMessage({ type: 'other', contents: `Found existing .NET installation at: ${installDir}` });
            } else {
                // Fallback to default location if no existing installation found
                installDir = path.join(os.homedir(), '.dotnet');
                props.sendMessage({ type: 'other', contents: `No existing .NET installation found, using default location: ${installDir}` });
            }
            
            const archivePath = await downloadDotNet7SdkArchive(props);
            await extractDotNet7SdkArchive(props, archivePath, installDir);
            await installDotNet7Sdk(props, installDir);
            
            props.sendMessage({ type: 'result', contents: '✅ .NET 7 SDK installation completed successfully!' });
        } catch (error) {
            props.sendMessage({ type: 'result', contents: `❌ .NET 7 SDK installation failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
        }
    } else {
        // Use the standard install script for other versions
        const scriptPath = await downloadDotnetInstallScript(props);
        props.sendMessage({ type: 'other', contents: 'Script downloaded successfully' });
        props.sendMessage({ type: 'other', contents: `Installing .NET ${majorVersion} SDK...` });
        await executeDotnetInstall(props, scriptPath, majorVersion);
    }

    await sseDotNetWorkflow.executeDotNetInfo(props);
});
