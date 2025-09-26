import { DotNetInfoResult } from "@/models/SseMessage";
import { parseDotnetInfo } from "./parseDotnetInfo";
import { spawnAndGetDataWorkflow } from "./spawnAndGetDataWorkflow";
import { flexibleSseHandlerProps } from "./sseFactory";
import { SpawnResultWithParsedData } from "@/models/SpawnResult";

async function executeDotNetInfo(props: flexibleSseHandlerProps): Promise<SpawnResultWithParsedData<DotNetInfoResult>> {
    console.log('executeDotNetInfo: Starting dotnet --info command');
    props.sendMessage({ type: 'other', contents: 'Executing dotnet --info command...' });
    
    let allOutput = '';
    const result = await spawnAndGetDataWorkflow.execute({
        command: 'dotnet',
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
        stderrLength: result.stderr.length
    });


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