import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { registerUser, loginUser } from '@services/AuthService';
import { usePopup } from "./UsePopup";
import { usePasswordValidation } from "./UsePasswordValidation";
import Cookies from "js-cookie";
import { AxiosError } from 'axios';

// 회원가입
export function useRegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nickName, setNickName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [agent, setAgent] = useState("");
  const [loading, setLoading] = useState(false);
  const { showAlert } = usePopup();
  const navigate = useNavigate();

  const {
      password, setPassword,
      rePassword, setRePassword,
      showPassword, setShowPassword,
      showRePassword, setShowRePassword,
      isValPw, isCfPw,
  } = usePasswordValidation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
        if (!agent && !(isValPw && isCfPw)) {
        showAlert({ message: "비밀번호 조건이 일치하지 않습니다." });
            return;
        } 

      if (!loading) {
          try {
              setLoading(true);

              await registerUser(name, email, nickName, birthday, password, agent);
              await showAlert({ message: "회원가입 성공하였습니다.", header: "성공" });
              navigate("/login");
          }catch (err: unknown) {
            if (err instanceof AxiosError) {
                const errorMessage = err.response?.data?.message || "회원가입 실패하였습니다.";
                await showAlert({ message: errorMessage, header: "실패" });
            } else {
              console.error("알 수 없는 오류:", err);
              await showAlert({ message: "예기치 않은 오류가 발생했습니다.", header: "실패" });
            }
            setLoading(false);
          }
      }
  };

  return {
      name, setName,
      email, setEmail,
      nickName, setNickName,
      birthday, setBirthday,
      agent, setAgent,
      password, setPassword,
      showPassword, setShowPassword,
      rePassword, setRePassword,
      showRePassword, setShowRePassword,
      isValPw, isCfPw, handleSubmit,
  };
}

export function useOAuthData(setEmail: (email: string) => void, setName: (name: string) => void, setAgent: (agent: string) => void) {
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");

    if (status === "success") {
      const data = Cookies.get("regiData");
      if (data) {
        try {
          const { email, name, agent } = JSON.parse(data);
          setName(name);
          setEmail(email);
          setAgent(agent);
        } catch (error) {
          console.error("파싱 오류:", error);
        }
      } else {
        console.error("토큰이 없습니다.");
      }
    }
  }, [location.search, setName, setEmail, setAgent ]);
}


//로그인
export function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showAlert } = usePopup();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!loading) {
          try {
              setLoading(true);
              await loginUser(email, password);
              navigate("/");
          } catch (err) {
              console.error(err);
              await showAlert({ message: "잘못된 정보입니다.", header: "로그인 실패" });
              setLoading(false);
          }
      }
  };

  return {
    email, setEmail,
      password, setPassword,
      showPassword, setShowPassword,
      handleSubmit,
  };
}
