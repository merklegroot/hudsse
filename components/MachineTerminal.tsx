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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setHasDragged(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;
    
    setHasDragged(true);
    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = ((window.innerWidth - e.clientX) / window.innerWidth) * 100;
    
    // Constrain width between 20% and 80%
    const constrainedWidth = Math.min(Math.max(newWidth, 20), 80);
    setWidth(constrainedWidth);
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    // Reset hasDragged after a short delay to allow click handler to check it
    setTimeout(() => setHasDragged(false), 10);
  }, []);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);

  const handleGripClick = useCallback((e: React.MouseEvent) => {
    // Only toggle if it's a simple click (not a drag)
    if (!isResizing && !hasDragged) {
      toggleCollapse();
    }
  }, [isResizing, hasDragged, toggleCollapse]);

  const handleButtonMouseDown = useCallback((e: React.MouseEvent) => {
    // Allow dragging from the button area
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setHasDragged(false);
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

  if (isCollapsed) {
    return (
      <div className="fixed top-[3rem] right-0 h-[calc(100vh-3rem)] z-40 flex">
        {/* Collapsed state - just the handle with arrow */}
        <div 
          className="w-6 bg-gray-700 hover:bg-gray-600 flex items-center justify-center border-l border-gray-600 cursor-pointer"
          onClick={handleGripClick}
          title="Expand terminal"
        >
          <svg 
            className="w-4 h-4 transform rotate-180 text-gray-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="fixed top-[3rem] right-0 h-[calc(100vh-3rem)] z-40 flex"
      style={{ width: `${width}%` }}
    >
      {/* Resize handle with collapse button */}
      <div 
        className="w-6 bg-gray-700 hover:bg-gray-600 flex flex-col border-l border-gray-600 flex-shrink-0 relative cursor-pointer"
        onClick={handleGripClick}
        title="Collapse terminal"
      >
        {/* Collapse button positioned in the middle vertically */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors p-1 z-10"
          onMouseDown={handleButtonMouseDown}
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        {/* Resize handle covers the full area */}
        <div
          className="w-full h-full bg-gray-600 hover:bg-gray-500 cursor-col-resize"
          onMouseDown={handleMouseDown}
        />
      </div>
      <div className="flex-1">
        <TerminalControl messages={messages} />
      </div>
    </div>
  );
}
