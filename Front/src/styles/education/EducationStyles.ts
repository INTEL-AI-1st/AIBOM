import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
`;

export const Sidebar = styled.div`
  width: 300px;
  padding: 15px;
  box-sizing: border-box;
  border-right: 1px solid #ddd;
  background: #fafafa;
  overflow-y: auto;
`;

export const SidebarHeader = styled.h2`
  margin-top: 0;
`;

export const SearchContainer = styled.div`
  display: flex;
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
  margin-left: 5px;
  padding: 8px 12px;
  border: none;
  background-color: #007aff;
  color: #fff;
  border-radius: 4px;
  font-size: 1em;
  cursor: pointer;
  &:hover {
    background-color: #005bb5;
  }
`;

export const CategoryContainer = styled.div`
  margin-bottom: 20px;
`;

export const CategoryButton = styled.button`
  margin-right: 5px;
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
`;

export const ResultText = styled.div`
  font-size: 14px;
  color: #666;
`;

export const NoResults = styled.p`
  color: #999;
`;

export const RightContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const TopBar = styled.div`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  background-color: #fff;
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const TopBarButton = styled.button``;

export const MapArea = styled.div`
  flex: 2;
  position: relative;
`;

export const InfoWindowContent = styled.div`
  padding: 10px;
  min-width: 200px;
  max-height: 300px;
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