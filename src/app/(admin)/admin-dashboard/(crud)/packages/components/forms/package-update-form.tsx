"use client";

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { LoadingSpinner } from "@/components/site/loading-spinner";
import packageFormSchema from "../package-details/schema";
import { useTranslations } from "next-intl";

interface UpdatePackageFormProps {
  form: UseFormReturn<z.infer<typeof packageFormSchema>>;
  onSubmit: (values: z.infer<typeof packageFormSchema>) => Promise<void>;
  onClose: () => void;
}

const UpdatePackageForm: React.FC<UpdatePackageFormProps> = ({ form, onSubmit, onClose }) => {
  // Extract editable features
  const editableFeatures = ["WORKSPACE", "TEAM_MEMBERS"];
  const t = useTranslations();
  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Package ID - Disabled */}
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Package ID</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Package Name - Disabled */}
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Package Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Editable Features */}
        <div className="space-y-2">
          <FormLabel>Editable Features</FormLabel>
          {form.watch("features")?.map((feature, index) => {
            if (!editableFeatures.includes(feature.code)) return null;

            
            return (
              <FormField
                key={feature.code}
                control={form.control}
                name={`features.${index}.maxLimit`} // Access the correct field in features array
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t(`PACKAGE_FEATURES.${feature.code}`)}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        placeholder={`Enter max limit for ${t(`PACKAGE_FEATURES.${feature.code}`)}`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : "Save Changes"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UpdatePackageForm;