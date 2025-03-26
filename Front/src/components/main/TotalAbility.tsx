import styled from "styled-components";

const TotalBody = styled.div`
  border-radius: 0;
`;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 20px;
  `;

const ProfileName = styled.div`
  font-size: 18px;
  font-weight: 500;
  margin-top: 5px;
  width: 200px;
  text-align: center;
`;

export default function TotalAblilty() {
    
    return (
        <TotalBody>
          <ProfileContent>
            <ProfileName>아이 이름</ProfileName>
          </ProfileContent>
        </TotalBody>
      );
}
