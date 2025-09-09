'use client'

import { useMessageStore } from '../store/messageStore'
import { sseMessage } from '../models/sseMessage'

export default function MessageList() {
  const messages = useMessageStore((state) => state.messages)

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Messages:</h2>
      {messages.length === 0 ? (
        <p className="text-gray-500">No messages yet</p>
      ) : (
        <ul className="space-y-1">
          {messages.map((message: sseMessage, index) => (
            <li key={index} className="bg-gray-100 p-2 rounded">
              <div className="flex items-center gap-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {message.type}
                </span>
                <span>{message.contents}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
