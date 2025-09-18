'use client'

import SseButton from './SseButton';

export default function SseHostnameButton() {
  return (
    <SseButton 
      creatEventSource={() => new EventSource('/api/sse/machine/hostname')} 
      label="Get Hostname" />) 
}
