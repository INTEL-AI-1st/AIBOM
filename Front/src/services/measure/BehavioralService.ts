import { api } from "@services/common/Api";

interface ObserResponse {
    info: {
        abilityLabelId: string;
        questId: string;
        score: string;
    }
}
  
export const beha = async (formData: FormData) => {
    try {
        const response = await api.post<ObserResponse>("/beha/measure", formData, {
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
