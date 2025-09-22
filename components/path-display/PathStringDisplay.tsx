'use client';

interface PathStringDisplayProps {
  path: string;
}

export function PathStringDisplay({ path }: PathStringDisplayProps) {
  return (
    <div className="bg-gray-50 rounded-md p-4">
      <code className="text-sm text-gray-800 break-all font-mono">
        {path}
      </code>
    </div>
  );
}

