import { checkApiKeyValidityForAi, SelectMyAPI, CreateMyAPI, toggleChange } from "@services/myPage/MyApiService";
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

const TOGGLE_LOCK_TIME = 30000;

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


// MyAPI hooks
export function useMyApi(
  title: string,
  activeApi: string,
  setActiveApi: React.Dispatch<React.SetStateAction<string>>
) {
  const [apiKey, setApiKey] = useState("");
  const [err, setErr] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const { showAlert } = usePopup();

  // 토글 버튼 비활성화를 일정 시간동안 유지하는 함수
  const disableToggle = useCallback(() => {
    setIsDisabled(true);
    setTimeout(() => setIsDisabled(false), TOGGLE_LOCK_TIME);
  }, []);

  // 새로고침 토큰 비활성화 유지
  useEffect(() => {
    const lockTimestamp = localStorage.getItem("toggleLockTime");
    if (lockTimestamp) {
      const elapsed = Date.now() - parseInt(lockTimestamp, 10);
      if (elapsed < TOGGLE_LOCK_TIME) {
        setIsDisabled(true);
        setTimeout(() => setIsDisabled(false), TOGGLE_LOCK_TIME - elapsed);
      }
    }
  }, []);

  // API의 유효성을 검증하는 함수
  const validateApiKey = useCallback(
    async (key: string) => {
      setErr("");
      const valid = await checkApiKeyValidityForAi(title, key);
      if (!valid) {
        setErr("잘못된 API_KEY입니다");
        return false;
      }
      return true;
    },
    [title]
  );

  // title이 변경될 때 사용자 데이터를 불러옴
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErr("");
      try {
        const data = await SelectMyAPI(title);
        if (!data) {
          setApiKey("");
          return;
        }
        const { api } = data;
        const key = api.ai === title ? api.api_key : "";
        setApiKey(key);

        if (api.checked) {
          setActiveApi(api.ai);
        }

        const valid = await validateApiKey(key);
        setIsValid(valid);
      } catch (error) {
        console.error(error);
        setApiKey("");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [title, setActiveApi, validateApiKey]);

  // API를 저장하는 함수
  const handleSave = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setErr("");
    try {
      await CreateMyAPI(title, apiKey);
      await showAlert({ message: "저장되었습니다.", header: "성공" });
      const valid = await validateApiKey(apiKey);
      setIsValid(valid);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [loading, title, apiKey, showAlert, validateApiKey]);

  // API 활성화 토글 함수
  const handleToggle = useCallback(() => {
    if (isDisabled) return;
    const newActiveApi = activeApi === title ? "" : title;
    setActiveApi(newActiveApi);
    toggleChange(newActiveApi);
    localStorage.setItem("toggleLockTime", Date.now().toString());
    disableToggle();
  }, [activeApi, title, setActiveApi, isDisabled, disableToggle]);

  return {
    title,
    apiKey,
    setApiKey,
    err,
    isValid,
    handleSave,
    handleToggle,
    isDisabled,
    loading,
  };
}
