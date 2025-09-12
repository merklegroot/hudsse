'use client'

import SseButton from './SseButton';

export default function SseDotNetInfoButton() {
  return (
    <SseButton 
      creatEventSource={() => new EventSource('/api/sse/dotnet/info')} 
      label="dotnet --info" />) 
}
