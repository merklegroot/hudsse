'use client'

import SseButton from './SseButton';

export default function SseMachineInfoButton() {
  return (
    <SseButton 
      creatEventSource={() => new EventSource('/api/sse/machine/info')} 
      label="Get Machine Info" />) 
}
