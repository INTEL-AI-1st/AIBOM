import { api } from "@services/common/Ai";

interface ObserResponse {
    info: {
        abilityLabelId: string;
        questId: string;
        score: string;
    }
}
  
export const beha = async (formData: FormData) => {
    try {
        const response = await api.post<ObserResponse>("/", formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        
        return response.data;
    } catch (error) {
        console.error("create Error:", error);
        throw error;
    }
}
