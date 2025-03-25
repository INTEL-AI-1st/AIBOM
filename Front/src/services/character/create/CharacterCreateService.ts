import { api } from "@services/Api";

interface CharResponse {
  lst: {
    label: string;
    path: string;
    isRequired?: boolean;
  }
}

export const getLst = async (cls:string) => {
  try {
    const response = await api.post<CharResponse>("/character/create/getLst", {
      cls
    });
    return response.data;
  } catch (error) {
    console.error("Register Error:", error);
    throw error;
  }
};