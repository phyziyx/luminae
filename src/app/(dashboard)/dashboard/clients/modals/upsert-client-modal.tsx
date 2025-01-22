"use client";

import useSWR from "swr";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/site/loading-spinner";
import { z } from "zod";
import formSchema from "../client-details/schema";
import fetchClientDetails from "../actions/client-fetch";
import onClientUpsert from "../actions/client-upsert";
import React from "react";
import UpsertClientForm from "../forms/upsert-client-form";
// import { useTranslations } from "next-intl";

interface UpsertClientModalProps {
  clientId: string;
  onClose: () => void;
  create: boolean;
}

const UpsertClientModal: React.FC<UpsertClientModalProps> = ({
  clientId,
  onClose,
}) => {
  const { toast } = useToast();

  // const t = useTranslations();

  const {
    data: clientData,
    error,
    isLoading,
  } = useSWR(clientId ? ["client", clientId] : null, ([, clientId]) =>
    fetchClientDetails(clientId)
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await onClientUpsert(values);

      toast({
        title: response?.error || "Client information saved successfully",
        variant: response?.error ? "destructive" : "default",
      });
      onClose();
    } catch {
      toast({
        title: "An error occurred while saving the client information.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error, Failed to load client details</div>;
  } else if (error || (!clientData && clientId)) {
    return <div>Loading...</div>;
  }

  return (
    <UpsertClientForm
      onSubmit={onSubmit}
      clientData={{
        name: clientData?.name || "",
        email: clientData?.email || "",
        phone: clientData?.phone || "",
        city: clientData?.city || "",
        state: clientData?.state || "",
        country: clientData?.country || "",
        status: clientData?.status || "LEAD",
        id: clientData?.id || "",
      }}
    />
  );
};

export default UpsertClientModal;
