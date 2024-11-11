"use client";

import useIsMounted from "@/hooks/use-mounted";
import React, { ReactNode, useCallback } from "react";

interface ModalProviderProps {
  children: React.ReactNode;
}

interface ModalContextType {
  isOpen: boolean;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
}

const ModalContext = React.createContext<ModalContextType | undefined>(
  undefined
);

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const isMounted = useIsMounted();

  const [isOpen, setIsOpen] = React.useState(false);
  const [modelContent, setModelContent] = React.useState<ReactNode | null>(
    null
  );

  const openModal = useCallback((content: ReactNode) => {
    setIsOpen(true);
    setModelContent(content);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModelContent(null);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      {isOpen && modelContent}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
