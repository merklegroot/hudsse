'use client';

import { PathState } from '../../store/pathStore';
import { PathFolderList } from './PathFolderList';
import { PathStringDisplay } from './PathStringDisplay';

interface PathDisplayProps {
  pathState: PathState;
}

export function PathDisplay({ pathState }: PathDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">PATH Environment Variable</h2>
        <PathStringDisplay path={pathState.path || ''} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Path Folders ({pathState.folders.length})</h2>
        <PathFolderList folders={pathState.folders} />
      </div>
    </div>
  );
}

