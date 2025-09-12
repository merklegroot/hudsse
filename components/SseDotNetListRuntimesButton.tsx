'use client'

import SseButton from './SseButton';

export default function SseDotNetListRuntimesButton() {
  return (
    <SseButton 
      creatEventSource={() => new EventSource('/api/sse/dotnet/list-runtimes')} 
      label="dotnet --list-runtimes" />) 
}
