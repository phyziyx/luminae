"use client";

import useSWR from "swr";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/site/loading-spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import UpdatePackageForm from "../forms/package-update-form";
import packageFormSchema from "../package-details/schema";
import fetchPackageDetails from "../actions/fetch-package";
import onPackageUpdate from "../actions/update-package";
import React, { useEffect } from "react";

interface UpdatePackageModalProps {
  packageId: string;
  onClose: () => void;
}

const UpdatePackageModal: React.FC<UpdatePackageModalProps> = ({
  packageId,
  onClose,
}) => {
  const { toast } = useToast();

  const {
    data: packageData,
    error,
    isLoading,
  } = useSWR(["packageDetails", packageId], ([, packageId]) =>
    fetchPackageDetails(packageId)
  );

  const form = useForm<z.infer<typeof packageFormSchema>>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: {
      id: "",
      name: "",
      // monthlyPrice: 0,
      features: [],
    },
    mode: "onChange",
  });

  const { reset } = form;

  useEffect(() => {
    if (packageData) {
      reset({
        id: packageData.id,
        name: packageData.name,
        // monthlyPrice: packageData.monthlyPrice,
        features: packageData.features.map((feature) => ({
          id: feature.id,
          code: feature.code,
          maxLimit: feature.maxLimit || 0,
          hasAccess: feature.hasAccess || false,
        })),
      });
    }
  }, [packageData, reset]);

  const onSubmit = async (values: z.infer<typeof packageFormSchema>) => {
    try {
      const response = await onPackageUpdate(values);

      if (response?.error) {
        toast({
          title: "Failed to update package",
          description: response.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Package updated successfully",
          variant: "default",
        });
        onClose(); // Close the modal after successful update
      }
    } catch {
      toast({
        title: "An error occurred while updating the package",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: Failed to load package details.</div>;
  }

  return (
    <UpdatePackageForm
      form={form}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};

export default UpdatePackageModal;