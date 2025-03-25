import { FaEnvelope } from "react-icons/fa";
import { Input, Button, Form, InputWrapper, IconWrapper, Container, StyledLink, StripedContainer, StripedText, MyWrapper } from "@styles/AuthStyles";
import { useLoginForm } from "@hooks/UseAuthForm";
import PasswordInput from "@components/common/Password";
import SocialLoginButtons from "@components/SocialLoginButtons";

export default function Login() {
  const { email, setEmail, password, setPassword, handleSubmit, showPassword, setShowPassword } = useLoginForm();

  return (
    <MyWrapper>
      <Container>
        <h2>로그인</h2>
        <SocialLoginButtons />
        <StripedContainer>
          <StripedText>또는</StripedText>
        </StripedContainer>
        <Form onSubmit={handleSubmit}>
          <InputWrapper>
            <IconWrapper>
              <FaEnvelope />
            </IconWrapper>
            <Input
              type="text"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputWrapper>
          <PasswordInput
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            placeholder="비밀번호"
          />
          <Button type="submit">Login</Button>
        </Form>
        <p>
          계정이 없으신가요? <StyledLink to="/register">회원가입</StyledLink>
        </p>
      </Container>
    </MyWrapper>
  );
}
