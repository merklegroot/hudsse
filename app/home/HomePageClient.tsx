'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import { HomeControl } from './HomeControl';

export function HomePageClient() {
  const isMobile = useIsMobile();

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-6 h-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Home</h1>
          <p className="text-gray-600 mb-6">Welcome to the Home page!</p>
          <HomeControl />
        </div>
      </div>
    </div>
  );
}
