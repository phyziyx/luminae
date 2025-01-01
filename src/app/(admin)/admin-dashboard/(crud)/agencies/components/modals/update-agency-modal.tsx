"use client";

import useSWR from "swr";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/site/loading-spinner";
import { z } from "zod";
import UpdateAgencyForm from "../forms/update-agency-form";
import formSchema from "@/app/(dashboard)/components/agency-details/schema";
import fetchAgencyDetails from "../actions/agency-fetch";
import onAgencyUpdate from "../actions/agency-update";
import React from "react";
import { useTranslations } from "next-intl";

interface UpdateAgencyModalProps {
  agencyId: string;
}

const UpdateAgencyModal: React.FC<UpdateAgencyModalProps> = ({ agencyId }) => {
  const { toast } = useToast();

  const t = useTranslations();

  const { data: agencyData, error, isLoading } = useSWR(
    ["agency", agencyId], 
    ([, agencyId]) => fetchAgencyDetails(agencyId)
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await onAgencyUpdate(values);

      toast({
        title: response?.error || "Agency information saved successfully",
        variant: response?.error ? "destructive" : "default",
      });
    } catch {
      toast({
        title: "An error occurred while saving the agency information.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !agencyData) {
    return <div>{t("ERROR_MESSAGES.FAILED_TO_LOAD_AGENCY_DETAILS")}</div>;
  }

  return (
    <UpdateAgencyForm
      onSubmit={onSubmit}
      agencyData={agencyData}
    />
  );
};

export default UpdateAgencyModal;