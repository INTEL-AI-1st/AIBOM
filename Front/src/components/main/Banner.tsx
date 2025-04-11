import styled from "styled-components";
import bannerImg from "@assets/banner.png"; // 경로 주의(절대/상대 경로)

const BannerContainer = styled.div`
  width: 100%;
  height: 100px;
`;

const StyledLink = styled.a`
  text-decoration: none;
  display: block;
  height: 100%;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
`;

export default function Banner() {
  return (
    <BannerContainer>
      <StyledLink
        href="https://www.coupang.com/np/search?component=&q=%EA%B8%B0%EC%A0%80%EA%B7%80&channel=user"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Img src={bannerImg} alt="Banner" />
      </StyledLink>
    </BannerContainer>
  );
}
