import { useState, useEffect, useCallback, useRef } from "react";
import { SelectUserInfo } from "@services/myPage/UserInfoService";
import { getPublicProfileUrl } from "@services/common/supabaseClient";
import { useLocation } from "react-router-dom";

export interface UserInfo {
  nickName: string;
  profile: string;
  bio: string;
}

export function useUserInfo() {
  const [info, setInfo] = useState<UserInfo | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showMypage, setShowMypage] = useState(false);
  const firstRenderRef = useRef(true);
  
  const location = useLocation();
  const searchUid = location.state?.uid;

  const fetchData = useCallback(async () => {
    try {
      const data = await SelectUserInfo(searchUid);
      if (!data) return;
      
      setInfo(data.info);
      setIsOwner(data.isOwner);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }, [searchUid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    
    if (!showMypage) {
      fetchData();
    }
  }, [showMypage, fetchData]);

  const ProfileUrl = getPublicProfileUrl(info?.profile ?? null);

  const handleToggleMypage = useCallback((value: boolean) => {
    setShowMypage(value);
  }, []);

  return {
    info,
    isOwner,
    ProfileUrl,
    showMypage,
    setShowMypage: handleToggleMypage,
  };
}
