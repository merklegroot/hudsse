import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  // Set headers for SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control',
    'X-Accel-Buffering': 'no' // Disable nginx buffering
  })

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
  ]

  let messageIndex = 0

  const sendMessage = () => {
    if (messageIndex < messages.length) {
      const message = messages[messageIndex]
      const data = `data: ${JSON.stringify({ message })}\n\n`
      
      console.log(`Sending message ${messageIndex + 1}: ${message} at ${new Date().toISOString()}`)
      res.write(data)
      
      // Force immediate send
      if (typeof res.flush === 'function') {
        res.flush()
      }
      
      messageIndex++
      
      if (messageIndex < messages.length) {
        setTimeout(sendMessage, 250) // 0.25 seconds
      } else {
        console.log('Sending DONE signal')
        res.write('data: [DONE]\n\n')
        if (typeof res.flush === 'function') {
          res.flush()
        }
        res.end()
      }
    }
  }

  // Start sending messages
  sendMessage()

  // Handle client disconnect
  req.on('close', () => {
    res.end()
  })
}
