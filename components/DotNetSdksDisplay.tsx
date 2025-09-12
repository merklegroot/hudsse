'use client';

import React from 'react';
import { useMessageStore } from '../store/messageStore';
import { SdkInfo } from '../models/SseMessage';

function SdkItem({ sdk }: { sdk: SdkInfo }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">.NET SDK</div>
            <div className="text-xs text-gray-500">Version {sdk.version}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
            {sdk.path}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DotNetSdksDisplay() {
  const dotnetSdks = useMessageStore((state) => state.dotnetSdks);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">.NET SDKs</h2>
        <span className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full">
          {dotnetSdks.length} {dotnetSdks.length === 1 ? 'SDK' : 'SDKs'}
        </span>
      </div>
      {dotnetSdks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-gray-400 text-lg mb-2">📦</div>
          <p className="text-gray-500 text-lg">No SDKs in store yet</p>
          <p className="text-gray-400 text-sm mt-1">Click "dotnet --list-sdks" to load SDKs</p>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="space-y-2">
            {dotnetSdks.map((sdk, index) => (
              <SdkItem key={`${sdk.version}-${index}`} sdk={sdk} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
