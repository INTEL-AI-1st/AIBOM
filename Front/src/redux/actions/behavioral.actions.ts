import { Behavioral } from '../types/behavioral.types';

export const FETCH_ABILITIES_REQUEST = 'FETCH_ABILITIES_REQUEST';
export const FETCH_ABILITIES_SUCCESS = 'FETCH_ABILITIES_SUCCESS';
export const FETCH_ABILITIES_FAILURE = 'FETCH_ABILITIES_FAILURE';
export const SET_SELECTED_ABILITY = 'SET_SELECTED_ABILITY';
export const SET_PREVIEW_URL = 'SET_PREVIEW_URL';
export const SET_IS_RECORDING = 'SET_IS_RECORDING';
export const SET_REMAINING_TIME = 'SET_REMAINING_TIME';
export const RESET_PREVIEW = 'RESET_PREVIEW';

export const fetchAbilitiesRequest = () => ({
  type: FETCH_ABILITIES_REQUEST as typeof FETCH_ABILITIES_REQUEST
});

export const fetchAbilitiesSuccess = (abilities: Behavioral[]) => ({
  type: FETCH_ABILITIES_SUCCESS as typeof FETCH_ABILITIES_SUCCESS,
  payload: abilities
});

export const fetchAbilitiesFailure = (error: string) => ({
  type: FETCH_ABILITIES_FAILURE as typeof FETCH_ABILITIES_FAILURE,
  payload: error
});

export const setSelectedAbility = (ability: Behavioral) => ({
  type: SET_SELECTED_ABILITY as typeof SET_SELECTED_ABILITY,
  payload: ability
});

export const setPreviewUrl = (url: string | null) => ({
  type: SET_PREVIEW_URL as typeof SET_PREVIEW_URL,
  payload: url
});

export const setIsRecording = (isRecording: boolean) => ({
  type: SET_IS_RECORDING as typeof SET_IS_RECORDING,
  payload: isRecording
});

export const setRemainingTime = (time: number) => ({
  type: SET_REMAINING_TIME as typeof SET_REMAINING_TIME,
  payload: time
});

export const resetPreview = () => ({
  type: RESET_PREVIEW as typeof RESET_PREVIEW
});

export type BehavioralActionTypes = 
  | ReturnType<typeof fetchAbilitiesRequest>
  | ReturnType<typeof fetchAbilitiesSuccess>
  | ReturnType<typeof fetchAbilitiesFailure>
  | ReturnType<typeof setSelectedAbility>
  | ReturnType<typeof setPreviewUrl>
  | ReturnType<typeof setIsRecording>
  | ReturnType<typeof setRemainingTime>
  | ReturnType<typeof resetPreview>;