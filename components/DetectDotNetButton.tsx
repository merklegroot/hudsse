'use client'

import SseButton from './SseButton';

export default function DetectDotNetButton() {
  return (
    <SseButton 
      creatEventSource={() => new EventSource('/api/sse/dotnet/detect')} 
      label="Detect .NET" />) 
}
