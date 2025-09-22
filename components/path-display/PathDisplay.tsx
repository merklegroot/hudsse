'use client';

import { PathState } from '../../store/pathStore';
import { PathFolderList } from './PathFolderList';

interface PathDisplayProps {
  pathState: PathState;
}

export function PathDisplay({ pathState }: PathDisplayProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-white rounded-lg shadow-md p-6 flex-1 flex flex-col">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Path Folders ({pathState.folders.length})</h2>
        <div className="flex-1 overflow-y-auto">
          <PathFolderList folders={pathState.folders} />
        </div>
      </div>
    </div>
  );
}

