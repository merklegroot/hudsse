import { create } from 'zustand';
import { PathResult } from '../models/SseMessage';

interface PathState {
  path: string | null;
  folders: string[];
  hasTriedDetectingPath: boolean;
}

interface PathStore {
  pathState: PathState | null;

  setPath: (path: string | null) => void;
  setFolders: (folders: string[]) => void;
  setPathResult: (result: PathResult | null) => void;
  setPathState: (state: PathState | null) => void;
  setHasTriedDetectingPath: (hasTried: boolean) => void;
}

const createInitialPathState = (): Pick<PathStore, 'pathState'> => ({
  pathState: null
});

const setPathToState = (path: string | null) => (state: PathStore) => ({
  pathState: state.pathState ? {
    ...state.pathState,
    path: path
  } : null
});

const setFoldersToState = (folders: string[]) => (state: PathStore) => ({
  pathState: state.pathState ? {
    ...state.pathState,
    folders: folders
  } : null
});

const setPathResultToState = (result: PathResult | null) => (state: PathStore) => ({
  pathState: result ? {
    path: result.path,
    folders: result.folders,
    hasTriedDetectingPath: true
  } : state.pathState
});

const setPathStateToState = (state: PathState | null) => ({
  pathState: state
});

const setHasTriedDetectingPathToState = (hasTried: boolean) => (state: PathStore) => ({
  pathState: state.pathState ? {
    ...state.pathState,
    hasTriedDetectingPath: hasTried
  } : null
});

const createPathActions = (set: (fn: (state: PathStore) => Partial<PathStore>) => void) => ({
  setPath: (path: string | null) => set((state) => setPathToState(path)(state)),
  setFolders: (folders: string[]) => set((state) => setFoldersToState(folders)(state)),
  setPathResult: (result: PathResult | null) => set((state) => setPathResultToState(result)(state)),
  setPathState: (state: PathState | null) => set(() => setPathStateToState(state)),
  setHasTriedDetectingPath: (hasTried: boolean) => set((state) => setHasTriedDetectingPathToState(hasTried)(state))
});

export const usePathStore = create<PathStore>((set) => ({
  ...createInitialPathState(),
  ...createPathActions(set)
}));

export type { PathState };

