// ModalContext.tsx
import React, { createContext, useContext } from "react";

interface ModalContextType {
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }
  return context;
};

interface ModalProviderProps {
  children: React.ReactNode;
  onClose: () => void;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children, onClose }) => {
  return (
    <ModalContext.Provider value={{ closeModal: onClose }}>
      {children}
    </ModalContext.Provider>
  );
};
