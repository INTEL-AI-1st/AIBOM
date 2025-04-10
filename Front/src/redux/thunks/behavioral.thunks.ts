import { Dispatch } from 'redux';
import { selectAbilites, beha } from '@services/measure/BehavioralService';
import {
  fetchAbilitiesRequest,
  fetchAbilitiesSuccess,
  fetchAbilitiesFailure,
  setAbilityMeasured
} from '../actions/behavioral.actions';

export const fetchAbilities = (uid: string, ageMonths: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAbilitiesRequest());
    try {
      const data = await selectAbilites(uid, ageMonths);
      if (data.info && Array.isArray(data.info)) {
        dispatch(fetchAbilitiesSuccess(data.info));
      } else {
        dispatch(fetchAbilitiesFailure('Invalid data format'));
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      dispatch(fetchAbilitiesFailure('Failed to fetch abilities'));
    }
  };
};

export const sendBehavioralData = (formData: FormData) => {
    return async (dispatch: Dispatch) => {
      try {
        const abilityLabelId = formData.get('abilityLabelId');
        if (typeof abilityLabelId === 'string') {
            dispatch(setAbilityMeasured(abilityLabelId));
        }
          
        const response = await beha(formData);
        
        return response;
      } catch (error) {
        console.error('측정 실패:', error);
        throw error;
      }
    };
  };