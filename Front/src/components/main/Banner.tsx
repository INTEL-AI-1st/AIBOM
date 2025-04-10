import styled from "styled-components";
import bannerImg from "@assets/banner.png"; // 경로 주의(절대/상대 경로)

const BannerContainer = styled.div`
  width: 100%;
  height: 100px;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
`;

export default function Banner() {
  return (
    <BannerContainer>
      {/* 가져온 bannerImg를 src로 사용 */}
      <Img src={bannerImg} alt="Banner" />
    </BannerContainer>
  );
}
