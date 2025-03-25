import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  background: #fff;
  width: 90%;
  max-width: 600px;
  max-height: 95vh;
  overflow-y: auto;
  padding: 10px;
  border-radius: 8px;
  box-sizing: border-box;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

export const CloseButton = styled.button`
  font-size: 1.2rem;
  color: #444;
  background: none;
  border: none;
   &:hover{
    background-color: transparent !important;
   }
`;

export const ModalContent = styled.div`
  padding: 10px 0;
`;