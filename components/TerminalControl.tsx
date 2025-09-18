'use client'

import React from 'react';
import { SseMessage } from '../models/SseMessage'

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
    <div
      className="bg-black border border-gray-600 text-sm h-full flex flex-col p-4"
      style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", "Roboto Mono", Consolas, "Liberation Mono", "Courier New", monospace' }}>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">
        {messages.map((message: SseMessage, index) => (
          <MessageItem key={index} message={message} />
        ))}
      </div>
    </div>
  )
}

export default function TerminalControl({ messages }: { messages: SseMessage[] }) {
  const effectiveMessages: SseMessage[] = (messages || []).length > 0 ? messages : [
    { type: 'info', contents: 'No messages yet' } as SseMessage
  ];

  return (
    <div className="h-full">
      <SimpleMessageView messages={effectiveMessages} />
    </div>
  );
}
