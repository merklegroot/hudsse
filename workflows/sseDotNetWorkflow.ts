import { DotNetInfoResult } from "@/models/SseMessage";
import { parseDotnetInfo } from "./parseDotnetInfo";
import { spawnAndGetDataWorkflow } from "./spawnAndGetDataWorkflow";
import { flexibleSseHandlerProps } from "./sseFactory";
import { SpawnResultWithParsedData } from "@/models/SpawnResult";
import { execSync } from "child_process";

async function executeDotNetInfo(props: flexibleSseHandlerProps): Promise<SpawnResultWithParsedData<DotNetInfoResult>> {
    console.log('executeDotNetInfo: Starting dotnet --info command');
    props.sendMessage({ type: 'other', contents: 'Executing dotnet --info command...' });
    
    // Try to find dotnet executable dynamically
    let dotnetPath = 'dotnet';
    try {
        dotnetPath = execSync('which dotnet', { encoding: 'utf8' }).trim();
        console.log('executeDotNetInfo: Found dotnet at:', dotnetPath);
    } catch (error) {
        console.log('executeDotNetInfo: Could not find dotnet in PATH, using fallback methods');
    }
    
    let allOutput = '';
    const result = await spawnAndGetDataWorkflow.executeWithFallback({
        command: dotnetPath,
        args: ['--info'],
        timeout: 5000,
        dataCallback: (data: string) => {
            allOutput += data;
            const lines = data.split('\n').filter(line => line.trim().length > 0);
            
            for (const line of lines) {
                props.sendMessage({ type: 'stdout', contents: line.trim() });
            }
        }
    });

    console.log('executeDotNetInfo: Command completed', { 
        wasSuccessful: result.wasSuccessful, 
        exitCode: result.exitCode, 
        stdoutLength: result.stdout.length,
        stderrLength: result.stderr.length,
        stderr: result.stderr
    });

    // Handle case where dotnet command is not found
    if (!result.wasSuccessful && result.stderr.includes('ENOENT')) {
        console.log('executeDotNetInfo: ENOENT error detected, dotnet command not found');
        props.sendMessage({ 
            type: 'result', 
            contents: 'Error: dotnet command not found. Please install .NET SDK to use this feature.' 
        });
        return {
            ...result,
            parsedData: undefined
        };
    }


    let parsedInfo: DotNetInfoResult | undefined = undefined;
    // Parse the result if we have output, regardless of exit code
    // dotnet --info often returns non-zero exit codes but still provides useful information
    // Use the collected output from dataCallback
    if (allOutput && allOutput.length > 0) {
        try {
            parsedInfo = parseDotnetInfo(allOutput);
            props.sendMessage({ 
                type: 'result', 
                contents: 'DotNet info parsed successfully',
                result: JSON.stringify(parsedInfo)
            });
        } catch (error) {
            props.sendMessage({ 
                type: 'result', 
                contents: `Failed to parse .NET info: ${error instanceof Error ? error.message : 'Unknown error'}` 
            });
        }
    }

    return {
        ...result,
        parsedData: parsedInfo
    };
}

export const sseDotNetWorkflow = {
    executeDotNetInfo
};