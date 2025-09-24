import { spawnAndGetDataWorkflow } from "./spawnAndGetDataWorkflow";
import { flexibleSseHandlerProps } from "./sseFactory";
import { SpawnResultWithParsedData } from "@/models/SpawnResult";
import { PathResult } from "@/models/SseMessage";
import { parsePath } from "./parsePath";
import { platformUtil } from "@/utils/platformUtil";

async function executePath(props: flexibleSseHandlerProps): Promise<SpawnResultWithParsedData<PathResult>> {
    const platform = platformUtil.detectPlatform();
    if (platform === 'windows') {
        throw new Error('ssePathWorkflow is not supported on Windows');
    }

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