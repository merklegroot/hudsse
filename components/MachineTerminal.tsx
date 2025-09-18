'use client';

import { usePathname } from 'next/navigation';
import { useMessageStore } from '@/store/messageStore';
import TerminalControl from './TerminalControl';

export function MachineTerminal() {
  const pathname = usePathname();
  const messages = useMessageStore((state) => state.messages);

  // Only show terminal on machine page
  if (pathname !== '/machine') {
    return null;
  }

  return (
    <div className="fixed top-[3rem] right-0 w-1/2 h-[calc(100vh-3rem)] z-40">
      <TerminalControl messages={messages} />
    </div>
  );
}
