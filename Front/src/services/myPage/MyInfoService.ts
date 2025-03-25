import { api } from "../Api";

interface InfoResponse {
    info: {
      nickName: string;
      profile: string;
      bio: string;
      agent: string;
    }
}

export const selectMyInfo = async () => {
  try {
    const response = await api.post<InfoResponse>("/myInfo/selectMyInfo", {
    });
    return response.data;
  } catch (error) {
    console.error("create Error:", error);
    throw error;
  }
};

export const upsertMyProfile = async (profile: string) => {
  try {
    const response = await api.post<InfoResponse>("/myInfo/upsertMyProfile", {
      profile
    });
    return response.data;
  } catch (error) {
    console.error("create Error:", error);
    throw error;
  }
};

export const deleteMyProfile = async () => {
  try {
    const response = await api.post<InfoResponse>("/myInfo/deleteMyProfile", {
    });
    return response.data;
  } catch (error) {
    console.error("create Error:", error);
    throw error;
  }
};

export const updateMyInfo = async (isPw: boolean, pw: string, nickName: string, bio: string) => {
  try {
    const response = await api.post<InfoResponse>("/myInfo/updateMyInfo", {
      isPw,
      pw,
      nickName,
      bio,
    });
    return response.data;
  } catch (error) {
    console.error("create Error:", error);
    throw error;
  }
};
