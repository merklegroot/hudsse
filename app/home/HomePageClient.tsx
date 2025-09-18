'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import { HomeControl } from './HomeControl';

export function HomePageClient() {
  const isMobile = useIsMobile();

  return (
    <div className={`h-screen flex flex-col ${isMobile ? 'pb-[33.333333%]' : 'pr-[50%]'}`}>
      <div className="flex-none p-6">
        <h1 className="text-3xl font-bold text-gray-900">Home</h1>
        <p className="text-gray-600 mt-2">Welcome to the Home page!</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <HomeControl />
        </div>
      </div>
    </div>
  );
}
