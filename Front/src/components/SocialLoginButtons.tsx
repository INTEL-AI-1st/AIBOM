import styled from "styled-components";

// 공통 소셜 로그인 버튼 스타일
const SocialButton = styled.a<{ bgColor: string; color: string }>`
  width: 100%;
  height: 50px;
  margin: 8px 0;
  border-radius: 12px;
  font-size: 0.9em;
  font-weight: 600;
  border: 1px solid #ddd;
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.color};
  display: grid;
  text-decoration: none;
  grid-template-columns: 40px auto 40px;
  align-items: center;
  gap: 5px;
  &:hover {
    background-color: ${(props) => props.bgColor} !important;
    opacity: 0.7;
  }
`;

const IconImage = styled.img`
  width: 30px;
  height: 30px;
  justify-self: start;
  
`;

const ButtonText = styled.span`
  text-align: center;
  width: 100%;
`;

// 빈 셀: 오른쪽에 배치해 텍스트를 중앙으로 고정
const EmptyCell = styled.div``;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function SocialLoginButtons() {
    const URL = import.meta.env.VITE_BACKEND_URL;

    return (
    <ButtonGroup>
        {/* 네이버 버튼 */}
        <SocialButton bgColor="#03CF5D" color="#fff" href={URL+"/oauth/naver"}>
        <IconImage src="social_naver_icon.svg" alt="naver" />
        <ButtonText>네이버 계정으로 로그인</ButtonText>
        <EmptyCell />
        </SocialButton>
        {/* 카카오 버튼 */}
        <SocialButton bgColor="#FEE500" color="#000" href={URL+"/oauth/kakao"}>
        <IconImage src="social_kakao_icon.svg" alt="kakao" />
        <ButtonText>카카오 계정으로 로그인</ButtonText>
        <EmptyCell />
        </SocialButton>
        {/* 구글 버튼 */}
        <SocialButton bgColor="#fff" color="#000" href={URL+"/oauth/google"} style={{ border: "1px solid #000" }}>
        <IconImage src="social_google_icon.svg" alt="google" />
        <ButtonText>Google 계정으로 로그인</ButtonText>
        <EmptyCell />
        </SocialButton>
        {/* 애플 버튼 */}
        {/* <SocialButton bgColor="#000" color="#fff" href={URL+"/oauth/apple"}>
        <IconImage src="social_apple_icon.svg" alt="apple" />
        <ButtonText>Apple 계정으로 로그인</ButtonText>
        <EmptyCell />
        </SocialButton> */}
    </ButtonGroup>
    );
}
