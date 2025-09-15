import { parseDotnetInfo } from "./parseDotnetInfo";
import { spawnAndGetDataWorkflow } from "./spawnAndGetDataWorkflow";
import { flexibleSseHandlerProps } from "./sseFactory";

async function executeDotNetInfo(props: flexibleSseHandlerProps) {
    console.log('executeDotNetInfo: Starting dotnet --info command');
    props.sendMessage({ type: 'other', contents: 'Executing dotnet --info command...' });
    
    const result = await spawnAndGetDataWorkflow.executeWithFallback({
        command: 'dotnet',
        args: ['--info'],
        timeout: 5000,
        dataCallback: (data: string) => {
            props.sendMessage({ type: 'stdout', contents: data });
        }
    });

    console.log('executeDotNetInfo: Command completed', { 
        wasSuccessful: result.wasSuccessful, 
        exitCode: result.exitCode, 
        stdoutLength: result.stdout.length,
        stderrLength: result.stderr.length 
    });

    // Parse the result if successful
    if (result.wasSuccessful && result.stdout) {
        try {
            const parsedInfo = parseDotnetInfo(result.stdout);
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

    return result;
}

export const sseDotNetWorkflow = {
    executeDotNetInfo
};