import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { MdFamilyRestroom, MdHome, MdSchool } from "react-icons/md";
import { FaComments } from "react-icons/fa6";

const NavBar = styled.div`
  display: flex;
  width: 100%;
  background-color: white;
  justify-content: space-around;
  padding: 10px 0;
  border-top: 1px solid #eee;
`;

const NavLink = styled(Link)<{ active: boolean }>`
  text-decoration: none;
  color: ${({ active }) => (active ? "#ffb9b9" : "#333")};
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
`;

const NavIcon = styled.div<{ active: boolean }>`
  margin-bottom: 5px;
  font-size: 28px;
  color: ${({ active }) => (active ? "#ffb9b9" : "#333")};
`;

export default function Footer() {
  const location = useLocation();

  const navItems = [
    { route: "/", label: "홈", Icon: MdHome },
    { route: "/education", label: "학습관", Icon: MdSchool },
    { route: "/community", label: "커뮤니티", Icon: FaComments },
    { route: "/my", label: "마이페이지", Icon: MdFamilyRestroom },
  ];

  return (
    <NavBar>
      {navItems.map(({ route, label, Icon }) => {
        const active = location.pathname === route;
        return (
          <NavLink key={route} to={route} active={active}>
            <NavItem>
              <NavIcon active={active}>
                <Icon size={28} color={active ? "#ffb9b9" : "#333"} />
              </NavIcon>
              <span>{label}</span>
            </NavItem>
          </NavLink>
        );
      })}
    </NavBar>
  );
}
