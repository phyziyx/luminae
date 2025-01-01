"use client";

import useSWR from "swr";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/site/loading-spinner";
import { z } from "zod";
import UpdateUserForm from "../forms/update-user-form";
import formSchema from "../user-details/schema";
import fetchUserDetails from "../actions/fetch-user";
import onUserUpdate from "../actions/user-update";
import React from "react";
import { useTranslations } from "next-intl";

interface UpdateUserModalProps {
  userId: string;
  onClose: () => void;
}

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({ userId, onClose, }) => {
  const { toast } = useToast();

  const {
    data: userData,
    error,
    isLoading,
  } = useSWR(["userDetails", userId], ([, userId]) => fetchUserDetails(userId));

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await onUserUpdate(values);

      toast({
        title: response?.error || "User information saved successfully",
        variant: response?.error ? "destructive" : "default",
      });
      onClose();
    } catch {
      toast({
        title: "An error occurred while saving the user information",
        variant: "destructive",
      });
    }
  };

  const t = useTranslations();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !userData) {
    return <div>{t("ERROR_MESSAGES.FAILED_TO_LOAD_USER_DETAILS")}</div>;
  }

  return (
    <UpdateUserForm
      onSubmit={onSubmit}
      userData={userData}
    />
  );
};

export default UpdateUserModal;
