"use client";

import { useTranslations } from "next-intl";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSpinner } from "@/components/site/loading-spinner";
import { PasswordInput } from "@/components/ui/password-input";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { changePasswordSchema, ChangePasswordSchema } from "@/lib/forms";
import onPasswordUpdate from "@/actions/change-password";
import { useForm } from "react-hook-form";

export default function ChangePassword() {
  const t = useTranslations();

  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    },
  });

  const isLoading = form.formState.isLoading;

  const onSubmit = async (data: ChangePasswordSchema) => {
    try {
      const response = await onPasswordUpdate(data);

      if (response?.error) {
        toast({
          title: "Failed to update password",
          description: response.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password was updated successfully",
          variant: "default",
        });
      }
    } catch {
      toast({
        title: "An error occurred while updating the password",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="grid gap-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="password">
                  {t("CHANGE_PASSWORD.ENTER_CURRENT_PASSWORD")}
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage className="block text-sm text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="new-password">
                  {t("CHANGE_PASSWORD.ENTER_NEW_PASSWORD")}
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage className="block text-sm text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPasswordConfirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="new-password">
                  {t("CHANGE_PASSWORD.ENTER_NEW_PASSWORD_CONFIRM")}
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage className="block text-sm text-destructive" />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter>
          <div className="grid w-full gap-y-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <LoadingSpinner /> : t("CHANGE_PASSWORD.CHANGE")}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Form>
  );
}
