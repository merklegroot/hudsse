'use client'

import SseButton from './SseButton';

export default function SseStepCounterButton() {
  return (
    <SseButton 
      creatEventSource={() => new EventSource('/api/sse/step-counter')} 
      label="Run Step Counter" 
    />
  );
}
