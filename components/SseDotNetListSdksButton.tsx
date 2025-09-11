'use client'

import SseButton from './SseButton';

export default function SseDotNetListSdksButton() {
  return (
    <SseButton 
      creatEventSource={() => new EventSource('/api/sse/dotnet/list-sdks')} 
      label="dotnet --list-sdks" />) 
}
