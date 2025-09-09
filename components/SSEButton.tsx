import { useMessageStore } from '../store/messageStore'
import { useState } from 'react'

export default function SSEButton() {
  const addSSEMessage = useMessageStore((state) => state.addSSEMessage)
  const [isLoading, setIsLoading] = useState(false)

  const handleSSEClick = () => {
    if (isLoading) return

    setIsLoading(true)
    
    const eventSource = new EventSource('/api/sse')
    
    eventSource.onmessage = (event) => {
      console.log('Received SSE message:', event.data, 'at', new Date().toISOString())
      
      if (event.data === '[DONE]') {
        eventSource.close()
        setIsLoading(false)
        return
      }
      
      try {
        const data = JSON.parse(event.data)
        addSSEMessage(data.message)
      } catch (error) {
        console.error('Error parsing SSE data:', error)
      }
    }
    
    eventSource.onerror = (error) => {
      console.error('SSE error:', error)
      eventSource.close()
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSSEClick}
      disabled={isLoading}
      className={`font-bold py-2 px-4 rounded ${
        isLoading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-green-500 hover:bg-green-700 text-white'
      }`}
    >
      {isLoading ? 'Loading SSE...' : 'Start SSE Stream'}
    </button>
  )
}
