import { FaBaby } from "react-icons/fa";
import { useMainContext } from "@context/MainContext";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { usePopup } from "@hooks/UsePopup";
import * as PS from "@styles/main/ProfileStlyes";
import { LinkP } from "@styles/main/AbilityGraphStyles";

export default function Profile() {
  const { loading, childInfo, selectedChild, setSelectedChild } = useMainContext();
  const { showConfirm } = usePopup();
  const navigate = useNavigate();
  
  useEffect(() => {
    async function checkChildInfo() {
      if (loading) return;
      if (!loading && childInfo.length === 0) {
        const confirmResponse = await showConfirm({
          message:
            "아이를 먼저 등록하셔야 해당 메뉴를 확인가능합니다<br/>등록하러 가시겠습니까?",
        });
        if (confirmResponse) {
          navigate("/my");
        } else {
          navigate("/community");
        }
      }
    }
    checkChildInfo();
    // eslint-disable-next-line
  }, [loading, childInfo.length, navigate]);

  return (
    <PS.LeftSection>
      <PS.ButtonList>
        {childInfo.map((info) => (
          <PS.ChildButton
            key={info.uid}
            selected={info.uid === selectedChild?.uid}
            onClick={() => setSelectedChild(info)}
          >
            {info.name}
          </PS.ChildButton>
        ))}
      </PS.ButtonList>

      {selectedChild && (
        <>
          <PS.ProfileContent>
            <PS.ProfileIconWrapper>
              <PS.ProfileIcon>
                {selectedChild.profileUrl ? (
                  <PS.ProfileImg src={selectedChild.profileUrl} />
                ) : (
                  <FaBaby size={200} color="666" />
                )}
              </PS.ProfileIcon>
            </PS.ProfileIconWrapper>
            <PS.ProfileContainer>
              <PS.ProfileName>{selectedChild.name}</PS.ProfileName>
              <p>
                {selectedChild.ageYears}세 ({selectedChild.ageMonths}개월)
              </p>
              <p>
                인텔 유치원(인공지능 반)
              </p>
              <p>
                마크 김 선생님
              </p>
            </PS.ProfileContainer>
          </PS.ProfileContent>
          <PS.EvalWrapper>
            <PS.EvalHeader>
              <LinkP 
                to="/report"
                onClick={() => {
                  localStorage.setItem('reportId', 'all');
                }}
                style={{marginTop: '0px'}}
                >
                종합 보고서 보기 →
              </LinkP>
            </PS.EvalHeader>
            <PS.EvalBody>
              행돌발달 그래프 + 유아 관찰 그래프
             <br/> 통합한 것
            </PS.EvalBody>
          </PS.EvalWrapper>
        </>
      )}
    </PS.LeftSection>
  );
}
