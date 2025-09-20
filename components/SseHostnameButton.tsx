'use client'

import SseButton from './SseButton';

export default function SseHostnameButton() {
  return (
    <SseButton 
      creatEventSource={() => new EventSource('/api/sse/machine/info')} 
      label="Get Machine Info (includes hostname)" />) 
}
