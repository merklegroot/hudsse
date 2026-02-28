'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import { DotNetControl } from './DotNetControl';

export function DotNetPageClient() {
  const isMobile = useIsMobile();

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-6 h-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">.NET</h1>
          <DotNetControl />
        </div>
      </div>
    </div>
  );
}
