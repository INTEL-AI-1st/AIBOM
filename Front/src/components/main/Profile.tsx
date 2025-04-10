import { FaBaby } from "react-icons/fa";
import styled from "styled-components";
import { useMainContext } from "@context/MainContext";
import { ProfileImg } from "@styles/main/ProfileStlyes";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { usePopup } from "@hooks/UsePopup";
import { LinkP } from "@styles/main/AbilityGraphStyles";

const LeftSection = styled.div`
  flex: 1;
  background-color: #f0f0f0;
  border-radius: 0;
`;

const ButtonList = styled.div`
  display: flex;
  gap: 10px;
  padding: 20px;
  flex-wrap: wrap;
`;

const ChildButton = styled.button<{ selected: boolean }>`
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background-color: ${({ selected }) => (selected ? "#ffb9b9" : "#ccc")};
  color: white;
`;

const ProfileContent = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
`;

const ProfileIconWrapper = styled.div`
  position: relative;
`;

const ProfileIcon = styled.div`
  height: 200px;
  width: 200px;
  margin-bottom: 10px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }
`;

const ProfileContainer = styled.div``;

const ProfileName = styled.div`
  font-size: 32px;
  font-weight: 900;
  margin-top: 5px;
`;

const EvalWrapper = styled.div`
  padding-left: 10px;
`;

export default function Profile() {
  const { loading, childInfo, selectedChild, setSelectedChild } = useMainContext();
  const { showConfirm } = usePopup();
  const navigate = useNavigate();
  
  useEffect(() => {
    async function checkChildInfo() {
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
    <LeftSection>
      <ButtonList>
        {childInfo.map((info) => (
          <ChildButton
            key={info.uid}
            selected={info.uid === selectedChild?.uid}
            onClick={() => setSelectedChild(info)}
          >
            {info.name}
          </ChildButton>
        ))}
      </ButtonList>

      {selectedChild && (
        <>
          <ProfileContent>
            <ProfileIconWrapper>
              <ProfileIcon>
                {selectedChild.profileUrl ? (
                  <ProfileImg src={selectedChild.profileUrl} />
                ) : (
                  <FaBaby size={200} color="666" />
                )}
              </ProfileIcon>
            </ProfileIconWrapper>
            <ProfileContainer>
              <ProfileName>{selectedChild.name}</ProfileName>
              <p>
                {selectedChild.ageYears}세 ({selectedChild.ageMonths}개월)
              </p>
            </ProfileContainer>
          </ProfileContent>
          <EvalWrapper>
            <LinkP 
              to="/report"
              onClick={() => {
                localStorage.setItem('reportId', 'all');
              }}
            >
              더보기 →
            </LinkP>
            asdasdasdasdsa
          </EvalWrapper>
        </>
      )}
    </LeftSection>
  );
}
