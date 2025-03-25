import React, { ReactNode } from "react";
import { CloseButton, ModalContainer, ModalContent, ModalHeader, ModalOverlay } from "@styles/common/ModalStyles";
import { useModalContext } from "@context/ModalContext";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, children }) => {
  const { closeModal } = useModalContext();
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <h2>{title || "모달 제목"}</h2>
          <CloseButton onClick={closeModal}>X</CloseButton>
        </ModalHeader>
        <ModalContent>{children}</ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;
