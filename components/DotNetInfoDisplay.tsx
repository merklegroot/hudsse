'use client';

import React from 'react';
import { useMessageStore } from '../store/messageStore';
import { DotNetInfoResult } from '../models/SseMessage';

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
        {value}
      </span>
    </div>
  );
}

function SdkItem({ sdk }: { sdk: { version: string; path: string } }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-sm font-medium text-gray-600">{sdk.version}</span>
      <span className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
        {sdk.path}
      </span>
    </div>
  );
}

function RuntimeItem({ runtime }: { runtime: { name: string; version: string; path: string } }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-sm font-medium text-gray-600">{runtime.name}</span>
      <div className="text-right">
        <div className="text-xs text-gray-500">{runtime.version}</div>
        <div className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
          {runtime.path}
        </div>
      </div>
    </div>
  );
}

export default function DotNetInfoDisplay() {
  const dotnetState = useMessageStore((state) => state.dotnetState);

  if (!dotnetState) {
    return (
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">.NET Information</h2>
          <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
            Not loaded
          </span>
        </div>
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-gray-400 text-lg mb-2">ℹ️</div>
          <p className="text-gray-500 text-lg">No .NET info loaded yet</p>
          <p className="text-gray-400 text-sm mt-1">Click "dotnet --info" to load information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">.NET Information</h2>
        <span className="bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full">
          Loaded
        </span>
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SDK Information */}
          <InfoCard title=".NET SDK">
            <InfoRow label="Version" value={dotnetState.host.version} />
            <InfoRow label="Commit" value={dotnetState.host.commit} />
            <InfoRow label="Workload Version" value="N/A" />
            <InfoRow label="MSBuild Version" value="N/A" />
          </InfoCard>

          {/* Runtime Environment */}
          <InfoCard title="Runtime Environment">
            <InfoRow label="OS Name" value={dotnetState.runtimeEnvironment.osName} />
            <InfoRow label="OS Version" value={dotnetState.runtimeEnvironment.osVersion} />
            <InfoRow label="OS Platform" value={dotnetState.runtimeEnvironment.osPlatform} />
            <InfoRow label="RID" value={dotnetState.runtimeEnvironment.rid} />
            <InfoRow label="Base Path" value={dotnetState.runtimeEnvironment.basePath} />
          </InfoCard>

          {/* Host Information */}
          <InfoCard title="Host">
            <InfoRow label="Version" value={dotnetState.host.version} />
            <InfoRow label="Architecture" value={dotnetState.host.architecture} />
            <InfoRow label="Commit" value={dotnetState.host.commit} />
          </InfoCard>

          {/* Workloads */}
          <InfoCard title="Workloads">
            <div className="text-sm text-gray-600">
              {dotnetState.workloadsInstalled}
            </div>
          </InfoCard>
        </div>

        {/* Other Information */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Other Architectures */}
          <InfoCard title="Other Architectures">
            {dotnetState.otherArchitectures.length === 0 ? (
              <div className="text-sm text-gray-500 italic">None</div>
            ) : (
              <div className="space-y-1">
                {dotnetState.otherArchitectures.map((arch, index) => (
                  <div key={index} className="text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded">
                    {arch}
                  </div>
                ))}
              </div>
            )}
          </InfoCard>

          {/* Environment Variables */}
          <InfoCard title="Environment Variables">
            {Object.keys(dotnetState.environmentVariables).length === 0 ? (
              <div className="text-sm text-gray-500 italic">None set</div>
            ) : (
              <div className="space-y-1">
                {Object.entries(dotnetState.environmentVariables).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-1">
                    <span className="text-sm font-medium text-gray-600">{key}</span>
                    <span className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </InfoCard>
        </div>

        {/* Global JSON */}
        <div className="mt-6">
          <InfoCard title="Global JSON">
            <div className="text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded">
              {dotnetState.globalJsonFile}
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
