'use client'

import { listSdksResult, sdkInfo, sseMessage } from '../models/sseMessage'

function SdkItem({ sdk }: { sdk: sdkInfo }) {
  return (
    <div>Version: {sdk.version} Path: {sdk.path}</div>
  );
}

function SdkResult({ message }: { message: sseMessage }) {
  const parsed = JSON.parse(message.result || '') as listSdksResult;

  return (
    <div>{(parsed.sdks || []).map(sdk => <SdkItem key={sdk.version} sdk={sdk} />)}</div>
  );
}

function MessageItem({ message }: { message: sseMessage }) {
  return (
    <li className="bg-gray-100 p-2 rounded">
      <div className="flex items-center gap-2">
        <span className={`text-xs px-2 py-1 rounded ${message.type === 'stdout' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{message.type}</span>
        <span>{message.contents}</span>

      </div>
      {message.result &&
        <div className="flex items-center gap-2">
          <SdkResult message={message} />
        </div>}
    </li>
  )
}

export default function MessageList({ messages }: { messages: sseMessage[] }) {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Messages:</h2>
      {messages.length === 0 ? (
        <p className="text-gray-500">No messages yet</p>
      ) : (
        <ul className="space-y-1">
          {messages.map((message: sseMessage, index) => (
            <MessageItem key={index} message={message} />
          ))}
        </ul>
      )}
    </div>
  )
}
