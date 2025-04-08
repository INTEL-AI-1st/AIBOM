import { Dispatch } from 'redux';
import { selectAbilites, beha } from '@services/measure/BehavioralService';
import {
  fetchAbilitiesRequest,
  fetchAbilitiesSuccess,
  fetchAbilitiesFailure
} from '../actions/behavioral.actions';

export const fetchAbilities = (ageMonths: number) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAbilitiesRequest());
    try {
      const data = await selectAbilites(ageMonths);
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
  return async () => {
    try {
      const response = await beha(formData);
      console.log('분석 결과:', response);
      alert('측정이 완료되었습니다.');
      return response;
    } catch (error) {
      console.error('측정 실패:', error);
      alert('측정(예측) 실행에 실패했습니다.');
      throw error;
    }
  };
};