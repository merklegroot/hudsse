'use client';

import { useMessageStore } from '@/store/messageStore';
import { useIsMobile } from '@/hooks/useIsMobile';
import TerminalControl from './TerminalControl';

export function MachineTerminal() {
  const messages = useMessageStore((state) => state.messages);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-1/3 z-40">
        <TerminalControl messages={messages} />
      </div>
    );
  }

  return (
    <div className="fixed top-[3rem] right-0 w-1/3 h-[calc(100vh-3rem)] z-40">
      <TerminalControl messages={messages} />
    </div>
  );
}
