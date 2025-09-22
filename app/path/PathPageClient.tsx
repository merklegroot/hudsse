'use client';

import { usePathStore } from '../../store/pathStore';
import SsePathButton from '../../components/SsePathButton';
import { PathDisplay } from '../../components/path-display/PathDisplay';

export default function PathPageClient() {
  const { pathState } = usePathStore();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Path Information</h1>
        <p className="text-gray-600">View and manage your system PATH environment variable</p>
      </div>

      <div className="mb-6">
        <SsePathButton />
      </div>

      {pathState && (
        <PathDisplay pathState={pathState} />
      )}
    </div>
  );
}
