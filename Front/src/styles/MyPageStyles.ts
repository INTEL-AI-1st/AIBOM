import styled from "styled-components";

// 헤더 부분 //
export const MyPageContainer = styled.div`
  width: 100%;
`;

export const Section = styled.div`
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: #f9f9f9;
`;

export const SectionHeader = styled.div`
  padding: 10px 15px;
  background: #444;
  color: white;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: #666;
  }
  `;

export const Content = styled.div<{ maxHeight: string }>`
    max-height: ${({ maxHeight }) => maxHeight};
    overflow: hidden;
    transition: max-height 0.4s ease-in-out, opacity 0.4s ease-in-out;
    opacity: ${({ maxHeight }) => (maxHeight === "0px" ? 0 : 1)};
`;

// 컨텐츠 부분 //
export const ApiContainer = styled.div`
    display: grid;
    padding: 10px;
    gap: 10px;
`;

export const H = styled.h4`
    margin: 0;
`;

export const Button = styled.button`
    flex: 2;
`;

export const InputWrapper = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
`;

// MyInfo
export const AvatarWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 10px;
    font-size: 1.5em;
`;

export const AvatarUpload = styled.label`
    cursor: pointer;
`;

export const AvatarInput = styled.input`
    display: none;
`;

export const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
`

export const ImgButton = styled.button`
    font-size: 0.7rem;
    width: 80px;
`

export const InfoItem = styled.div`
    border-radius: 5px;
`;

export const InfoInput = styled.input`
    border: 1px solid #ddd;
    border-radius: 5px;
    width: 100%;
    font-size: 1.2em;
    padding: 5px;
`;

export const InfoTextArea = styled.textarea`
    border: 1px solid #ddd;
    border-radius: 5px;
    width: 100%;
    font-size: 1.1em;
    padding: 5px;
    height: 100px;
`;

export const ButtonDiv = styled.div`
    display: flex;
    gap: 10px;
`;

export const InfoButton = styled.button`
    flex: 2;
    border-radius: 10px;
`;



// MyAPI
export const HeaderRow = styled.div` 
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

interface ToggleProps {
    active: boolean;
  }
  
export const ToggleSwitch = styled.button<ToggleProps>`
    width: 40px;
    height: 20px;
    background-color: ${props => (props.active ? '#4CAF50' : '#ccc')};
    border: none;
    border-radius: 25px;
    position: relative;
    cursor: pointer;
    padding: 0;
    transition: background-color 0.3s;
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

export const ToggleBall = styled.div<ToggleProps>`
    width: 18px;
    height: 18px;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    top: 1px;
    left: ${props => (props.active ? '21px' : '1px')};
    transition: left 0.3s;
`;

export const ApiInput = styled.input`
    flex: 8;
    padding: 10px;
    border: none;
    outline: none;
`;

export const ApiButton = styled.button`
    flex: 2;
`;

export const P = styled.p`
  width: 100%;
  text-align: center;
  padding: 0;
  margin: 0;
  color: tomato;
  font-size: clamp(0.8em, .8vw, 1em); /* 글자 크기 자동 조정 */
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TabGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 20px;
`;

export const Tab = styled.button`
    padding: 10px;
    background-color: #ddd;
    border: none;
    cursor: pointer;
    &.active {
        background-color: #aaa;
    }
`;