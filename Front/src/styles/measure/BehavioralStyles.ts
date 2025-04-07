import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-height: 100%;
  margin: 0 auto;
`;

export const SubContainer = styled.div``;

export const DomainContainer = styled.div`
  padding: 10px;
`;

export const Title = styled.h1`
  text-align: center;
  margin-block: 40px;
  font-size: 2rem;
  letter-spacing: 0.5px;
`;

export const Nav = styled.nav`
  width: 100%;
  background: #ffb9b9;
  padding: 12px 0;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

export const NavList = styled.ul`
  display: flex;
  justify-content: center;
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const NavItem = styled.li`
  cursor: pointer;
  font-weight: bold;
  margin: 0 15px;
  transition: color 0.2s ease-in-out;
  &:hover {
    color: #0077cc;
  }
`;

export const Btn = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  margin: 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;

export const InFlie = styled.input`
  display: none;
`;