'use client'

import { useSse } from '../contexts/SseContext';

export default function SseButton({creatEventSource, label}: {creatEventSource: () => EventSource, label: string }) {
  const { startSseStream, isLoading } = useSse();

  const onClick = () => {
    if (isLoading) return;

    startSseStream(creatEventSource);
  };

  return (<button
    onClick={onClick}
    disabled={isLoading}
    className={`font-bold py-2 px-4 rounded ${isLoading
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-green-500 hover:bg-green-700 text-white'
      }`}
  >
    {isLoading ? `processing...` : label}
  </button>
  )
}
