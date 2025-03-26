import { useCallback, useEffect } from "react";
import styled from "styled-components";

const LeftSection = styled.div`
  flex: 1;
  background-color: #f0f0f0;
  border-radius: 0;
`;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
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

const ProfileName = styled.div`
  font-size: 18px;
  font-weight: 500;
  margin-top: 5px;
  width: 200px;
  text-align: center;
`;

export default function Profile() {

    // const fetchData = useCallback(async () => {
    //     try {
    //     const data = await SelectChild();
    //     }
    //     } catch (error) {
    //     console.error("Error fetching user info:", error);
    //     }
    // }, [searchUid]);
    
    // useEffect => {
    //     fetchData();
    // }, [fetchData]);
    
    return (
        <LeftSection>
          <ProfileContent>
            <ProfileIconWrapper>
              <ProfileIcon>
                <img src="child.png" alt="아이 프로필" />
              </ProfileIcon>
            </ProfileIconWrapper>
            <ProfileName>아이 이름</ProfileName>
          </ProfileContent>
        </LeftSection>
      );
}
