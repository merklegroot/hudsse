'use client';

import React from 'react';
import { useDotNetStore } from '../../store/dotnetStore';
import { RuntimeInfo } from '../../models/SseMessage';

function RuntimeItem({ runtime }: { runtime: RuntimeInfo }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">{runtime.name}</div>
            <div className="text-xs text-gray-500">Version {runtime.version}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
            {runtime.path}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DotNetRuntimesDisplay() {
  const dotnetRuntimes = useDotNetStore((state) => state.dotnetState?.dotnetRuntimes) || [];

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">.NET Runtimes</h2>
        <span className="bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full">
          {dotnetRuntimes.length} {dotnetRuntimes.length === 1 ? 'Runtime' : 'Runtimes'}
        </span>
      </div>
      {dotnetRuntimes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-gray-400 text-lg mb-2">⚙️</div>
          <p className="text-gray-500 text-lg">No runtimes in store yet</p>
          <p className="text-gray-400 text-sm mt-1">Click "dotnet --list-runtimes" to load runtimes</p>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
          <div className="space-y-2">
            {dotnetRuntimes.map((runtime, index) => (
              <RuntimeItem key={`${runtime.name}-${runtime.version}-${index}`} runtime={runtime} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
