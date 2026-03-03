'use client'

import SseButton from './SseButton';

export default function SseMemoryInfoButton() {
  return (
    <SseButton
      creatEventSource={() => new EventSource('/api/sse/memory/info')}
      label="Get Memory Info" />
  );
}
