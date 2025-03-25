import styled from "styled-components";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

export const Nav = styled.nav`
  width: 100%;
  background: #333;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

export const MenuToggle = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  margin-left: 30px;
`;

export const NavList = styled.ul<{ isOpen: boolean }>`
  list-style: none;
  display: flex;
  gap: 15px;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
    flex-direction: column;
    position: absolute;
    top: 50px;
    left: 0;
    background: #444;
    width: 100%;
    padding: 10px 0;
  }
`;

export const NavItem = styled.li`
  a {
    color: #fff;
    text-decoration: none;
  }
`;

export const ProfileIcon = styled(FaUserCircle)`
  font-size: 28px;
  cursor: pointer;
  margin-right: 30px;
`;

export const StyledLink = styled(Link)`
  color: #fff;
  text-decoration: none;

  &:hover{
    color: #ddd;
  }
`;