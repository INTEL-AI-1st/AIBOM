import styled from "styled-components";
import Profile from "@components/main/Profile";
import BodyGraph from "@components/main/BodyGraph";
import AbilityGraph from "@components/main/AbilityGraph";
import { MainProvider } from "@context/MainContext";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #f9f9f9;
`;

const TopSection = styled.div`
  display: flex;
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export default function Main() {
  return (
    <MainProvider>
      <Container>
        <TopSection>
          <Profile />
          <AbilityGraph />
        </TopSection>
        <BodyGraph />
      </Container>
    </MainProvider>
  );
}
