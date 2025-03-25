import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  padding: 0 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  border-bottom: 1px solid #eaeaea;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`;

export const BackButton = styled.div`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 8px;
  color: #333;
`;

export const PageTitle = styled.h1`
  font-size: 20px;
  margin-left: 8px;
`;

export const SaveButton = styled.button`
  background-color: #f2f2f2;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e5e5e5;
  }
`;

export const ContentArea = styled.div`
  display: flex;
  flex-direction: 'column';
  min-height: calc(100vh - 60px);
  background-color: #fff;
`;

export const MainContent = styled.main`
  flex: 2;
  border-right: 1px solid #f0f0f0;
  padding: 20px;
  overflow-y: auto;
`;

export const PreviewSidebar = styled.aside`
  flex: 1;
  padding: 20px;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
`;