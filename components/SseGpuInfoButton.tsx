'use client'

import SseButton from './SseButton';

export default function SseGpuInfoButton() {
  return (
    <SseButton 
      creatEventSource={() => new EventSource('/api/sse/gpu/info')} 
      label="Get GPU Info" />) 
}
