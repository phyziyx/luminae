"use client";

import useSWR from "swr";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/site/loading-spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import UpdateAgencyForm from "../forms/update-agency-form";
import formSchema from "@/app/(dashboard)/components/agency-details/schema";
import fetchAgencyDetails from "../actions/agency-fetch";
import onAgencyUpdate from "../actions/agency-update";
import React from "react";

interface UpdateAgencyModalProps {
  agencyId: string;
}

const UpdateAgencyModal: React.FC<UpdateAgencyModalProps> = ({ agencyId }) => {
  const { toast } = useToast();

  const { data: agencyData, error, isLoading } = useSWR(
    ["agency", agencyId], 
    ([, agencyId]) => fetchAgencyDetails(agencyId)
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
      companyEmail: "",
      companyPhone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    }, // Provide default values for all fields
    mode: "onChange",
  });

  const { reset } = form;

  // Update form values when agencyData changes
  React.useEffect(() => {
    if (agencyData) {
      reset(agencyData);
    }
  }, [agencyData, reset]);

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

  if (error) {
    return <div>Error: Failed to load agency details.</div>;
  }

  return (
    <UpdateAgencyForm
      form={form}
      onSubmit={onSubmit}
      isLoading={isLoading}
    />
  );
};

export default UpdateAgencyModal;