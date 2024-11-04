"use client";

import React from "react";
import { useModal } from "@/providers/modal-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

type CustomModalProps = {
  title: string;
  caption: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

const CustomModal = ({
  title,
  caption,
  children,
  defaultOpen,
}: CustomModalProps) => {
  const { isOpen, closeModal } = useModal();

  return (
    <Dialog open={isOpen || defaultOpen} onOpenChange={closeModal}>
      <DialogContent className="md:h-fit h-screen sm:max-w-[425px] bg-muted dark:bg-muted/90">
        <DialogHeader className="text-left">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription>{caption}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
