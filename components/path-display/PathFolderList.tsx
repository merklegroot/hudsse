'use client';

interface PathFolderListProps {
  folders: string[];
}

export function PathFolderList({ folders }: PathFolderListProps) {
  if (folders.length === 0) {
    return (
      <div className="text-gray-500 italic">
        No path folders found
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {folders.map((folder, index) => (
        <div 
          key={index}
          className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-blue-600 font-semibold text-sm">
              {index + 1}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <code className="text-sm text-gray-800 font-mono break-all">
              {folder}
            </code>
          </div>
        </div>
      ))}
    </div>
  );
}

