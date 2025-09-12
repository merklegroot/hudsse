'use client'

import SseButton from './SseButton';

export default function SseWhichDotNetButton() {
  return (
    <SseButton 
      creatEventSource={() => new EventSource('/api/sse/dotnet/which')} 
      label="which dotnet" />) 
}
