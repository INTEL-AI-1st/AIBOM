import { api } from "./Api";

interface InfoResponse {
    info: {
      uuid: string;
      nickName: string;
      profile: string;
      bio: string;
    }
    isOwner: boolean;
}

export const SelectUserInfo = async (seachUuid: string) => {
  try {
    const response = await api.post<InfoResponse>("/userInfo/selectInfo", {
      seachUuid
    });
    return response.data;
  } catch (error) {
    console.error("create Error:", error);
    throw error;
  }
};