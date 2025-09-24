import { spawnAndGetDataWorkflow } from "./spawnAndGetDataWorkflow";
import { flexibleSseHandlerProps } from "./sseFactory";
import { SpawnResultWithParsedData } from "@/models/SpawnResult";
import { PathResult } from "@/models/SseMessage";
import { parsePath } from "./parsePath";

async function executePath(props: flexibleSseHandlerProps): Promise<SpawnResultWithParsedData<PathResult>> {
    const result = await spawnAndGetDataWorkflow.execute({
        command: 'bash',
        args: ['-l', '-c', 'echo $PATH']
    });

    return {
        ...result,
        stdout: result.stdout.trim(),
        parsedData: parsePath(result.stdout)
    };
}

export const ssePathWorkflow = {
    executePath
};