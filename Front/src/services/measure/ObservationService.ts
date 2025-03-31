import { api } from "@services/common/Api";

interface ObserResponse {
    info: {
        abilityLabelId: string;
        questId: string;
        score: string;
    }
}

interface MsgResponse {
    info:{
        state: string;
        msg: string;
    }[];
}
  
export const selectObservation = async (uid: string) => {
    try {
      const response = await api.post<ObserResponse>("/obser/SelectObservation", {
        uid
      });
      return response.data;
    } catch (error) {
      console.error("create Error:", error);
      throw error;
    }
}

export const upsertObservation = async (uid: string, abilityLabelId: string, questId: string, score: number) => {
    try {
      const response = await api.post<ObserResponse>("/obser/upsertObservation", {
        uid,
        abilityLabelId,
        questId,
        score
      });
      return response.data;
    } catch (error) {
      console.error("create Error:", error);
      throw error;
    }
}

export const saveObservation = async (uid: string) => {
    try {
      const response = await api.post<MsgResponse>("/obser/saveObservation", {
        uid
      });
      return response.data;
    } catch (error) {
      console.error("create Error:", error);
      throw error;
    }
  }