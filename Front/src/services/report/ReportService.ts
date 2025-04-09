import * as T from "src/types/ReportTypes";
import { api } from "../common/Api";
import * as RT from 'src/types/ReportTypes';

export type PromptPayload = {
  context?: {
    profile?: RT.ChildProfile;
    a001?: RT.A001Item;
    a002?: RT.A002Data;
  };
};

export const selectProfile = async (uid: string) => {
  try {
    const response = await api.post<T.ChildProfile>("/report/selectProfile", {
        uid
    });
    return response.data;
  } catch (error) {
    console.error("create Error:", error);
    throw error;
  }
};

export const selectA001 = async (uid: string, month: string) => {
    try {
      const response = await api.post<T.A001Item>("/report/selectA001", {
          uid,
          month
      });
      return response.data;
    } catch (error) {
      console.error("create Error:", error);
      throw error;
    }
  };

  
export const selectA002 = async (uid: string, age: string) => {
    try {
        const response = await api.post<T.A002Data>("/report/selectA002", {
            uid,
            age
        });
        return response.data;
    } catch (error) {
        console.error("create Error:", error);
        throw error;
    }
};
 
export const getPrompt = async (payload: PromptPayload) => {
    try {
        const response = await api.post("/report/getPrompt", {
          payload
        });
        return response.data;
    } catch (error) {
        console.error("create Error:", error);
        throw error;
    }
}    