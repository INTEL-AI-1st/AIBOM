import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { SelectChild } from "@services/myPage/MyChildService";
import { getPublicProfileUrl } from "@services/common/supabaseClient";
import { ApiChild } from "@hooks/myPage/useChildInfo";
import { getUser } from "@services/auth/AuthService";


interface User {
  uid: string;
  nickName: string;
  profileUrl?: string;
}
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
  loading: boolean;
  childInfo: ChildInfo[];
  selectedChild: ChildInfo | null;
  userInfo: User | undefined;
  setSelectedChild: React.Dispatch<React.SetStateAction<ChildInfo | null>>;
  refreshChildData: () => void;
}

const ChildContext = createContext<ChildContextType | undefined>(undefined);

// eslint-disable-next-line
export const useMainContext = () => {
    const context = useContext(ChildContext);
    if (!context) {
      throw new Error("useChildContext must be used within a ChildProvider");
    }
    return context;
  };

  
export const MainProvider = ({ children }: { children: ReactNode }) => {
  const [childInfo, setChildInfo] = useState<ChildInfo[]>([]);
  const [userInfo, setUserInfo] = useState<User>();
  const [selectedChild, setSelectedChild] = useState<ChildInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshChildData = async () => {
    try {
      setLoading(true);
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
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshChildData();
  }, []);

  const fetchUserData = useCallback(async () => {
    try {
      const data = await getUser();
      if (!data.info) return;
      const user = data.info;
      const updatedUser = {
        ...user,
        profileUrl: user.profileUrl ? (getPublicProfileUrl(user.profileUrl) ?? undefined) : undefined,
      };
      setUserInfo(updatedUser);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }, []);
  

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <ChildContext.Provider value={{ loading, childInfo, userInfo, selectedChild, setSelectedChild, refreshChildData }}>
      {children}
    </ChildContext.Provider>
  );
};