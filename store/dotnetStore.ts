import { create } from 'zustand';
import { SdkInfo, RuntimeInfo, AppVersions, DotNetInfoResult, DotNetHost, RuntimeEnvironment } from '../models/SseMessage';

interface DotNetState {
  dotnetSdks: SdkInfo[];
  dotnetRuntimes: RuntimeInfo[];
  appVersions: AppVersions;

  dotnetPath: string | null;
  runtimeEnvironment: RuntimeEnvironment;
  host: DotNetHost;
  workloadsInstalled: string;
  otherArchitectures: string[];
  environmentVariables: Record<string, string>;
  globalJsonFile: string;

  hasTriedDetectingSdks: boolean;
  hasTriedDetectingRuntimes: boolean;
}

interface DotNetStore {
  dotnetState: DotNetState | null;

  setDotnetSdks: (sdks: SdkInfo[]) => void;
  setDotnetRuntimes: (runtimes: RuntimeInfo[]) => void;
  setWhichDotNetPath: (path: string | null) => void;
  setDotnetInfo: (info: DotNetInfoResult | null) => void;
  setDotnetState: (state: DotNetState | null) => void;
  setHasTriedDetectingSdks: (hasTried: boolean) => void;
  setHasTriedDetectingRuntimes: (hasTried: boolean) => void;
}

const createInitialDotNetState = (): Pick<DotNetStore, 'dotnetState'> => ({
  dotnetState: null
});

const createAppVersions = (sdks: SdkInfo[], runtimes: RuntimeInfo[]): AppVersions => {
  const appVersions: AppVersions = {};

  // Add SDKs first
  const sdkVersions = sdks.map(sdk => sdk.version);
  if (sdkVersions.length > 0) {
    appVersions['SDK'] = sdkVersions;
  }

  // Add runtimes grouped by app name
  runtimes.forEach(runtime => {
    const appName = runtime.name; // e.g., "Microsoft.AspNetCore.App"
    if (!appVersions[appName]) {
      appVersions[appName] = [];
    }
    if (!appVersions[appName].includes(runtime.version)) {
      appVersions[appName].push(runtime.version);
    }
  });

  return appVersions;
};

const setDotnetSdksToState = (sdks: SdkInfo[]) => (state: DotNetStore) => ({
  dotnetState: state.dotnetState ? {
    ...state.dotnetState,
    dotnetSdks: sdks,
    hasTriedDetectingSdks: true
  } : null
});

const setDotnetRuntimesToState = (runtimes: RuntimeInfo[]) => (state: DotNetStore) => ({
  dotnetState: state.dotnetState ? {
    ...state.dotnetState,
    dotnetRuntimes: runtimes,
    appVersions: createAppVersions(state.dotnetState.dotnetSdks, runtimes),
    hasTriedDetectingRuntimes: true
  } : null
});

const setWhichDotNetPathToState = (path: string | null) => (state: DotNetStore) => {
  // Remove "dotnet" suffix from the path to show just the folder
  const extractDotnetPath = (fullPath: string): string => {
    // Remove "/dotnet" from the end of the path
    return fullPath.replace(/\/dotnet$/, '');
  };

  const sdks = state.dotnetState?.dotnetSdks || [];
  const runtimes = state.dotnetState?.dotnetRuntimes || [];

  return {
    dotnetState: {
      ...state.dotnetState,
      dotnetSdks: sdks,
      dotnetRuntimes: runtimes,
      appVersions: createAppVersions(sdks, runtimes),
      dotnetPath: path ? extractDotnetPath(path) : null,
      runtimeEnvironment: state.dotnetState?.runtimeEnvironment || {
        osName: '',
        osVersion: '',
        osPlatform: '',
        rid: '',
        basePath: ''
      },
      host: state.dotnetState?.host || {
        version: '',
        architecture: '',
        commit: ''
      },
      workloadsInstalled: state.dotnetState?.workloadsInstalled || '',
      otherArchitectures: state.dotnetState?.otherArchitectures || [],
      environmentVariables: state.dotnetState?.environmentVariables || {},
      globalJsonFile: state.dotnetState?.globalJsonFile || '',
      hasTriedDetectingSdks: state.dotnetState?.hasTriedDetectingSdks || false,
      hasTriedDetectingRuntimes: state.dotnetState?.hasTriedDetectingRuntimes || false
    }
  };
};

const setDotnetInfoToState = (info: DotNetInfoResult | null) => (state: DotNetStore) => {
  // Extract dotnetPath from basePath by removing the SDK version suffix
  const extractDotnetPath = (basePath: string): string => {
    // Remove pattern like "/sdk/9.0.304/" from the end
    const sdkPattern = /\/sdk\/[^\/]+\/?$/;
    return basePath.replace(sdkPattern, '');
  };

  const sdks =  (info?.installedSdks || []).map(sdk => ({ version: sdk.version, path: sdk.path }));
  const runtimes =  (info?.installedRuntimes || []).map(runtime => ({ name: runtime.name, version: runtime.version, path: runtime.path }));

  return {
    dotnetState: info ? {
      ...state.dotnetState,
      dotnetSdks: sdks,
      dotnetRuntimes: runtimes,
      appVersions: createAppVersions(sdks, runtimes),
      dotnetPath: extractDotnetPath(info?.runtimeEnvironment?.basePath || ''),
      runtimeEnvironment: info?.runtimeEnvironment,
      host: info?.host,
      workloadsInstalled: info?.workloadsInstalled || '',
      otherArchitectures: info?.otherArchitectures || [],
      environmentVariables: info?.environmentVariables || {},
      globalJsonFile: info?.globalJsonFile || '',
      hasTriedDetectingSdks: true,
      hasTriedDetectingRuntimes: true
    } : state.dotnetState
  };
};

const setDotnetStateToState = (state: DotNetState | null) => ({
  dotnetState: state
});

const setHasTriedDetectingSdksToState = (hasTried: boolean) => (state: DotNetStore) => ({
  dotnetState: state.dotnetState ? {
    ...state.dotnetState,
    hasTriedDetectingSdks: hasTried
  } : null
});

const setHasTriedDetectingRuntimesToState = (hasTried: boolean) => (state: DotNetStore) => ({
  dotnetState: state.dotnetState ? {
    ...state.dotnetState,
    hasTriedDetectingRuntimes: hasTried
  } : null
});

const createDotNetActions = (set: (fn: (state: DotNetStore) => Partial<DotNetStore>) => void) => ({
  setDotnetSdks: (sdks: SdkInfo[]) => set((state) => setDotnetSdksToState(sdks)(state)),
  setDotnetRuntimes: (runtimes: RuntimeInfo[]) => set((state) => setDotnetRuntimesToState(runtimes)(state)),
  setWhichDotNetPath: (path: string | null) => set((state) => setWhichDotNetPathToState(path)(state)),
  setDotnetInfo: (info: DotNetInfoResult | null) => set((state) => setDotnetInfoToState(info)(state)),
  setDotnetState: (state: DotNetState | null) => set(() => setDotnetStateToState(state)),
  setHasTriedDetectingSdks: (hasTried: boolean) => set((state) => setHasTriedDetectingSdksToState(hasTried)(state)),
  setHasTriedDetectingRuntimes: (hasTried: boolean) => set((state) => setHasTriedDetectingRuntimesToState(hasTried)(state))
});

export const useDotNetStore = create<DotNetStore>((set) => ({
  ...createInitialDotNetState(),
  ...createDotNetActions(set)
}));

export type { DotNetState };
