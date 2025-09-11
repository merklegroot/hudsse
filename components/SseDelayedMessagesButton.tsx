'use client'

import SseButton from './SseButton';

export default function SseDelayedMessagesButton() {
  return (<SseButton 
    creatEventSource={() => new EventSource('/api/sse/messages')} label="Sse Delayed Messages" />)
}
