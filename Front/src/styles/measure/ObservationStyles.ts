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
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
`;

export const BtnForm = styled.div`
    text-align: center;
    margin-bottom: 5px;
`;

export const Btn = styled.button`
    /* padding: 20px; */
    font-size: 1.5em;
    border-radius: 5px;
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