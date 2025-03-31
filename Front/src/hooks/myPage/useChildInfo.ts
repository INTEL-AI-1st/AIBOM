import { deleteChild, deleteProfile, SaveChild, SelectChild, upsertProfile } from '@services/myPage/MyChildService';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { getPublicProfileUrl, supabase } from '@services/common/supabaseClient';
import { usePopup } from '@hooks/UsePopup';

export interface ChildInfo {
  uid?: string;
  state: "C" | "R";
  name: string;
  birthday: string;
  gender: string;
  ageYears?: string;
  ageMonths?: string;
  file?: File;
  fileName?: string;
  profileUrl?: string | null;
}
export interface ApiChild {
  uid?: string;
  name: string;
  birthday: string;
  gender: string;
  ageYears?: string;
  ageMonths?: string;
  fileName?: string;
}

export function useChildInfo() {
  const [childForm, setChildForm] = useState<ChildInfo[]>([]);
  const [sortOption, setSortOption] = useState<"age" | "gender">("age");
  const [loading, setLoading] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const sortRef = useRef<HTMLDivElement | null>(null);
  const { showAlert } = usePopup();

  const updateChildAtIndex = (index: number, update: Partial<ChildInfo>) => {
    setChildForm(prev => {
      const newList = [...prev];
      if (newList[index]) {
        newList[index] = { ...newList[index], ...update };
      }
      return newList;
    });
  };

  // 정렬된 인덱스를 기반으로 필드 업데이트
  const updateChildField = <K extends keyof ChildInfo>(
    sortedIndex: number,
    field: K,
    value: ChildInfo[K]
  ) => {
    const index = getIndex(sortedIndex);
    updateChildAtIndex(index, { [field]: value } as Pick<ChildInfo, K>);
  };
  

  const fetchData = useCallback(async () => {
    try {
      const data = await SelectChild();
      if (data?.info && Array.isArray(data.info)) {
        const formatted: ChildInfo[] = (data.info as ApiChild[]).map((child) => ({
          uid: child.uid,
          state: "R", // 명시적으로 "R"임을 단언
          name: child.name,
          birthday: child.birthday,
          gender: child.gender,
          ageYears: child.ageYears,
          ageMonths: child.ageMonths,
          fileName: child.fileName,
          profileUrl: child.fileName ? getPublicProfileUrl(child.fileName) : null,
        }));
        setChildForm(formatted);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sortedChildren = useMemo(() => {
    return childForm
      .map((child, index) => ({ child, index }))
      .sort((a, b) => {
        if (a.child.state === "C" && b.child.state !== "C") return -1;
        if (a.child.state !== "C" && b.child.state === "C") return 1;
        if (a.child.state === "R" && b.child.state === "R") {
          if (sortOption === "age") {
            const calcAge = (child: ChildInfo) =>
              child.ageYears ? parseInt(child.ageYears) * 12 + (child.ageMonths ? parseInt(child.ageMonths) : 0) : 0;
            return calcAge(a.child) - calcAge(b.child);
          } else if (sortOption === "gender") {
            return a.child.gender.localeCompare(b.child.gender);
          }
        }
        return 0;
      });
  }, [childForm, sortOption]);

  const getIndex = (sortedIndex: number) => sortedChildren[sortedIndex].index;

  const handleAddChild = () => {
    setChildForm(prev => [
      ...prev,
      { state: "C", name: "", birthday: "", gender: "1", profileUrl: undefined },
    ]);
  };

  const getMonthsDiff = (birthday: string) => {
    const year = Number(birthday.slice(0, 4));
    const month = Number(birthday.slice(4, 6));
    const day = Number(birthday.slice(6, 8));
    const birthDate = new Date(year, month - 1, day);
    const now = new Date();
    return (now.getFullYear() - birthDate.getFullYear()) * 12 + (now.getMonth() - birthDate.getMonth());
  };

  const handleSaveChild = async (sortedIndex: number) => {
    const index = getIndex(sortedIndex);
    const child = childForm[index];
    if (loading) return;

    if (child.state === "C") {
      if (!/^\d{8}$/.test(child.birthday)) {
        alert("생년월일을 정확히 입력해주세요. (8자리)");
        return;
      }
      const monthsDiff = getMonthsDiff(child.birthday);
      if (monthsDiff >= 71) {
        alert("71개월 미만의 아이만 등록할 수 있습니다.");
        return;
      }
      try {
        setLoading(true);
        if (child.file && child.fileName) {
          await handleSaveImg(child.file, child.fileName);
        }
        const payload = {
          info: {
            state: child.state,
            name: child.name,
            birthday: child.birthday,
            gender: child.gender,
            fileName: child.fileName,
          },
        };
        await SaveChild(payload);
        updateChildAtIndex(index, {
          ageYears: Math.floor(monthsDiff / 12).toString(),
          ageMonths: (monthsDiff % 12).toString(),
          state: "R",
        });
        showAlert({ message: "데이터가 저장되었습니다." });
      } catch (error) {
        console.error("저장 실패:", error);
        showAlert({ message: "데이터 저장에 실패했습니다." });
      } finally {
        setLoading(false);
      }
    } else {
      console.log("기존 자녀 업데이트 기능 구현 필요:", child);
    }
  };

  const handleDeleteChild = async (sortedIndex: number) => {
    const index = getIndex(sortedIndex);
    const child = childForm[index];
    if (child.uid) {
      if (loading) return;
      setLoading(true);
      try {
        if (child.fileName) {
          await supabase.storage.from("profiles").remove([child.fileName]);
        }
        await deleteChild(child.uid);
        showAlert({ message: "데이터가 삭제하였습니다." });
      } catch (error) {
        console.error("삭제 실패:", error);
      } finally {
        setLoading(false);
      }
    }
    setChildForm(prev => prev.filter((_, i) => i !== index));
  };

  const handleChildName = (sortedIndex: number, name: string) => {
    updateChildField(sortedIndex, "name", name);
  };

  const handleChildBirthday = (sortedIndex: number, birthday: string) => {
    updateChildField(sortedIndex, "birthday", birthday);
  };

  const handleGenderChange = (sortedIndex: number, gender: string) => {
    updateChildField(sortedIndex, "gender", gender);
  };

  const handleAvatarChange = async (
    sortedIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const index = getIndex(sortedIndex);
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      alert("파일 크기가 1MB 이상입니다. 다른 파일을 선택하세요.");
      return;
    }
    const randomCode = Math.random().toString(36).substring(2, 8);
    const fileName = `${Date.now()}-${randomCode}`;
    const reader = new FileReader();

    if (childForm[index].uid) {
      if (loading) return;
      setLoading(true);
      try {
        if (childForm[index].fileName) {
          await supabase.storage.from("profiles").remove([childForm[index].fileName]);
        }
        await supabase.storage.from("profiles").upload(fileName, file);
        await upsertProfile(childForm[index].uid, fileName);
        showAlert({ message: "이미지가 변경되었습니다." });
      } catch (error) {
        console.error("이미지 변경 실패:", error);
      } finally {
        setLoading(false);
      }
    }
    reader.onload = () => {
      updateChildAtIndex(index, { profileUrl: reader.result as string, file, fileName });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveImg = async (file: File, fileName: string) => {
    const { error } = await supabase.storage.from("profiles").upload(fileName, file);
    if (error) {
      throw error;
    }
    return fileName;
  };

  const handleDeleteImg = async (sortedIndex: number) => {
    const index = getIndex(sortedIndex);
    const child = childForm[index];
    if (loading) return;
    if (child.uid) {
      setLoading(true);
      try {
        if (child.fileName) {
          await supabase.storage.from("profiles").remove([child.fileName]);
          await deleteProfile(child.uid);
          showAlert({ message: "이미지가 삭제하였습니다." });
        }
      } catch (error) {
        console.error("이미지 삭제 실패:", error);
      } finally {
        setLoading(false);
      }
    }
    updateChildAtIndex(index, { profileUrl: undefined, file: undefined, fileName: undefined });
  };

  const handleSortClick = () => {
    setShowSortOptions(prev => !prev);
  };

  const handleSortOptionChange = (option: "age" | "gender") => {
    setSortOption(option);
    setShowSortOptions(false);
  };

  return {
    childForm: sortedChildren.map(item => item.child),
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
