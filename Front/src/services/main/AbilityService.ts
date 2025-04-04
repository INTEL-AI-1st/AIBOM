import { api } from "../common/Api";

interface AbilityResponse {
    info: {
      ai: string;
      api_key: string;
      checked: number;
    }
}

export const selectGraph = async (uid: string, age: string) => {
  try {
    const response = await api.post<AbilityResponse>("/ability/selectGraph", {
        uid, 
        age
    });
    return response.data;
  } catch (error) {
    console.error("create Error:", error);
    throw error;
  }
};