'use client'

import SseButton from './SseButton';

export default function SseDiskInfoButton() {
  return (
    <SseButton
      creatEventSource={() => new EventSource('/api/sse/disk/info')}
      label="Get Disk Info" />
  );
}
