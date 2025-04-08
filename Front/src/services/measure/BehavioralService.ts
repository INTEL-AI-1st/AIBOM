import { api } from "@services/common/Api";

interface behaResponse {
    info:{
      abilityLabel: string;
      abilityLabelId: string;
      groupId: string;
      groupNum: string;
      info: string;
    }[];
}
  
export const selectAbilites = async (month: string) => {
    try {
      const response = await api.post<behaResponse>("/beha/selectAbilites", {
        month
      });
      return response.data;
    } catch (error) {
      console.error("create Error:", error);
      throw error;
    }
}

export const beha = (formData: FormData) => {
    fetch("/upload-video", {
      method: "POST",
      body: formData,
      // Content-Type은 브라우저가 자동으로 multipart/form-data로 설정함
      // keepalive: true,
    });
  };
  