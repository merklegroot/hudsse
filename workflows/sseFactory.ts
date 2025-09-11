import { CommandAndArgs, SpawnOptions, SpawnResult, SseMessage } from "@/models";
import { NextRequest } from "next/server";
import { spawnAndGetDataWorkflow } from "./spawnAndGetDataWorkflow";

function createSseCommandHandler(
    commandAndArgs: CommandAndArgs,
    onSuccess: (allOutput: string, controller: ReadableStreamDefaultController) => void
) {
    return async function GET(req: NextRequest) {
        const stream = new ReadableStream({
            async start(controller) {

                const commandMessage: SseMessage = {
                    type: 'command',
                    contents: `${commandAndArgs.command} ${commandAndArgs.args.join(' ')}`
                };
                const commandData = `data: ${JSON.stringify(commandMessage)}\n\n`;
                controller.enqueue(new TextEncoder().encode(commandData));

                let allOutput = '';

                const spawnOptions: SpawnOptions = {
                    command: commandAndArgs.command,
                    args: commandAndArgs.args,
                    timeout: 30000, // 30 seconds timeout
                    dataCallback: (data: string) => {
                        allOutput += data;

                        const lines = data.split('\n').filter(line => line.trim().length > 0);

                        for (const line of lines) {
                            const message: SseMessage = {
                                type: 'stdout',
                                contents: line.trim()
                            };
                            const sseData = `data: ${JSON.stringify(message)}\n\n`;

                            controller.enqueue(new TextEncoder().encode(sseData));
                        }
                    }
                };

                // Execute the dotnet command and handle completion
                try {
                    const result: SpawnResult = await spawnAndGetDataWorkflow.execute(spawnOptions);

                    if (result.success) {
                        onSuccess(allOutput, controller);
                        controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
                    } else {
                        const errorMessage: SseMessage = {
                            type: 'other',
                            contents: `Error: ${result.stderr}`
                        };
                        const errorData = `data: ${JSON.stringify(errorMessage)}\n\n`;
                        controller.enqueue(new TextEncoder().encode(errorData));
                        controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
                    }
                } catch (error) {
                    const errorMessage: SseMessage = {
                        type: 'other',
                        contents: `Failed to execute dotnet command: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    };
                    const errorData = `data: ${JSON.stringify(errorMessage)}\n\n`;
                    controller.enqueue(new TextEncoder().encode(errorData));
                    controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
                }

                controller.close();
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Cache-Control',
                'X-Accel-Buffering': 'no' // Disable nginx buffering
            }
        });
    };
}

function createSseCommandHandlerWithParser<T>(
    commandAndArgs: CommandAndArgs,
    parser: (output: string) => T,
    successMessage: string = 'Command executed successfully'
) {
    return createSseCommandHandler(commandAndArgs, (allOutput, controller) => {
        try {
            const parsedResult = parser(allOutput);
            const resultMessage: SseMessage = {
                type: 'result',
                contents: successMessage,
                result: JSON.stringify(parsedResult)
            };
            const resultData = `data: ${JSON.stringify(resultMessage)}\n\n`;
            controller.enqueue(new TextEncoder().encode(resultData));
        } catch (parseError) {
            const parseErrorMessage: SseMessage = {
                type: 'other',
                contents: `Failed to parse command output: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`
            };
            const parseErrorData = `data: ${JSON.stringify(parseErrorMessage)}\n\n`;
            controller.enqueue(new TextEncoder().encode(parseErrorData));
        }
    });
}

export const sseFactory = {
    createSseCommandHandler,
    createSseCommandHandlerWithParser
};