'use client';

import { useMessageStore } from '@/store/messageStore';
import TerminalControl from './TerminalControl';

export function MachineTerminal() {
  const messages = useMessageStore((state) => state.messages);

  return (
    <div className="fixed top-[3rem] right-0 w-1/2 h-[calc(100vh-3rem)] z-40">
      <TerminalControl messages={messages} />
    </div>
  );
}
