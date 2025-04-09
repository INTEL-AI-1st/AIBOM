import { BehavioralState } from '../types/behavioral.types';
import {
  FETCH_ABILITIES_REQUEST,
  FETCH_ABILITIES_SUCCESS,
  FETCH_ABILITIES_FAILURE,
  SET_SELECTED_ABILITY,
  SET_PREVIEW_URL,
  SET_IS_RECORDING,
  SET_REMAINING_TIME,
  RESET_PREVIEW,
  BehavioralActionTypes,
  SET_ABILITY_MEASURED
} from '../actions/behavioral.actions';
import { AnyAction } from 'redux';

const initialState: BehavioralState = {
  abilities: [],
  selectedAbility: null,
  previewUrl: null,
  isLoading: false,
  isRecording: false,
  remainingTime: 15
};

export const behavioralReducer = (
  state = initialState,
  action: BehavioralActionTypes | AnyAction
): BehavioralState => {
  switch (action.type) {
    case FETCH_ABILITIES_REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case FETCH_ABILITIES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        abilities: action.payload,
        selectedAbility: action.payload.length > 0 ? action.payload[0] : null
      };
    case FETCH_ABILITIES_FAILURE:
      return {
        ...state,
        isLoading: false
      };
    case SET_SELECTED_ABILITY:
      return {
        ...state,
        selectedAbility: action.payload
      };
    case SET_PREVIEW_URL:
      return {
        ...state,
        previewUrl: action.payload
      };
    case SET_IS_RECORDING:
      return {
        ...state,
        isRecording: action.payload
      };
    case SET_REMAINING_TIME:
      return {
        ...state,
        remainingTime: action.payload
      };
    case RESET_PREVIEW:
      return {
        ...state,
        previewUrl: null,
        selectedAbility: action.payload.preserveAbility ? state.selectedAbility : null,
      };
    case SET_ABILITY_MEASURED:
        return {
        ...state,
        abilities: state.abilities.map((ability) =>
            ability.abilityLabelId === action.payload
            ? { ...ability, isMeas: true }
            : ability
        ),
    };
    default:
      return state;
  }
};
