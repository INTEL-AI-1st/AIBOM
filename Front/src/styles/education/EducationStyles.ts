import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh; /* height 대신 최소 높이로 설정 */
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

export const Sidebar = styled.div`
  flex: 1;
  padding: 15px;
  box-sizing: border-box;
  border-right: 1px solid #ddd;
  background: #fafafa;
  overflow-y: auto; /* 데스크톱에서는 스크롤 */

  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid #ddd;
    overflow-y: auto;
    max-height: 270px; 
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const SidebarHeader = styled.h2`
  margin-block: 0;
`;

export const SearchContainer = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 15px;
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
`;

export const SearchButton = styled.button`
  padding: 0.6rem 1rem;
  margin-left: 0.5rem;
  background-color: #ffb9b9;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #eea9a9;
  }
`;

export const CategoryContainer = styled.div`
  margin-bottom: 20px;
`;

export const CategoryButton = styled.button`
  margin-right: 5px;
  padding: 0.5rem 0.8rem;
  font-size: 0.9rem;
`;

export const SearchResultList = styled.div``;

interface SearchResultItemProps {
  selected: boolean;
}

export const SearchResultItem = styled.div<SearchResultItemProps>`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? "#e6f7ff" : "#fff")};

  &:hover {
    background-color: ${(props) =>
      props.selected ? "#c9e8ff" : "#f9f9f9"};
  }
`;

export const ResultText = styled.div`
  font-size: 14px;
  color: #666;
`;

export const NoResults = styled.p`
  color: #999;
  text-align: center;
`;

export const RightContainer = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    flex: 1;
  }
`;

export const TopBar = styled.div`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  background-color: #fff;
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const TopBarButton = styled.button`
  padding: 0.5rem 0.8rem;
  border: none;
  background-color: #ffb9b9;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #eea9a9;
  }
`;

export const MapArea = styled.div`
  flex: 2;
  position: relative;

  @media (max-width: 768px) {
    /* 모바일에서는 고정 높이 또는 상대 단위 활용 가능 */
    height: 300px;
  }
`;

export const InfoWindowContent = styled.div`
  padding: 10px;
  width: 300px;
  max-height: 300px;
  overflow-y: auto;
`;

export const InfoWindowTitle = styled.h4`
  margin: 0 0 5px 0;
`;

export const InfoWindowText = styled.div`
  font-size: 14px;
  margin-bottom: 5px;
  color: #666;
`;

export const InfoWindowLink = styled.a`
  color: #1e90ff;
`;

export const OptionContainer = styled.div`
  margin-bottom: 15px;
  font-size: 0.9em;
  color: #555;

  input {
    margin-right: 5px;
  }
`;
