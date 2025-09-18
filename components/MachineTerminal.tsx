'use client';

import { useMessageStore } from '@/store/messageStore';
import { useIsMobile } from '@/hooks/useIsMobile';
import TerminalControl from './TerminalControl';
import React, { useState, useRef, useCallback } from 'react';

export function MachineTerminal() {
  const messages = useMessageStore((state) => state.messages);
  const isMobile = useIsMobile();
  const [width, setWidth] = useState(33); // percentage
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = ((window.innerWidth - e.clientX) / window.innerWidth) * 100;
    
    // Constrain width between 20% and 80%
    const constrainedWidth = Math.min(Math.max(newWidth, 20), 80);
    setWidth(constrainedWidth);
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Add global mouse event listeners when resizing
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-1/3 z-40">
        <TerminalControl messages={messages} />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="fixed top-[3rem] right-0 h-[calc(100vh-3rem)] z-40 flex"
      style={{ width: `${width}%` }}
    >
      {/* Resize handle */}
      <div
        className="w-1 bg-gray-600 hover:bg-gray-500 cursor-col-resize flex-shrink-0"
        onMouseDown={handleMouseDown}
      />
      <div className="flex-1">
        <TerminalControl messages={messages} />
      </div>
    </div>
  );
}
