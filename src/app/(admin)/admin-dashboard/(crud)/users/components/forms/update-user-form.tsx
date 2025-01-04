"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { LoadingSpinner } from "@/components/site/loading-spinner";
import userFormSchema from "../user-details/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import formSchema from "../user-details/schema";

interface UpdateUserFormProps {
  onSubmit: (values: z.infer<typeof userFormSchema>) => Promise<void>;
  userData: z.infer<typeof userFormSchema>;
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({
  onSubmit,
  userData,
}) => {
  const t = useTranslations();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      avatarUrl: userData.avatarUrl,
      email: userData.email,
    },
    mode: "onChange",
  });

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("FORMS.ID")}</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-row gap-x-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("FIRSTNAME")}</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("LASTNAME")}</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>{t("FORMS.AVATAR")}</Label>
          <Avatar>
            <AvatarImage src={form.getValues().avatarUrl} />
            <AvatarFallback>{form.getValues().firstName}</AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("FORMS.EMAIL")}</FormLabel>
                <FormControl>
                  <Input {...field} required disabled />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : t("BUTTONS.SAVE_CHANGES")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UpdateUserForm;
