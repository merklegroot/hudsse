'use client'

import SseButton from './SseButton';

export default function SseCpuInfoButton() {
  return (
    <SseButton 
      creatEventSource={() => new EventSource('/api/sse/cpu/info')} 
      label="Get CPU Info" />) 
}
