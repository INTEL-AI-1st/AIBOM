import { ToastContainer } from 'react-toastify';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { FaArrowCircleUp } from 'react-icons/fa';
import { styled } from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-height: 100%;
  margin: 0 auto;
`;

export const SubContainer = styled.div``;

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
  }
`;

export const InfoBox = styled.div`
  background-color: #f8f9ff;
  border-left: 4px solid #007bff;
  padding: 16px 24px;
  margin-block: 24px;
  border-radius: 0 8px 8px 0;
  text-align: left;
  
  p {
    margin: 8px 0;      
    font-weight: 600;
    color: #222;
    line-height: 1.6;
  }
`;


export const DomainSection = styled.section`
  margin-bottom: 20px;
  padding: 10px;
`;

export const DomainTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 15px;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
`;

export const ContentContainer = styled.div`
`;

export const Question = styled.div`
  margin: 25px 0;
  padding: 15px;
  background: #fafafa;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const QuestionTitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

export const QuestionTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0;
  line-height: 1.4;
`;

export const InfoIcon = styled(AiOutlineInfoCircle)`
  margin-left: 10px;
  cursor: pointer;
  color: #0077cc;
  transition: color 0.2s;
  margin-bottom: 2px;
  &:hover {
    color: #005fa3;
  }
`;

export const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
`;

export const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: background-color 0.2s;  
  &:hover {
    background-color: #f0f0f0;
  }
  span {
    margin-left: 8px;
  }
`;

export const RadioInput = styled.input`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border: 2px solid #ccc;
  border-radius: 50%;
  outline: none;
  display: inline-block;
  position: relative;
  vertical-align: middle;
  margin: 0 0 3px 0;
  
  &:checked {
    background-color: #ffb9b9;
    border: 3px solid white;
    box-shadow: 0 0 0 1.6px #ffb9b9;
  }
`;

export const SidebarContainer = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  max-width: 600px;
  background: #fff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
  transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s ease-in-out;
  z-index: 1001;
  padding: 30px;
  overflow-y: auto;
`;

export const Overlay = styled.div<{ open: boolean }>`
  display: ${({ open }) => (open ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 1.5rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
`;

export const ObservationHeader = styled.h2`
  font-size: 1.5rem;
`;

export const CloseButton = styled.button`
  display: block;
  background: transparent;
  border: none;
  font-size: 1.2em;
  color: #444;
  cursor: pointer;
  &:hover {
    background-color: inherit !important;
    color: #666;
  }
`;

export const ObservationCategory = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
`;

export const ObservationList = styled.ul`
  margin: 0 0 20px 20px;
  padding: 0;
  line-height: 1.75;
  list-style-type: decimal;
`;

export const ObservationListItem = styled.li`
  margin-bottom: 5px;       
  white-space: pre-line;     
  word-break: keep-all;    
`;

export const ScrollToTop = styled(FaArrowCircleUp)`
  position: fixed;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  color: #ffb9b9;
  font-size: 2em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 1002;
  transition: background 0.2s;
  opacity: 0.8;
  &:hover {
    opacity: 1;
  }
`;

export const BtnForm = styled.div`
    text-align: center;
    margin-bottom: 5px;
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
  margin-bottom: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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