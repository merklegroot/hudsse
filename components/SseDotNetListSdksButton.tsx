'use client'

import { useState } from 'react';
import { sseClientHandlerFactory } from '../workflows/sseClientHandlerFactory';
import { useMessageStore } from '@/store/messageStore';

export default function SseDotNetListSdksButton() {
  const [isLoading, setIsLoading] = useState(false);
  const addSseMessage = useMessageStore((state) => state.addSSEMessage);

  const onClick = () => {
    if (isLoading) return;

    setIsLoading(true);
    sseClientHandlerFactory(setIsLoading, () => new EventSource('/api/sse/dotnet/list-sdks'), addSseMessage);
  };

  return (<button
    onClick={onClick}
    disabled={isLoading}
    className={`font-bold py-2 px-4 rounded ${isLoading
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-green-500 hover:bg-green-700 text-white'
      }`}
  >
    {isLoading ? 'Loading SSE...' : 'Start SSE Stream'}
  </button>
  )
}
