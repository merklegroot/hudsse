import { NextRequest } from 'next/server';
import { SseMessage } from '../../../../models/SseMessage';

export async function GET(req: NextRequest) {
  // Create a ReadableStream for SSE
  const stream = new ReadableStream({
    start(controller) {
      const messages = [
        'SSE Message 1',
        'SSE Message 2', 
        'SSE Message 3',
        'SSE Message 4',
        'SSE Message 5',
        'SSE Message 6',
        'SSE Message 7',
        'SSE Message 8',
        'SSE Message 9',
        'SSE Message 10'
      ];

      let messageIndex = 0;

      const sendMessage = () => {
        if (messageIndex < messages.length) {
          const messageText = messages[messageIndex];
          const message: SseMessage = {
            type: 'other',
            contents: messageText
          };
          const data = `data: ${JSON.stringify(message)}\n\n`;
          
          console.log(`Sending message ${messageIndex + 1}: ${messageText} at ${new Date().toISOString()}`);
          controller.enqueue(new TextEncoder().encode(data));
          
          messageIndex++;
          
          if (messageIndex < messages.length) {
            setTimeout(sendMessage, 250); // 0.25 seconds
          } else {
            console.log('Sending DONE signal');
            controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
            controller.close();
          }
        }
      };

      // Start sending messages
      sendMessage();
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
