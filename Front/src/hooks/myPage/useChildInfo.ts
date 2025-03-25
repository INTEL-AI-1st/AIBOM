import { SaveChild, SelectChild } from '@services/myPage/MyChildService';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@services/supabaseClient'; // supabase 클라이언트 임포트

export interface NewChild {
  state: string;
  name: string;
  birthday: string;
  gender: string;
  profileUrl?: string; // 업로드 후 파일 네임이 저장됨
  file?: File;         // 업로드할 파일
  fileName?: string;   // 생성된 파일 네임
}

export interface ChildForm {
  state: string;
  name: string;
  birthday: string;
  ageYears: string;
  ageMonths: string;
  gender: string;
  profileUrl?: string;
  file?: File;
  fileName?: string;
}

export function useChildInfo() {
  const [newChild, setNewChild] = useState<NewChild[]>([]);
  const [childForm, setChildForm] = useState<ChildForm[]>([]);
  const [sortOption, setSortOption] = useState<"age" | "gender">("age");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const sortRef = useRef<HTMLDivElement | null>(null);

  const location = useLocation();
  const searchUid = location.state?.uid;

  const fetchData = useCallback(async () => {
    try {
      const data = await SelectChild(searchUid);
      if (data && data.info && Array.isArray(data.info)) {
        const formatted = data.info.map((child: ChildForm) => ({
          ...child,
          state: "R",
        }));
        setChildForm(formatted);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }, [searchUid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddChild = () => {
    setNewChild((prev) => [
      ...prev,
      { state: "C", name: "", birthday: "", gender: "1", profileUrl: undefined },
    ]);
  };

  // supabase profiles 스토리지에 파일을 업로드하는 함수
  const uploadImageToSupabase = async (file: File, fileName: string) => {
    const { data, error } = await supabase.storage.from('profiles').upload(fileName, file);
    console.log(data);
    if (error) {
      throw error;
    }
    
    return fileName;
  };

  const handleSaveChild = async (index: number) => {
    if (newChild[index]) {
      const child = newChild[index];
      if (!/^\d{8}$/.test(child.birthday)) {
        alert("생년월일을 정확히 입력해주세요. (8자리)");
        return;
      }
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
        let uploadedFileName = child.profileUrl;
        // 파일이 있는 경우 supabase에 업로드하고 파일 네임을 받음
        if (child.file && child.fileName) {
          uploadedFileName = await uploadImageToSupabase(child.file, child.fileName);
        }
        const childToSave = {
          ...child,
          profileUrl: uploadedFileName,
        };
        await SaveChild(childToSave);
        const ageYears = Math.floor(monthsDiff / 12).toString();
        const ageMonths = (monthsDiff % 12).toString();
        setChildForm((prev) => [
          ...prev,
          { ...childToSave, ageYears, ageMonths, state: "R" },
        ]);
        setNewChild((prev) => prev.filter((_, i) => i !== index));
      } catch (error) {
        console.error("저장 실패:", error);
        alert("저장에 실패했습니다.");
      }
    } else if (childForm[index]) {
      console.log("기존 자녀 업데이트 기능 구현 필요:", childForm[index]);
    }
  };

  const handleDeleteChild = (index: number) => {
    if (newChild[index]) {
      setNewChild((prev) => prev.filter((_, i) => i !== index));
    } else if (childForm[index]) {
      setChildForm((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleChildName = (index: number, name: string) => {
    setNewChild((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], name };
      }
      return copy;
    });
  };

  const handleChildBirthday = (index: number, birthday: string) => {
    setNewChild((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], birthday };
      }
      return copy;
    });
  };

  const handleGenderChange = (index: number, gender: string) => {
    setNewChild((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], gender };
      }
      return copy;
    });
  };

  const handleAvatarChange = (
    isNew: boolean,
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const randomCode = Math.random().toString(36).substring(2, 8);
      const fileName = `${Date.now()}-${randomCode}`;
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        if (isNew) {
          setNewChild((prev) => {
            const copy = [...prev];
            if (copy[index]) {
              copy[index] = { ...copy[index], profileUrl: result, file, fileName };
            }
            return copy;
          });
        } else {
          setChildForm((prev) => {
            const copy = [...prev];
            if (copy[index]) {
              copy[index] = { ...copy[index], profileUrl: result, file, fileName };
            }
            return copy;
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImg = (isNew: boolean, index: number) => {
    if (isNew) {
      setNewChild((prev) => {
        const copy = [...prev];
        if (copy[index]) {
          copy[index] = { ...copy[index], profileUrl: undefined, file: undefined, fileName: undefined };
        }
        return copy;
      });
    } else {
      setChildForm((prev) => {
        const copy = [...prev];
        if (copy[index]) {
          copy[index] = { ...copy[index], profileUrl: undefined, file: undefined, fileName: undefined };
        }
        return copy;
      });
    }
  };

  // 정렬 관련 핸들러
  const handleSortClick = () => {
    setShowSortOptions((prev) => !prev);
  };

  const handleSortOptionChange = (option: "age" | "gender") => {
    setSortOption(option);
    setShowSortOptions(false);
  };

  return {
    newChild,
    childForm,
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
    handleAvatarChange,
    handleDeleteImg,
  };
}
