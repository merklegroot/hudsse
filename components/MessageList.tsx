'use client'

import React from 'react';
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

function MessageItem({ message }: { message: SseMessage }) {
  const getPromptSymbol = (type: string) => {
    switch (type) {
      case 'command': return '$';
      case 'result': return '>';
      default: return '·';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'command': return 'text-green-400';
      case 'result': return 'text-cyan-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="font-mono text-sm">
      <div className="flex items-start">
        {message.type !== 'stdout' ? (
          <span className={`${getTypeColor(message.type)} mr-2 select-none`}>
            {getPromptSymbol(message.type)}
          </span>
        ) : (
          <span className="mr-2 select-none text-transparent">$</span>
        )}
        <div className="flex-1 text-gray-300 whitespace-pre-wrap break-words">
          {message.contents}
        </div>
      </div>
    </div>
  );
}

function SimpleMessageView({ messages }: { messages: SseMessage[] }) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isUserScrolled, setIsUserScrolled] = React.useState(false);

  React.useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px tolerance
      setIsUserScrolled(!isAtBottom);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    if (!isUserScrolled && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isUserScrolled]);

  return (
    <div className="bg-black border border-gray-600 rounded-lg p-4 text-sm h-96 flex flex-col" style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", "Roboto Mono", Consolas, "Liberation Mono", "Courier New", monospace' }}>
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600"
      >
        {messages.map((message: SseMessage, index) => (
          <MessageItem key={index} message={message} />
        ))}
      </div>
    </div>
  )
}

export default function MessageList({ messages }: { messages: SseMessage[] }) {
  return (
    <div className="mt-6">
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
        <div>
          <SimpleMessageView messages={messages} />
        </div>
      )}
    </div>
  );
}
