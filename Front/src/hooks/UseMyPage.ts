import { useState, useEffect, useCallback } from "react";
import { usePopup } from "./UsePopup";
import { selectMyInfo, upsertMyProfile, updateMyInfo, deleteMyProfile } from "@services/myPage/MyInfoService";
import { usePasswordValidation } from "./UsePasswordValidation";
import { supabase } from "@services/supabaseClient";
import { useModalContext } from "@context/ModalContext";

interface UserInfo {
  nickName: string;
  profile: string;
  bio: string;
  agent: string;
}

// MyInfo hooks
export function useMyInfo() {
  const [info, setInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPwInput, setShowPwInput] = useState(false);
  const { closeModal } = useModalContext();

  const { showAlert } = usePopup();

  // 사용자 정보 불러오기 함수
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await selectMyInfo();
      if (!data) return;
      setInfo(data.info);
      setShowPwInput(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files || files.length !== 1) return;
    
    const file = files[0];
    if (file.size / (1024 * 1024) >= 1) {
      alert("파일 크기가 1MB 이상입니다. 다른 파일을 선택하세요.");
      return;
    }
    
    setLoading(true);
    try {
      if (info?.profile) {
        const { error: removeError } = await supabase
          .storage
          .from("profiles")
          .remove([info.profile]);
        if (removeError) {
          console.error("기존 이미지 삭제 에러:", removeError);
          showAlert({ message:"파일 업로드에 실패했습니다."});
          return;
        }
      }
  
      const randomCode = Math.random().toString(36).substring(2, 8);
      const fileName = `${Date.now()}-${randomCode}`;
      
      // 새로운 이미지 업로드
      const { error: uploadError } = await supabase
        .storage
        .from("profiles")
        .upload(fileName, file);
      if (uploadError) {
        console.error("파일 업로드 에러:", uploadError);
        showAlert({ message:"파일 업로드에 실패했습니다."});
        return;
      }
  
      // DB에 파일명 업데이트 (UPSERT)
      await upsertMyProfile(fileName);
      setInfo(prev => prev ? { ...prev, profile: fileName } : prev);
  
      showAlert({ message: "이미지가 변경되었습니다." });
    } catch (error) {
      console.error("handleAvatarChange error:", error);
    } finally {
      setLoading(false);
    }
  };  

  const handleDeleteImg = async () => {
    setLoading(true);
    try {
      if (info?.profile) {
        const { error: removeError } = await supabase
          .storage
          .from("profiles")
          .remove([info.profile]);
        if (removeError) {
          console.error("기존 이미지 삭제 에러:", removeError);
          showAlert({ message:"파일 업로드에 실패했습니다."});
          return;
        }
      }
      await deleteMyProfile();
      setInfo(prev => prev ? { ...prev, profile: '' } : prev);
      showAlert({ message: "이미지가 삭제하였습니다." });
    } catch (error) {
      console.error("handleAvatarChange error:", error);
    } finally {
      setLoading(false);
    }
  };

  const {
    password, setPassword,
    showPassword, setShowPassword,
    rePassword, setRePassword,
    showRePassword, setShowRePassword,
    isCfPw, isValPw
  } = usePasswordValidation();

  // 패스워드 입력 여부 토글
  const handlePasswordChange = () => {
    setShowPwInput((prev) => !prev);
  };

  // 정보 저장 핸들러
  const handleSave = useCallback(async () => {
    if (showPwInput && !(isValPw && isCfPw)) {
      showAlert({ message: "비밀번호 조건이 일치하지 않습니다." });
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      if (!info || !info.nickName) {
        return;
      }
      await updateMyInfo(showPwInput, password, info.nickName, info.bio);
      await showAlert({ message: "저장되었습니다.", header: "성공" });
      closeModal();
    } catch (error) {
      await showAlert({ message: "저장에 실패하였습니다.", header: "오류" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [loading, isValPw, isCfPw, showPwInput, password, info, showAlert, closeModal]);

  return {
    info, setInfo,
    isCfPw, isValPw, showPwInput,
    password, setPassword,
    showPassword, setShowPassword,
    rePassword, setRePassword,
    showRePassword, setShowRePassword,
    handleAvatarChange, handlePasswordChange, handleSave, handleDeleteImg
  };
}