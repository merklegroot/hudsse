import { create } from 'zustand';
import { PackageManagerResult } from '../models/SseMessage';
import { packageUtil } from '../utils/packageUtil';

interface PackageState {
  packageManager: string | null;
  packageFormats: string[];
  hasTriedDetectingPackageManager: boolean;
}

interface PackageStore {
  packageState: PackageState | null;
  setPackageManagerResult: (result: PackageManagerResult | null) => void;
  setHasTriedDetectingPackageManager: (hasTried: boolean) => void;
}

const createInitialPackageState = (): Pick<PackageStore, 'packageState'> => ({
  packageState: null
});

const createCompletePackageState = (existingState: PackageState | null, updates: Partial<PackageState>): PackageState => {
  const packageManager = updates.packageManager !== undefined ? updates.packageManager : (existingState?.packageManager || null);
  const packageFormats = packageUtil.parsePackageFormats(packageManager);
  
  return {
    packageManager: packageManager,
    packageFormats: packageFormats,
    hasTriedDetectingPackageManager: updates.hasTriedDetectingPackageManager !== undefined 
      ? updates.hasTriedDetectingPackageManager 
      : (existingState?.hasTriedDetectingPackageManager || false)
  };
};

const setPackageManagerResultToState = (result: PackageManagerResult | null) => (state: PackageStore) => ({
  packageState: result ? createCompletePackageState(state.packageState, {
    packageManager: result.packageManager,
    hasTriedDetectingPackageManager: true
  }) : state.packageState
});

const setHasTriedDetectingPackageManagerToState = (hasTried: boolean) => (state: PackageStore) => ({
  packageState: state.packageState ? {
    ...state.packageState,
    hasTriedDetectingPackageManager: hasTried
  } : null
});

const createPackageActions = (set: (fn: (state: PackageStore) => Partial<PackageStore>) => void) => ({
  setPackageManagerResult: (result: PackageManagerResult | null) => set((state) => setPackageManagerResultToState(result)(state)),
  setHasTriedDetectingPackageManager: (hasTried: boolean) => set((state) => setHasTriedDetectingPackageManagerToState(hasTried)(state)),
});

export const usePackageStore = create<PackageStore>((set) => ({
  ...createInitialPackageState(),
  ...createPackageActions(set)
}));

export type { PackageState };
