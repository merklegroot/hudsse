'use client'

import { ListSdksResult, SdkInfo, SseMessage } from '../models/SseMessage'

function SdkItem({ sdk }: { sdk: SdkInfo }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">.NET SDK</div>
            <div className="text-xs text-gray-500">Version {sdk.version}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
            {sdk.path}
          </div>
        </div>
      </div>
    </div>
  );
}

function SdkResult({ message }: { message: SseMessage }) {
  const parsed = JSON.parse(message.result || '') as ListSdksResult;
  const sdks = parsed.sdks || [];

  return (
    <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <h3 className="font-semibold text-gray-800 text-sm">SDK Results</h3>
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
          {sdks.length} found
        </span>
      </div>
      {sdks.length > 0 ? (
        <div className="space-y-2">
          {sdks.map((sdk, index) => (
            <SdkItem key={`${sdk.version}-${index}`} sdk={sdk} />
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 text-sm">
          No SDKs found
        </div>
      )}
    </div>
  );
}

function MessageItem({ message }: { message: SseMessage }) {
  return (
    <li className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
          message.type === 'stdout' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : message.type === 'result'
            ? 'bg-purple-100 text-purple-800 border border-purple-200'
            : 'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          {message.type.toUpperCase()}
        </span>
        <div className="flex-1">
          <div className="text-gray-800 text-sm font-medium mb-2">
            {message.contents}
          </div>
          {message.result && <SdkResult message={message} />}
        </div>
      </div>
    </li>
  );
}

export default function MessageList({ messages }: { messages: SseMessage[] }) {
  return (
    <div className="mt-6">
      <div>
        raw: {JSON.stringify(messages || [])}
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
        <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
          {messages.length} {messages.length === 1 ? 'message' : 'messages'}
        </span>
      </div>
      {messages.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-gray-400 text-lg mb-2">📭</div>
          <p className="text-gray-500 text-lg">No messages yet</p>
          <p className="text-gray-400 text-sm mt-1">Click a button above to get started</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {messages.map((message: SseMessage, index) => (
            <MessageItem key={index} message={message} />
          ))}
        </ul>
      )}
    </div>
  );
}
