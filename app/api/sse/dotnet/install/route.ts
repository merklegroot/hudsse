import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { flexibleSseHandlerProps, sseFactory } from '@/workflows/sseFactory';
import { spawnAndGetDataWorkflow } from '@/workflows/spawnAndGetDataWorkflow';
import { sseDotNetWorkflow } from '@/workflows/sseDotNetWorkflow';

// Download the dotnet-install.sh script
async function downloadDotnetInstallScript(props: flexibleSseHandlerProps): Promise<string> {
    const scriptUrl = 'https://dot.net/v1/dotnet-install.sh';
    const tempDir = os.tmpdir();
    const scriptPath = path.join(tempDir, 'dotnet-install.sh');

    try {
        props.sendMessage({ type: 'other', contents: 'Downloading dotnet-install.sh script...' });
        const response = await fetch(scriptUrl);
        if (!response.ok) {
            throw new Error(`Failed to download script: ${response.statusText}`);
        }

        const scriptContent = await response.text();
        props.sendMessage({ type: 'other', contents: 'Script downloaded successfully' });
        props.sendMessage({ type: 'other', contents: 'Writing script to file...' });
        await fs.writeFile(scriptPath, scriptContent, { mode: 0o755 });

        props.sendMessage({ type: 'other', contents: 'Script written to file successfully' });

        return scriptPath;
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
    const scriptPath = await downloadDotnetInstallScript(props);

    props.sendMessage({ type: 'other', contents: 'Script downloaded successfully' });
    props.sendMessage({ type: 'other', contents: `Installing .NET ${majorVersion} SDK...` });
    await executeDotnetInstall(props, scriptPath, majorVersion);

    await sseDotNetWorkflow.executeDotNetInfo(props);
});
