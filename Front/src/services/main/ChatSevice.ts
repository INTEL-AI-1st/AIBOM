import { api } from "../common/Api";

interface ChatResponse {
    text: string;
}

export const getMsg = async (msg: string) => {
  try {
    const response = await api.post<ChatResponse>("/chat/getMsg", {
        msg
    });
    return response.data;
  } catch (error) {
    console.error("create Error:", error);
    throw error;
  }
};