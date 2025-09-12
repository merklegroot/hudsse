import { CommandAndArgs, SpawnOptions, SpawnResult, SseMessage } from "@/models";
import { NextRequest } from "next/server";
import { spawnAndGetDataWorkflow } from "./spawnAndGetDataWorkflow";

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
    onSuccess: (allOutput: string, controller: ReadableStreamDefaultController) => void
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

        if (result.success) {
            onSuccess(allOutput, controller);
            return true;
        } else {
            sendErrorMessage(controller, `Error: ${result.stderr}`);
            return false;
        }
    } catch (error) {
        sendErrorMessage(controller, `Failed to execute command: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return false;
    }
}

function createSseCommandHandler(
    commandAndArgs: CommandAndArgs,
    onSuccess: (allOutput: string, controller: ReadableStreamDefaultController) => void
) {
    return async function GET(req: NextRequest) {
        const stream = new ReadableStream({
            async start(controller) {
                sendCommandMessage(controller, commandAndArgs);
                
                const success = await executeCommand(commandAndArgs, controller, onSuccess);
                
                controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
                controller.close();
            }
        });

        return new Response(stream, { headers: SSE_HEADERS });
    };
}

export interface chainProp {
    commandAndArgs: CommandAndArgs;
    parser: (output: string) => any;
    successMessage?: string;
}

function createChainedSseCommandsHandlerWithParsers(chains: chainProp[]) {
    return async function GET(req: NextRequest) {
        const stream = new ReadableStream({
            async start(controller) {
                const results: any[] = [];
                
                for (const chain of chains) {
                    sendCommandMessage(controller, chain.commandAndArgs);
                    
                    const success = await executeCommand(chain.commandAndArgs, controller, (allOutput, controller) => {
                        try {
                            const parsedResult = chain.parser(allOutput);
                            results.push(parsedResult);
                            sendResultMessage(controller, chain.successMessage || 'Command executed successfully', parsedResult);
                        } catch (parseError) {
                            sendErrorMessage(controller, `Failed to parse command output: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
                        }
                    });
                    
                    // If command failed, we could choose to continue or break
                    // For now, we'll continue with the next command
                    if (!success) {
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

function createSseCommandHandlerWithParser<T>(
    commandAndArgs: CommandAndArgs,
    parser: (output: string) => T,
    successMessage: string = 'Command executed successfully'
) {
    return createSseCommandHandler(commandAndArgs, (allOutput, controller) => {
        try {
            const parsedResult = parser(allOutput);
            sendResultMessage(controller, successMessage, parsedResult);
        } catch (parseError) {
            sendErrorMessage(controller, `Failed to parse command output: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
        }
    });
}

export const sseFactory = {
    createSseCommandHandler,
    createSseCommandHandlerWithParser,
    createChainedSseCommandsHandlerWithParsers
};