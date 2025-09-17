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

function getAppDownloadFolder(): string {
    // return os.tmpdir();
    return path.join(process.cwd(), "download");
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
async function extractDotNet7SdkArchive(props: flexibleSseHandlerProps, archivePath: string): Promise<string> {
    const tempDir = getAppDownloadFolder();
    const extractDir = path.join(tempDir, 'dotnet-sdk-7.0.410');

    try {
        props.sendMessage({ type: 'other', contents: 'Extracting .NET 7 SDK archive...' });
        
        await extract({
            file: archivePath,
            cwd: tempDir,
            onentry: (entry) => {
                props.sendMessage({ type: 'other', contents: `Extracting: ${entry.path}` });
            }
        });

        props.sendMessage({ type: 'other', contents: 'Archive extracted successfully' });
        return extractDir;
    } catch (error) {
        throw new Error(`Failed to extract .NET 7 SDK archive: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// Install the extracted .NET 7 SDK
async function installDotNet7Sdk(props: flexibleSseHandlerProps, extractDir: string): Promise<void> {
    const installDir = path.join(os.homedir(), '.dotnet');
    
    try {
        props.sendMessage({ type: 'other', contents: `Installing .NET 7 SDK to ${installDir}...` });
        
        // Ensure the install directory exists
        await fs.mkdir(installDir, { recursive: true });
        
        // Copy the extracted SDK contents to the install directory
        const sdkContents = await fs.readdir(extractDir);
        for (const item of sdkContents) {
            const sourcePath = path.join(extractDir, item);
            const destPath = path.join(installDir, item);
            
            const stat = await fs.stat(sourcePath);
            if (stat.isDirectory()) {
                await fs.cp(sourcePath, destPath, { recursive: true });
            } else {
                await fs.copyFile(sourcePath, destPath);
            }
        }

        // Make the dotnet executable executable
        const dotnetExecutable = path.join(installDir, 'dotnet');
        await fs.chmod(dotnetExecutable, 0o755);

        props.sendMessage({ type: 'other', contents: '.NET 7 SDK installed successfully' });
    } catch (error) {
        throw new Error(`Failed to install .NET 7 SDK: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
            const archivePath = await downloadDotNet7SdkArchive(props);
            const extractDir = await extractDotNet7SdkArchive(props, archivePath);
            await installDotNet7Sdk(props, extractDir);
            
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
