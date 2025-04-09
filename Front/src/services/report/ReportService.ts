import * as T from "src/types/ReportTypes";
import { api } from "../common/Api";

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

export const selectA001 = async (uid: string) => {
    try {
      const response = await api.post<T.A001Data>("/report/selectA001", {
          uid
      });
      return response.data;
    } catch (error) {
      console.error("create Error:", error);
      throw error;
    }
  };

  
export const selectA002 = async (uid: string) => {
    try {
        const response = await api.post<T.A002Data>("/report/selectA002", {
            uid
        });
        return response.data;
    } catch (error) {
        console.error("create Error:", error);
        throw error;
    }
};
 
export const getPrompt = async () => {
    try {
        const response = await api.post("/report/getPrompt");
        return response.data;
    } catch (error) {
        console.error("create Error:", error);
        throw error;
    }
}    