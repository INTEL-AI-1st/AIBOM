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
  state: string;
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
    setChildForm(prev => [...prev, { state: "add", name: "", birthday: "", gender: "" }]);
  }, []);

  const handleSaveChild = useCallback(async (index: number) => {
    const child = childForm[index];
  
    // 생년월일이 8자리(yyyymmdd)인지 확인
    if (!/^\d{8}$/.test(child.birthday)) {
      alert("생년월일을 정확히 입력해주세요. (8자리)");
      return;
    }
  
    // 생년월일 → Date 객체로 변환
    const birthDate = new Date(
      Number(child.birthday.slice(0, 4)),
      Number(child.birthday.slice(4, 6)) - 1,
      Number(child.birthday.slice(6, 8))
    );
  
    const now = new Date();
    const monthsDiff =
      (now.getFullYear() - birthDate.getFullYear()) * 12 +
      (now.getMonth() - birthDate.getMonth());
  
    if (monthsDiff >= 71) {
      alert("71개월 미만의 아이만 등록할 수 있습니다.");
      return;
    }
  
    try {
      // await saveChild(child);
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했습니다.");
      return;
    }
  
  }, [childForm]);
  

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
    handleSaveChild,
    handleDeleteChild,
    handleChildName,
    handleChildBirthday,
    handleGenderChange,
    showMypage,
    setShowMypage: handleToggleMypage,
    childForm
  };
}