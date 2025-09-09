import { NextRequest } from 'next/server';
import { spawnAndGetDataWorkflow } from '../../../../workflows/spawnAndGetDataWorkflow';
import { SpawnOptions } from '../../../../models/SpawnOptions';
import { SpawnResult } from '../../../../models/SpawnResult';

export async function GET(req: NextRequest) {
  // Create a ReadableStream for SSE
  const stream = new ReadableStream({
    start(controller) {
      console.log('Starting dotnet --list-sdks command...');
      
      // Send initial message to indicate the command is starting
      const initialData = `data: ${JSON.stringify({ message: 'Starting dotnet --list-sdks command...', timestamp: new Date().toISOString() })}\n\n`;
      controller.enqueue(new TextEncoder().encode(initialData));
      
      // Configure the spawn options for dotnet --list-sdks
      const spawnOptions: SpawnOptions = {
        command: 'dotnet',
        args: ['--list-sdks'],
        timeout: 30000, // 30 seconds timeout
        dataCallback: (data: string) => {
          // Stream each line of output as it comes
          const lines = data.split('\n').filter(line => line.trim().length > 0);
          
          for (const line of lines) {
            const message = line.trim();
            const sseData = `data: ${JSON.stringify({ message, timestamp: new Date().toISOString() })}\n\n`;
            
            controller.enqueue(new TextEncoder().encode(sseData));
          }
        }
      };

      // Execute the dotnet command and handle completion
      spawnAndGetDataWorkflow.execute(spawnOptions)
        .then((result: SpawnResult) => {
          if (result.success) {
            controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
          } else {
            const errorData = `data: ${JSON.stringify({ 
              message: `Error: ${result.stderr}`, 
              timestamp: new Date().toISOString() 
            })}\n\n`;
            controller.enqueue(new TextEncoder().encode(errorData));
            controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
          }
          
          controller.close();
        })
        .catch((error: Error) => {
          const errorData = `data: ${JSON.stringify({ 
            message: `Failed to execute dotnet command: ${error.message}`, 
            timestamp: new Date().toISOString() 
          })}\n\n`;
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

