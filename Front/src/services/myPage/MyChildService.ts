import { api } from "@services/Api";

export interface ChildForm {
    info: {
        uid?: string;
        state: string;
        name: string;
        birthday: string;
        gender: string;
        ageYears?: string;
        ageMonths?: string;
        fileName?: string;
    }
}
  
export const SelectChild = async (seachUid: string) => {
    try {
      const response = await api.post<ChildForm>("/myChild/selectChild", {
        seachUid
      });
      return response.data;
    } catch (error) {
      console.error("create Error:", error);
      throw error;
    }
  }
  
  export const SaveChild = async (child: ChildForm) => {
    try {
      const response = await api.post<ChildForm>("/myChild/saveChild", {
        child
      });
      return response.data;
    } catch (error) {
      console.error("create Error:", error);
      throw error;
    }
  }

  export const deleteChild = async (uid: string) => {
    try {
        const response = await api.post<ChildForm>("/myChild/deleteChild", {
            uid
        });
        return response.data;
        } catch (error) {
        console.error("create Error:", error);
        throw error;
        }
    }

  export const upsertProfile = async (uid: string, fileName: string) => {
    try {
      const response = await api.post<ChildForm>("/myChild/upsertProfile", {
        uid,
        fileName
      });
      return response.data;
    } catch (error) {
      console.error("create Error:", error);
      throw error;
    }
  }

  export const deleteProfile = async (uid: string) => {
    try {
      const response = await api.post<ChildForm>("/myChild/deleteProfile", {
        uid,
      });
      return response.data;
    } catch (error) {
      console.error("create Error:", error);
      throw error;
    }
  }