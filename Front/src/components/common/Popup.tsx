import React, { createContext, useState } from "react";
import { 
  Popup, PopupHeader, PopupImage, PopupMessage, 
  PopupOverlay, Button, ButtonGroup 
} from "@styles/common/PopupStyles";

interface PopupState {
  message?: string;
  header?: string;
  url?: string;
  confirm?: boolean;
  onConfirm?: (confirmed: boolean) => void;
  content?: React.ReactNode;
}

interface PopupContextType {
  showAlert: (popup: { message: string; header?: string; url?: string }) => Promise<void>;
  showConfirm: (popup: { message: string; header?: string }) => Promise<boolean>;
  showPopup: (popup: { header?: string; content: React.ReactNode }) => void;
  closePopup: () => void;
}

export const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const PopupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [popup, setPopup] = useState<PopupState | null>(null);
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);

  // useEffect(() => {
  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     if (event.key === "Enter" && popup) {
  //       popup.onConfirm?.(true);
  //     }
  //   };
  //   if (popup) {
  //     document.addEventListener("keydown", handleKeyDown);
  //   }
  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, [popup]);
    
  const showAlert = ({ message, header = "", url = "" }: { message: string; header?: string; url?: string }): Promise<void> => {
    return new Promise((resolve) => {
      setPopup({
        message,
        header,
        url,
        confirm: false,
        onConfirm: () => {
          resolve();
          setPopup(null);
          setIsAlertVisible(false);
        },
      });
      setIsAlertVisible(true);
    });
  };

  const showConfirm = ({ message, header = "" }: { message: string; header?: string }): Promise<boolean> => {
    return new Promise((resolve) => {
      setPopup({
        message,
        header,
        confirm: true,
        onConfirm: (confirmed) => {
          resolve(confirmed);
          setPopup(null);
        },
      });
    });
  };

  const showPopup = ({ header, content }: { header?: string; content: React.ReactNode }): Promise<string | null> => {
    return new Promise((resolve) => {
      setPopup({
        header,
        content: React.isValidElement(content)
          ? React.cloneElement(content as React.ReactElement<{ onClose?: (value: string | null) => void }>, {
              onClose: (value: string | null) => {
                resolve(value);
                setPopup(null);
              },
            })
          : content,
      });
    });
  };

  const closePopup = () => {
    setPopup(null);
    setIsAlertVisible(false);
  };

  return (
    <PopupContext.Provider value={{ showAlert, showConfirm, showPopup, closePopup }}>
      {children}
      {popup && (
        <PopupOverlay>
          <Popup>
            {popup.url && <PopupImage src={popup.url} alt="Popup icon" />}
            {popup.header && <PopupHeader>{popup.header}</PopupHeader>}
            {popup.content ? (
              popup.content
            ) : (
              <PopupMessage dangerouslySetInnerHTML={{ __html: popup.message || "" }} />
            )}
            {!popup.content && popup.confirm && (
              <ButtonGroup>
                <Button onClick={() => popup.onConfirm?.(true)}>확인</Button>
                <Button onClick={() => popup.onConfirm?.(false)}>취소</Button>
              </ButtonGroup>
            )}
            {!popup.content && !popup.confirm && isAlertVisible && (
              <Button onClick={() => popup.onConfirm?.(true)}>돌아가기</Button>
            )}
          </Popup>
        </PopupOverlay>
      )}
    </PopupContext.Provider>
  );
};
