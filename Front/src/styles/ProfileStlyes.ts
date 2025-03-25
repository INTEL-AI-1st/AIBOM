import styled from "styled-components";


// 헤더
export const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 2.5em;
  font-weight: 900;
  padding: 20px;
  margin-block: 20px;
  background-color: #fff;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

export const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 1px solid #ddd;
  margin-right: 20px;
  color: #aaa;
`;

export const ProfileImg = styled.img`
  object-fit: cover;
  border-radius: 50%;
  width: 100%;
  height: 100%;
`;

export const InfoContainer = styled.div``;

export const SubInfo = styled.div`
  font-size: 0.8rem;
  font-weight: 400; 
  color: #aaa;
`

export const Button = styled.button`
  padding: 10px 20px;
  font-size: 15px;
  border-radius: 5px;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.8;
    pointer-events: none;
  }
`;

export const BioWrapper = styled.div`
  width: 100%;
  padding: 10px 20px;
    border: 1px solid #ddd;
  text-align: left;
`

// 바디

export const Body = styled.div`
  position: relative;
  padding: 20px;
  width: 100%;
`;

export const BodyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;  
  border-bottom: 1px solid #ddd;
  margin-bottom: 15px;
`;

const BodyHeaderLine = styled.div`
  display: flex;
`

export const HeaderLeft = styled(BodyHeaderLine)`
  align-items: end;
`;

export const HeaderRight = styled(BodyHeaderLine)`
  align-items: center;
  flex-direction: column;
`;

export const Title = styled.h2`
  margin: 0;
  margin-right: 5px;
  font-size: 1.8em;
  color: #333;
`;

export const Sorting = styled.p<{ showSortOptions: boolean }>`
  cursor: pointer;
  font-size: 0.9em;
  padding: 10px;
  margin: 0;
  background-color: ${(props) => (props.showSortOptions ? "#ddd" : "transparent")};
  position: relative;
`;

export const SortOptions = styled.div`
  position: absolute;
  top: 94px;
  right: 10px;
  border-top: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  align-items: flex-start;  /* 왼쪽 정렬 */
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 999;
  padding: 5px 10px;
`;


export const SortButton = styled.button`
  padding: 10px;
  width: 100%;
  border: none;
  background: none;
  color: #444;
  font-size: 10px;
  cursor: pointer;
  margin-bottom: 10px;
  border-radius: 4px;
  font-size: 1em;
  &:hover {
    background: #ddd !important;
  }
  &:last-child {
    margin-bottom: 0;
  }
`;

export const ChildContainer = styled.div`
  position: relative;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

export const ChildHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center; 
  margin-bottom: 8px; 
`;

export const ButtonForm = styled.div`
  display: flex;
  gap: 8px;
`;

export const GrayButton = styled.button`
  background: #ddd;
  border: none;
  display: flex;
  border-radius: 5px;
  padding: 10px 14px;
  gap: 6px;
  color: #666;
  font-size: 14px;

  svg {
    font-size: 14px; 
  }

  &:hover{
    background: #aaa;
  }
`;

export const ChildBody = styled.div`
  display: flex;
`

export const AvatarContainer = styled.div`
  margin-right: 5px;
`

export const InfoForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-size: 1.2rem;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const InfoLabel = styled.label`
  min-width: 120px;
  font-weight: 500;
`;

export const InfoInput = styled.input`
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 6px 10px;
  font-size: 1.1rem;
  width: 160px;
`;

export const RadioGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
`;

export const RadioLabel = styled.label`
  font-size: 1.1rem;
  align-items: center;
  cursor: pointer;
`;

export const GenderRadio = styled.input.attrs({ type: 'radio' })`
  margin-right: 6px;
  accent-color: #007bff;
  cursor: pointer;
`;