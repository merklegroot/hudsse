import { useMessageStore } from '../store/messageStore'

export default function MessageList() {
  const messages = useMessageStore((state) => state.messages)

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Messages:</h2>
      {messages.length === 0 ? (
        <p className="text-gray-500">No messages yet</p>
      ) : (
        <ul className="space-y-1">
          {messages.map((message, index) => (
            <li key={index} className="bg-gray-100 p-2 rounded">
              {message}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
