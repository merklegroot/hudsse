import React from 'react';

interface CPUFeaturesDisplayProps {
  sse?: boolean | null;
  sse2?: boolean | null;
  sse3?: boolean | null;
  ssse3?: boolean | null;
  sse4_1?: boolean | null;
  sse4_2?: boolean | null;
  avx?: boolean | null;
  avx2?: boolean | null;
  avx512?: boolean | null;
  fma?: boolean | null;
  aes?: boolean | null;
  sha?: boolean | null;
  neon?: boolean | null;
}

function FeatureBadge({ supported, label }: { supported: boolean | null | undefined; label: string }) {
  if (supported === null || supported === undefined) {
    return null;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      supported 
        ? 'bg-green-100 text-green-800' 
        : 'bg-gray-100 text-gray-800'
    }`}>
      {supported ? '✓' : '✗'} {label}
    </span>
  );
}

export function CPUFeaturesDisplay({
  sse,
  sse2,
  sse3,
  ssse3,
  sse4_1,
  sse4_2,
  avx,
  avx2,
  avx512,
  fma,
  aes,
  sha,
  neon
}: CPUFeaturesDisplayProps) {
  const hasAnyFeatures = sse !== null || sse2 !== null || sse3 !== null || ssse3 !== null ||
    sse4_1 !== null || sse4_2 !== null || avx !== null || avx2 !== null ||
    avx512 !== null || fma !== null || aes !== null || sha !== null || neon !== null;

  if (!hasAnyFeatures) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Supported CPU Features</h2>
      
      {/* SSE Instructions */}
      {(sse !== null || sse2 !== null || sse3 !== null || ssse3 !== null || sse4_1 !== null || sse4_2 !== null) && (
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-3">SSE Instructions</h3>
          <div className="flex flex-wrap gap-2">
            <FeatureBadge supported={sse} label="SSE" />
            <FeatureBadge supported={sse2} label="SSE2" />
            <FeatureBadge supported={sse3} label="SSE3" />
            <FeatureBadge supported={ssse3} label="SSSE3" />
            <FeatureBadge supported={sse4_1} label="SSE4.1" />
            <FeatureBadge supported={sse4_2} label="SSE4.2" />
          </div>
        </div>
      )}

      {/* Advanced Vector Extensions */}
      {(avx !== null || avx2 !== null || avx512 !== null) && (
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-3">Advanced Vector Extensions</h3>
          <div className="flex flex-wrap gap-2">
            <FeatureBadge supported={avx} label="AVX" />
            <FeatureBadge supported={avx2} label="AVX2" />
            <FeatureBadge supported={avx512} label="AVX-512" />
          </div>
        </div>
      )}

      {/* Other Features */}
      {(fma !== null || aes !== null || sha !== null || neon !== null) && (
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-3">Other Features</h3>
          <div className="flex flex-wrap gap-2">
            <FeatureBadge supported={fma} label="FMA" />
            <FeatureBadge supported={aes} label="AES-NI" />
            <FeatureBadge supported={sha} label="SHA-NI" />
            <FeatureBadge supported={neon} label="NEON" />
          </div>
        </div>
      )}
    </div>
  );
}
