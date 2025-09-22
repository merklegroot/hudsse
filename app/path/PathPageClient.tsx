'use client';

import { usePathStore } from '../../store/pathStore';
import SsePathButton from '../../components/SsePathButton';
import { PathDisplay } from '../../components/path-display/PathDisplay';

export default function PathPageClient() {
  const { pathState } = usePathStore();

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-6 h-full">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Path Information</h1>
            <p className="text-gray-600">View and manage your system PATH environment variable</p>
          </div>

          <div className="mb-6">
            <SsePathButton />
          </div>

          <div className="flex-1">
            {pathState && (
              <PathDisplay pathState={pathState} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
