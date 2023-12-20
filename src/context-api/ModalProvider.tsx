import React, {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from "react";

export interface ModalContextType {
  showModal: (bodyContent: React.ReactNode, lock?: boolean) => void;
  hideModal: () => void;
  content: ReactNode;
  show: boolean;
}

export const ModalContext = React.createContext<ModalContextType | null>(null);

function ModalProvider({ children }: PropsWithChildren<{}>) {
  const [content, setContent] = useState<ReactNode>(null);
  const [show, setShow] = useState(false);
  const [lock, setLock] = useState(true);

  useEffect(() => {
    if (show && lock) {
      document.body.style.overflowY = "hidden";
    }

    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [show, lock]);

  const showModal = (bodyContent: ReactNode, lock = true) => {
    setShow(true);
    setLock(lock);
    setContent(bodyContent);
  };

  const hideModal = () => {
    setShow(false);
    setContent(null);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal, content, show }}>
      {children}
    </ModalContext.Provider>
  );
}

export default ModalProvider;
