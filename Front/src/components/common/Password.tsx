import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Input, InputWrapper, IconWrapper, PwContainer, PwDiv, PwIcon } from "@styles/AuthStyles";
import { FaCircle, FaCircleXmark, FaCircleCheck } from "react-icons/fa6";

interface PasswordInputProps {
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  placeholder: string;
}

interface PasswordFormProps {
  password: string;
  isValPw: boolean;
  isCfPw: boolean;
}

export default function PasswordInput({ password, setPassword, showPassword, setShowPassword, placeholder }: PasswordInputProps) {
  return (
    <InputWrapper>
      <IconWrapper><FaLock /></IconWrapper>
      <Input 
        type={showPassword ? "text" : "password"} 
        placeholder={placeholder} 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      />
      <IconWrapper isClickable={true} onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </IconWrapper>
    </InputWrapper>
  );
}

export function PasswordForm({ password, isValPw, isCfPw }: PasswordFormProps) {
  const getIcon = (condition: boolean | null) => {
    if (condition === null) return <FaCircle />;
    return condition ? <FaCircleCheck /> : <FaCircleXmark />;
  };

  return (
    <PwContainer>
      <PwDiv>
        <PwIcon isValid={password ? isValPw : null}>{getIcon(password ? isValPw : null)}</PwIcon>
        <span> 최소 8자 이상이며, 문자, 숫자, 특수문자를 포함</span>
      </PwDiv>
      <PwDiv>
        <PwIcon isValid={password ? isCfPw : null}>{getIcon(password ? isCfPw : null)}</PwIcon>
        <span> 입력 비밀번호와 확인 비밀번호 일치 여부</span>
      </PwDiv>
    </PwContainer>
  );
}