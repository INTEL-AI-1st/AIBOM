import { api } from "../common/Api";

interface InfoResponse {
    info: {
      uid: string;
      nickName: string;
      profile: string;
      bio: string;
    }
    isOwner: boolean;
}

export const SelectUserInfo = async (seachUid: string) => {
  try {
    const response = await api.post<InfoResponse>("/userInfo/selectInfo", {
      seachUid
    });
    return response.data;
  } catch (error) {
    console.error("create Error:", error);
    throw error;
  }
};