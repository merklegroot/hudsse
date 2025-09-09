import { NextRequest } from 'next/server';
import { spawnAndGetDataWorkflow } from '../../../../workflows/spawnAndGetDataWorkflow';
import { SpawnOptions } from '../../../../models/SpawnOptions';
import { SpawnResult } from '../../../../models/SpawnResult';
import { sseMessage } from '../../../../models/sseMessage';
import { parseDotnetSdks } from '../../../../utils/parseDotnetSdks';

export async function GET(req: NextRequest) {
  // Create a ReadableStream for SSE
  const stream = new ReadableStream({
    start(controller) {
      console.log('Starting dotnet --list-sdks command...');
      
      // Send initial message to indicate the command is starting
      const initialMessage: sseMessage = {
        type: 'other',
        contents: 'Starting dotnet --list-sdks command...'
      };
      const initialData = `data: ${JSON.stringify(initialMessage)}\n\n`;
      controller.enqueue(new TextEncoder().encode(initialData));
      
      // Collect all output for parsing
      let allOutput = '';
      
      // Configure the spawn options for dotnet --list-sdks
      const spawnOptions: SpawnOptions = {
        command: 'dotnet',
        args: ['--list-sdks'],
        timeout: 30000, // 30 seconds timeout
        dataCallback: (data: string) => {
          // Collect all output for later parsing
          allOutput += data;
          
          // Stream each line of output as it comes
          const lines = data.split('\n').filter(line => line.trim().length > 0);
          
          for (const line of lines) {
            const message: sseMessage = {
              type: 'stdout',
              contents: line.trim()
            };
            const sseData = `data: ${JSON.stringify(message)}\n\n`;
            
            controller.enqueue(new TextEncoder().encode(sseData));
          }
        }
      };

      // Execute the dotnet command and handle completion
      spawnAndGetDataWorkflow.execute(spawnOptions)
        .then((result: SpawnResult) => {
          if (result.success) {
            // Parse the SDK data and send result message
            try {
              const listSdksResult = parseDotnetSdks(allOutput);
              const resultMessage: sseMessage = {
                type: 'result',
                contents: JSON.stringify(listSdksResult)
              };
              const resultData = `data: ${JSON.stringify(resultMessage)}\n\n`;
              controller.enqueue(new TextEncoder().encode(resultData));
            } catch (parseError) {
              const parseErrorMessage: sseMessage = {
                type: 'other',
                contents: `Failed to parse SDK data: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`
              };
              const parseErrorData = `data: ${JSON.stringify(parseErrorMessage)}\n\n`;
              controller.enqueue(new TextEncoder().encode(parseErrorData));
            }
            
            controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
          } else {
            const errorMessage: sseMessage = {
              type: 'other',
              contents: `Error: ${result.stderr}`
            };
            const errorData = `data: ${JSON.stringify(errorMessage)}\n\n`;
            controller.enqueue(new TextEncoder().encode(errorData));
            controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
          }
          
          controller.close();
        })
        .catch((error: Error) => {
          const errorMessage: sseMessage = {
            type: 'other',
            contents: `Failed to execute dotnet command: ${error.message}`
          };
          const errorData = `data: ${JSON.stringify(errorMessage)}\n\n`;
          controller.enqueue(new TextEncoder().encode(errorData));
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
          controller.close();
        });
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
}

