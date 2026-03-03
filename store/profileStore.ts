import { create } from 'zustand';
import { ProfileInfo } from '../models/SseMessage';

interface ProfileState {
  profileInfo: ProfileInfo | null;
  isLoading: boolean;
  error: string | null;
}

interface ProfileStore {
  profileState: ProfileState | null;
  setProfileInfo: (info: ProfileInfo | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const createInitialProfileState = (): Pick<ProfileStore, 'profileState'> => ({
  profileState: null
});

const createCompleteProfileState = (existingState: ProfileState | null, updates: Partial<ProfileState>): ProfileState => ({
  profileInfo: existingState?.profileInfo || null,
  isLoading: existingState?.isLoading || false,
  error: existingState?.error || null,
  ...updates
});

const setProfileInfoToState = (info: ProfileInfo | null) => (state: ProfileStore) => ({
  profileState: info ? createCompleteProfileState(state.profileState, {
    profileInfo: info,
    isLoading: false,
    error: null
  }) : state.profileState
});

const setLoadingToState = (loading: boolean) => (state: ProfileStore) => ({
  profileState: state.profileState ? {
    ...state.profileState,
    isLoading: loading
  } : createCompleteProfileState(null, { isLoading: loading })
});

const setErrorToState = (error: string | null) => (state: ProfileStore) => ({
  profileState: state.profileState ? {
    ...state.profileState,
    error,
    isLoading: false
  } : createCompleteProfileState(null, { error, isLoading: false })
});

const createProfileActions = (set: (fn: (state: ProfileStore) => Partial<ProfileStore>) => void) => ({
  setProfileInfo: (info: ProfileInfo | null) => set((state) => setProfileInfoToState(info)(state)),
  setLoading: (loading: boolean) => set((state) => setLoadingToState(loading)(state)),
  setError: (error: string | null) => set((state) => setErrorToState(error)(state)),
});

export const useProfileStore = create<ProfileStore>((set) => ({
  ...createInitialProfileState(),
  ...createProfileActions(set)
}));

export type { ProfileState };
