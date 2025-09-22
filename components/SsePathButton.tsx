'use client'

import SseButton from './SseButton';

export default function SsePathButton() {
  return (
    <SseButton 
      creatEventSource={() => new EventSource('/api/sse/path')} 
      label="Get Path Information" 
    />
  );
}

