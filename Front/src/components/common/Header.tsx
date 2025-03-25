import styled from "styled-components";
import { GrLogout } from "react-icons/gr";
import { logoutUser } from "@services/AuthService";
import { useNavigate } from "react-router-dom";

const HeaderWrapper = styled.div`
    display: flex;
    width: 100%;
    background-color: #ffb9b9;
    align-items: center;
    justify-content: space-between;
    padding-block: 15px;
`;

const HeaderText = styled.div`
  font-weight: bold;
  align-items: center;
  font-size: 16px;
  padding-left: 25px;
`;

export default function Header() {
  const navigate = useNavigate();

  const logout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <HeaderWrapper>
      <HeaderText>아이봄(AIBom)</HeaderText>
      <GrLogout onClick={logout} style={{ cursor: "pointer", paddingRight: "25px", fontSize: "25px" }} />
    </HeaderWrapper>
  );
}
