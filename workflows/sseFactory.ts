import { CommandAndArgs, SpawnOptions, SpawnResult, SseMessage } from "@/models";
import { NextRequest } from "next/server";
import { spawnAndGetDataWorkflow } from "./spawnAndGetDataWorkflow";

export type onSuccess = ((allOutput: string, controller: ReadableStreamDefaultController) => void)
    | string
    | undefined
    | null;

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
function sendSseMessage(controller: ReadableStreamDefaultController, message: SseMessage) {
    const data = `data: ${JSON.stringify(message)}\n\n`;
    controller.enqueue(new TextEncoder().encode(data));
}

// Utility function to send command message
function sendCommandMessage(controller: ReadableStreamDefaultController, commandAndArgs: CommandAndArgs) {
    const commandMessage: SseMessage = {
        type: 'command',
        contents: `${commandAndArgs.command} ${commandAndArgs.args.join(' ')}`
    };

    sendSseMessage(controller, commandMessage);
}

// Utility function to send error message
function sendErrorMessage(controller: ReadableStreamDefaultController, message: string) {
    const errorMessage: SseMessage = {
        type: 'other',
        contents: message
    };
    sendSseMessage(controller, errorMessage);
}

// Utility function to send result message
function sendResultMessage(controller: ReadableStreamDefaultController, contents: string, result?: any) {
    const resultMessage: SseMessage = {
        type: 'result',
        contents,
        result: result ? JSON.stringify(result) : undefined
    };
    sendSseMessage(controller, resultMessage);
}

// Core command execution logic
async function executeCommand(
    commandAndArgs: CommandAndArgs,
    controller: ReadableStreamDefaultController,
    onSuccess: onSuccess
): Promise<boolean> {
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
                sendSseMessage(controller, message);
            }
        }
    };

    try {
        const result: SpawnResult = await spawnAndGetDataWorkflow.execute(spawnOptions);

        if (!result.wasSuccessful) {
            sendErrorMessage(controller, `Error: ${result.stderr}`);
            return false;
        }

        if (typeof onSuccess === 'function') {
            onSuccess(allOutput, controller);
            return true;
        }

        // Handle string, null, or undefined cases
        let successMessage: string;
        if (typeof onSuccess === 'string') {
            const trimmed = onSuccess.trim();
            successMessage = trimmed.length > 0 ? trimmed : 'Command executed successfully';
        } else {
            // null or undefined case
            successMessage = 'Command executed successfully';
        }

        sendResultMessage(controller, successMessage, allOutput);
        return true;

    } catch (error) {
        sendErrorMessage(controller, `Failed to execute command: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return false;
    }
}

export interface chainProp {
    commandAndArgs: CommandAndArgs;
    parser?: (output: string) => any;
    onSuccess: onSuccess;
}

export interface flexibleSseHandlerProps {
    req: NextRequest;
    controller: ReadableStreamDefaultController;
    sendMessage: (message: SseMessage) => void;

    onError: (error: string) => void;
}

function createFlexibleSseHandler(workflow: (props: flexibleSseHandlerProps) => Promise<void>) {
    return async function GET(req: NextRequest) {
        const stream = new ReadableStream({
            async start(controller: ReadableStreamDefaultController) {
                try {
                    await workflow({ req, controller, sendMessage: (message: SseMessage) => sendSseMessage(controller, message), onError: (error: string) => sendErrorMessage(controller, error) });
                } catch (error) {
                    // return onError(error instanceof Error ? error.message : 'Unknown error');
                    sendErrorMessage(controller, error instanceof Error ? error.message : 'Unknown error');
                } finally {
                    // Send [DONE] message to signal completion
                    controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
                    controller.close();
                }
            }
        });

        return new Response(stream, { headers: SSE_HEADERS });
    }
}

function createSseCommandHandler(props: chainProp) {
    return createChainedSseCommandsHandler([props]);
}

function createChainedSseCommandsHandler(chains: chainProp[]) {
    return async function GET(req: NextRequest) {
        const stream = new ReadableStream({
            async start(controller) {
                const results: any[] = [];

                for (const chain of chains) {
                    sendCommandMessage(controller, chain.commandAndArgs);

                    const wasSuccessful = await executeCommand(chain.commandAndArgs, controller, (allOutput, controller) => {
                        try {
                            const parsedResult = chain.parser ? chain.parser(allOutput) : allOutput;
                            results.push(parsedResult);

                            // Handle different types of onSuccess
                            let successMessage: string;
                            if (typeof chain.onSuccess === 'function') {
                                // If it's a function, call it and get the result
                                const functionResult = chain.onSuccess(allOutput, controller);
                                successMessage = typeof functionResult === 'string' ? functionResult : 'Command executed successfully';
                            } else {
                                if (typeof chain.onSuccess === 'string') {
                                    // If it's a string, use it directly
                                    const trimmed = chain.onSuccess.trim();
                                    successMessage = trimmed.length > 0 ? trimmed : 'Command executed successfully';
                                } else {
                                    // If it's null/undefined, use default
                                    successMessage = 'Command executed successfully';
                                }
                            }

                            sendResultMessage(controller, successMessage, parsedResult);
                        } catch (parseError) {
                            sendErrorMessage(controller, `Failed to parse command output: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
                        }
                    });

                    // If command failed, we could choose to continue or break
                    // For now, we'll continue with the next command
                    if (!wasSuccessful) {
                        // Error message was already sent by executeCommand
                        continue;
                    }
                }

                controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
                controller.close();
            }
        });

        return new Response(stream, { headers: SSE_HEADERS });
    };
}


export const sseFactory = {
    createSseCommandHandler,
    createChainedSseCommandsHandler,
    createFlexibleSseHandler,

    sendSseMessage,
    SSE_HEADERS
};