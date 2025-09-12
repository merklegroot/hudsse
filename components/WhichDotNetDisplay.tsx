'use client';

import React from 'react';
import { useMessageStore } from '../store/messageStore';

export default function WhichDotNetDisplay() {
  const whichDotNetPath = useMessageStore((state) => state.whichDotNetPath);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">.NET Location</h2>
        <span className={`text-sm px-3 py-1 rounded-full ${
          whichDotNetPath 
            ? 'bg-green-100 text-green-600' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {whichDotNetPath ? 'Found' : 'Not detected'}
        </span>
      </div>
      {!whichDotNetPath ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-gray-400 text-lg mb-2">🔍</div>
          <p className="text-gray-500 text-lg">No .NET path detected yet</p>
          <p className="text-gray-400 text-sm mt-1">Click "which dotnet" to find .NET location</p>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-sm mb-1">.NET Executable Path</div>
                <div className="text-xs text-gray-500 font-mono bg-gray-50 px-3 py-2 rounded border">
                  {whichDotNetPath}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
