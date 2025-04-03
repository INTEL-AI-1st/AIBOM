import { Section, SectionHeader, Content, MyPageContainer } from '@styles/myPage/MyPageStyles';
import MyInfo from '@components/myPage/MyInfo';
import { TbCaretDownFilled, TbCaretUpFilled } from "react-icons/tb";
import { useState, useEffect } from 'react';

export default function MyEdit() {
 const [showInfo, setShowInfo] = useState(true);

  const [infoMaxHeight, setInfoMaxHeight] = useState("0px");

  useEffect(() => {
    setInfoMaxHeight(showInfo ? "650px" : "0px");
  }, [showInfo]);

  return (
      <MyPageContainer>
        <Section>
          <SectionHeader onClick={() => setShowInfo(!showInfo)}>
            내 정보
            {showInfo ? <TbCaretDownFilled/> : <TbCaretUpFilled/>}
          </SectionHeader>
          <Content maxHeight={infoMaxHeight}>
            <MyInfo />
          </Content>
        </Section>
      </MyPageContainer>
  );
}
