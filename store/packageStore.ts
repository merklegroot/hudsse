import { create } from 'zustand';
import { PackageManagerResult, PackageRepositoryResult, PackageRepository } from '../models/SseMessage';
import { packageUtil } from '../utils/packageUtil';

interface PackageState {
  packageManager: string | null;
  packageFormats: string[];
  repositories: PackageRepository[];
  hasTriedDetectingPackageManager: boolean;
  hasTriedDetectingRepositories: boolean;
}

interface PackageStore {
  packageState: PackageState | null;
  setPackageManagerResult: (result: PackageManagerResult | null) => void;
  setPackageRepositoryResult: (result: PackageRepositoryResult | null) => void;
  setHasTriedDetectingPackageManager: (hasTried: boolean) => void;
  setHasTriedDetectingRepositories: (hasTried: boolean) => void;
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
    repositories: updates.repositories !== undefined ? updates.repositories : (existingState?.repositories || []),
    hasTriedDetectingPackageManager: updates.hasTriedDetectingPackageManager !== undefined 
      ? updates.hasTriedDetectingPackageManager 
      : (existingState?.hasTriedDetectingPackageManager || false),
    hasTriedDetectingRepositories: updates.hasTriedDetectingRepositories !== undefined 
      ? updates.hasTriedDetectingRepositories 
      : (existingState?.hasTriedDetectingRepositories || false)
  };
};

const setPackageManagerResultToState = (result: PackageManagerResult | null) => (state: PackageStore) => ({
  packageState: result ? createCompletePackageState(state.packageState, {
    packageManager: result.packageManager,
    hasTriedDetectingPackageManager: true
  }) : state.packageState
});

const setPackageRepositoryResultToState = (result: PackageRepositoryResult | null) => (state: PackageStore) => ({
  packageState: result ? createCompletePackageState(state.packageState, {
    repositories: result.repositories,
    hasTriedDetectingRepositories: true
  }) : state.packageState
});

const setHasTriedDetectingPackageManagerToState = (hasTried: boolean) => (state: PackageStore) => ({
  packageState: state.packageState ? {
    ...state.packageState,
    hasTriedDetectingPackageManager: hasTried
  } : null
});

const setHasTriedDetectingRepositoriesToState = (hasTried: boolean) => (state: PackageStore) => ({
  packageState: state.packageState ? {
    ...state.packageState,
    hasTriedDetectingRepositories: hasTried
  } : null
});

const createPackageActions = (set: (fn: (state: PackageStore) => Partial<PackageStore>) => void) => ({
  setPackageManagerResult: (result: PackageManagerResult | null) => set((state) => setPackageManagerResultToState(result)(state)),
  setPackageRepositoryResult: (result: PackageRepositoryResult | null) => set((state) => setPackageRepositoryResultToState(result)(state)),
  setHasTriedDetectingPackageManager: (hasTried: boolean) => set((state) => setHasTriedDetectingPackageManagerToState(hasTried)(state)),
  setHasTriedDetectingRepositories: (hasTried: boolean) => set((state) => setHasTriedDetectingRepositoriesToState(hasTried)(state)),
});

export const usePackageStore = create<PackageStore>((set) => ({
  ...createInitialPackageState(),
  ...createPackageActions(set)
}));

export type { PackageState };
