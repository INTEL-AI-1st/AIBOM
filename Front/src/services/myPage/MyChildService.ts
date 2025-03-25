import { NewChild } from "@hooks/myPage/useChildInfo";
import { api } from "@services/Api";

export interface ChildForm {
    info:{
        state: string;
        name: string;
        ageYears: string;
        ageMonths: string;
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
  
  export const SaveChild = async (child: NewChild) => {
    try {
        console.log(child);
      const response = await api.post<NewChild>("/myChild/saveChild", {
        child
      });
      return response.data;
    } catch (error) {
      console.error("create Error:", error);
      throw error;
    }
  }