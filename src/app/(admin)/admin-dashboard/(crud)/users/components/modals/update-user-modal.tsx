"use client";

import useSWR from "swr";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/site/loading-spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import UpdateUserForm from "../forms/update-user-form";
import formSchema from "../user-details/schema";
import fetchUserDetails from "../actions/fetch-user";
import onUserUpdate from "../actions/user-update";
import React, { useEffect } from "react";

interface UpdateUserModalProps {
  userId: string;
}

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({ userId }) => {
  const { toast } = useToast();

  const { data: userData, error, isLoading } = useSWR(
    ["userDetails", userId],
    ([, userId]) => fetchUserDetails(userId)
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
      avatarUrl: "",
      email: "",
    }, // Default values for all fields
    mode: "onChange",
  });

  const { reset } = form;

  useEffect(() => {
    if (userData) {
      reset(userData);
    }
  }, [userData, reset]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await onUserUpdate(values);

      toast({
        title: response?.error || "User information saved successfully",
        variant: response?.error ? "destructive" : "default",
      });
    } catch {
      toast({
        title: "An error occurred while saving the user information",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: Failed to load user details.</div>;
  }

  return (
    <UpdateUserForm
      form={form}
      onSubmit={onSubmit}
      isLoading={isLoading}
    />
  );
};

export default UpdateUserModal;