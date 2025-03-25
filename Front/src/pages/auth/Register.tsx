import { InputWrapper, Input, Button, Form, IconWrapper, Container, StyledLink, MyWrapper } from "@styles/AuthStyles";
import { FaUser, FaEnvelope, FaIdCard, FaBirthdayCake } from "react-icons/fa";
import { useRegisterForm, useOAuthData } from "@hooks/UseAuthForm";
import PasswordInput, { PasswordForm } from "@components/common/Password";

export default function Register() {
  const {
    name, setName, email, setEmail, nickName, setNickName, birthday, setBirthday, agent, setAgent,
    password, setPassword, showPassword, setShowPassword,
    rePassword, setRePassword, showRePassword, setShowRePassword,
    isValPw, isCfPw, handleSubmit
  } = useRegisterForm();
  
  useOAuthData(setEmail, setName, setAgent);

  return (
    <MyWrapper>
      <Container>
        <h2>회원가입</h2>
        <Form onSubmit={handleSubmit}>
          <InputWrapper 
            style={{
              backgroundColor: agent ? "#f0f0f0" : "white",
            }}
          >
            <IconWrapper><FaUser /></IconWrapper>
            <Input 
              type="text" 
              placeholder="이름" 
              value={name} 
              readOnly={!!agent} 
              onChange={(e) => setName(e.target.value)} 
              style={{
                backgroundColor: agent ? "#f0f0f0" : "white",
              }}
              required 
            />
          </InputWrapper>

          <InputWrapper
            style={{
              backgroundColor: agent ? "#f0f0f0" : "white",
            }}
          >
            <IconWrapper><FaEnvelope /></IconWrapper>
            <Input 
              type="email" 
              placeholder="이메일" 
              value={email} 
              readOnly={!!agent} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{
                backgroundColor: agent ? "#f0f0f0" : "white",
              }}
            />
          </InputWrapper>

          <InputWrapper>
            <IconWrapper><FaIdCard /></IconWrapper>
            <Input 
              type="text" 
              placeholder="닉네임 (1~12자리)" 
              value={nickName} 
              onChange={(e) => setNickName(e.target.value)} 
              required 
              maxLength={12} 
            />
          </InputWrapper>
          
          <InputWrapper>
            <IconWrapper><FaBirthdayCake /></IconWrapper>
            <Input 
              type="text" 
              placeholder="생년월일 (8자리)" 
              value={birthday}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                setBirthday(onlyNums)
              }}
              required 
              maxLength={8} 
            />
          </InputWrapper>
         
          {!agent && ( 
            <>
              <PasswordInput 
                password={password} 
                setPassword={setPassword} 
                showPassword={showPassword} 
                setShowPassword={setShowPassword} 
                placeholder="비밀번호"
              />
              <PasswordInput 
                password={rePassword} 
                setPassword={setRePassword} 
                showPassword={showRePassword} 
                setShowPassword={setShowRePassword} 
                placeholder="비밀번호 확인"
              />
            </>
          )}

          <Button type="submit">회원가입</Button>
        </Form>

        {!agent && (
          <PasswordForm
            password={password}
            isValPw={isValPw}
            isCfPw={isCfPw}
          />
        )}

        <p>
          계정이 있으신가요? <StyledLink to="/login">로그인</StyledLink>
        </p>
      </Container>
    </MyWrapper>
  );
}
