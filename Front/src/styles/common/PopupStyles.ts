import styled from 'styled-components';

export const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const Popup = styled.div`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  min-width: 300px;
  max-width: 500px;
  text-align: center;
`;

export const PopupHeader = styled.h2`
  margin: 0 0 10px 0;
  font-size: 36px;
  color: #333;
`;

export const PopupMessage = styled.p`
  margin: 0 0 20px 0;
  font-size: clamp(16px, 2vw, 24px);
  color: #555;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

export const PopupImage = styled.img`
  max-width: 100px;
  margin: 10px 0;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
`;

export const Button = styled.button`
  padding: 10px 20px;
  font-size: 24px;
  border-radius: 15px;
`;