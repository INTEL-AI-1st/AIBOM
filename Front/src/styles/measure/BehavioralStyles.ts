import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
`;

export const SubContainer = styled.div`
`;

export const Title = styled.h1`
  position: relative;
  text-align: center;
  margin-block: 40px;
  font-size: 2rem;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

export const BackIconWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-45%);
  cursor: pointer;
`;

export const Nav = styled.nav`
  width: 100%;
  background: linear-gradient(to right, #ffb9b9, #ffd0d0);
  padding: 14px 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
`;

export const NavList = styled.ul`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 8px;

  @media (max-width: 768px) {
    overflow-x: auto;
    flex-wrap: nowrap;
    justify-content: flex-start;
    padding: 8px 16px;
    scroll-snap-type: x mandatory;
  }
`;

export const NavItem = styled.li`
  cursor: pointer;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.2s ease-in-out;
  background-color: rgba(255, 255, 255, 0.3);
  scroll-snap-align: center;

  &:hover {
    background-color: rgba(255, 255, 255, 0.6);
    color: #0066cc;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    flex: 0 0 auto;
  }
`;


export const DomainContainer = styled.div`
  padding: 16px;
  background-color: #f5f5f7;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  p {
    margin: 0;
    margin-top: 16px;

    &:last-child {
      font-weight: 400;
    }
  }
`;

export const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  padding: 24px 0;
`;

export const InfoBox = styled.div`
  background-color: #f8f9ff;
  border-left: 4px solid #007bff;
  padding: 16px 24px;
  border-radius: 0 8px 8px 0;
  text-align: left;
  
  p {
    margin: 8px 0;
    color: #444;
    line-height: 1.6;
    
    &:first-child {
      font-weight: 600;
      font-size: 1.4rem;
      color: #222;
    }
  }
`;

export const BtnWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 24px 0;
`;

export const Btn = styled.button`
  color: white;
  border: none;
  padding: 0.75rem 1.75rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

export const InFlie = styled.input`
  display: none;
`;

export const VideoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem 0;
  
  video {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    max-width: 100%;
  }
`;

export const PermissionBox = styled.div`
  margin: 15px 0;
  padding: 15px;
  border-radius: 8px;
  background-color: #fff3f3;
  border: 1px solid #ffcccc;
  text-align: center;
  
  p {
    margin-bottom: 10px;
    color: #cc0000;
    font-weight: bold;
  }
`;

export const RecordIndicator = styled.div`
  display: flex;
  font-size: 1.2rem;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #dc3545;
  font-weight: 600;
  padding-bottom: 12px;
  animation: pulse 1.5s infinite;
/*   
  &::before {
    content: "";
    width: 12px;
    height: 12px;
    background-color: #dc3545;
    border-radius: 50%;
  } */
  
  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
`;

export const ToastCon = styled(ToastContainer)`

  .Toastify__toast-body {
    display: flex;
    align-items: center;
    color: #333;
  }

  .Toastify__toast-icon svg {
    fill: #ffb9b9 !important;
  }

  .Toastify__progress-bar {
    background: #ffb9b9 !important;
  }
`;