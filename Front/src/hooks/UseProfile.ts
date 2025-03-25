import { useState, useEffect, useCallback, useRef } from "react";
import { SelectUserInfo } from "@services/UserInfoService";
import { getPublicProfileUrl } from "@services/supabaseClient";
import { useLocation } from "react-router-dom";

interface UserInfo {
  nickName: string;
  profile: string;
  bio: string;
}

interface ChildForm {
  name: string;
  birthday: string;
  gender: string;
}

export function useUserInfo() {
  const [info, setInfo] = useState<UserInfo | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [sortOption, setSortOption] = useState("popular");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showMypage, setShowMypage] = useState(false);
  const [childForm, setChildForm] = useState<ChildForm[]>([]);
  
  const sortRef = useRef<HTMLDivElement | null>(null);
  const firstRenderRef = useRef(true);
  
  const location = useLocation();
  const searchUuid = location.state?.uuid;

  const fetchData = useCallback(async () => {
    try {
      const data = await SelectUserInfo(searchUuid);
      if (!data) return;
      
      setInfo(data.info);
      setIsOwner(data.isOwner);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }, [searchUuid]);
  
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

  useEffect(() => {
    if (!showSortOptions) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortOptions(false);
      }
    };
    
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showSortOptions]);

  const ProfileUrl = getPublicProfileUrl(info?.profile ?? null);

  const handleSortClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setShowSortOptions(prev => !prev);
  }, []);

  const handleSortOptionChange = useCallback((option: string) => {
    setSortOption(option);
    setShowSortOptions(false);
  }, []);

  const handleAddChild = useCallback(() => {
    setChildForm(prev => [...prev, { name: "", birthday: "", gender: "" }]);
  }, []);

  const handleDeleteChild = useCallback((index: number) => {
    setChildForm(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  }, []);

  const handleChildName = useCallback((index: number, value: string) => {
    setChildForm(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name: value };
      return updated;
    });
  }, []);

  const handleChildBirthday = useCallback((index: number, value: string) => {
    setChildForm(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], birthday: value };
      return updated;
    });
  }, []);

  const handleGenderChange = useCallback((index: number, value: string) => {
    setChildForm(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], gender: value };
      return updated;
    });
  }, []);

  const handleToggleMypage = useCallback((value: boolean) => {
    setShowMypage(value);
  }, []);

  return {
    info,
    isOwner,
    ProfileUrl, 
    sortOption,
    showSortOptions,
    sortRef,
    handleSortClick,
    handleSortOptionChange,
    handleAddChild,
    handleDeleteChild,
    handleChildName,
    handleChildBirthday,
    handleGenderChange,
    showMypage,
    setShowMypage: handleToggleMypage,
    childForm
  };
}