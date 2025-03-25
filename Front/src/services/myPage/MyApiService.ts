import { api } from "../Api";
import { checkClaudeKey } from "../Claude";
import { checkGeminiKey } from "../Gemini";
import { checkOpenAiKey } from "../OpenAi";

interface ApiResponse {
    api: {
      ai: string;
      api_key: string;
      checked: number;
    }
}

export const SelectMyAPI = async (ai: string) => {
  try {
    const response = await api.post<ApiResponse>("/myApi/selectAPI", {
      ai
    });
    return response.data;
  } catch (error) {
    console.error("create Error:", error);
    throw error;
  }
};

export const CreateMyAPI = async (ai: string, apiKey: string) => {
  try {
    const response = await api.post<ApiResponse>("/myApi/createAPI", {
      ai,
      apiKey,
    });
    return response.data;
  } catch (error) {
    console.error("create Error:", error);
    throw error;
  }
};

export const checkApiKeyValidityForAi = (ai: string, apiKey: string) => {
  if (ai.toLowerCase() === "openai") {
    return checkOpenAiKey(apiKey);
  } else if (ai.toLowerCase() === "gemini") {
    return checkGeminiKey(apiKey);
  } else if (ai.toLowerCase() === "claude") {
    return checkClaudeKey(apiKey);
  } else {
    return false;
  }
}


export const toggleChange = async (ai: string) => {
  try {
    const response = await api.post<ApiResponse>("/myApi/toggleChange", {
      ai
    });
    return response.data;
  } catch (error) {
    console.error("create Error:", error);
    throw error;
  }
}