import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SelectChild } from "@services/myPage/MyChildService";
import { getPublicProfileUrl } from "@services/supabaseClient";
import { ApiChild } from "@hooks/myPage/useChildInfo";

interface ChildInfo {
  uid?: string;
  name: string;
  gender: string;
  ageYears?: string;
  ageMonths?: string;
  fileName?: string;
  profileUrl?: string | null;
}

interface ChildContextType {
  childInfo: ChildInfo[];
  selectedChild: ChildInfo | null;
  setSelectedChild: React.Dispatch<React.SetStateAction<ChildInfo | null>>;
  refreshChildData: () => void;
}

const ChildContext = createContext<ChildContextType | undefined>(undefined);

export const useMainContext = () => {
    const context = useContext(ChildContext);
    if (!context) {
      throw new Error("useChildContext must be used within a ChildProvider");
    }
    return context;
  };

  
export const MainProvider = ({ children }: { children: ReactNode }) => {
  const [childInfo, setChildInfo] = useState<ChildInfo[]>([]);
  const [selectedChild, setSelectedChild] = useState<ChildInfo | null>(null);

  const refreshChildData = async () => {
    try {
      const data = await SelectChild();
      if (data?.info && Array.isArray(data.info)) {
        const formatted: ChildInfo[] = data.info.map((child: ApiChild) => ({
          uid: child.uid,
          name: child.name,
          gender: child.gender,
          ageYears: child.ageYears,
          ageMonths: child.ageMonths,
          fileName: child.fileName,
          profileUrl: child.fileName ? getPublicProfileUrl(child.fileName) : null,
        }));
        setChildInfo(formatted);
        setSelectedChild(formatted[0]);
      }
    } catch (error) {
      console.error("Error fetching child info:", error);
    }
  };

  useEffect(() => {
    refreshChildData();
  }, []);

  return (
    <ChildContext.Provider value={{ childInfo, selectedChild, setSelectedChild, refreshChildData }}>
      {children}
    </ChildContext.Provider>
  );
};