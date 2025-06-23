"use client";

import * as React from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Logo from "@/components/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { PasswordInput } from "@/components/ui/password-input";
import { Input } from "@/components/ui/input";
import {
  invitationRegistrationSchema,
  InvitationRegistrationSchema,
} from "@/lib/forms";
import onAcceptInvite from "@/actions/accept-invitation";
import { toast } from "@/hooks/use-toast";

export default function Page() {
  const t = useTranslations();

  const router = useRouter();
  const token = useSearchParams()?.get("invite");

  const form = useForm<InvitationRegistrationSchema>({
    resolver: zodResolver(invitationRegistrationSchema),
    defaultValues: {
      name: "",
      password: "",
      invitationId: token || "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  React.useEffect(() => {
    if (!token) {
      router.push("/sign-in");
    } else {
      form.reset({
        invitationId: token || "",
      });
    }
  }, []);

  if (!token) {
    return <p>No invitation token found.</p>;
  }

  const onSubmit = async (values: InvitationRegistrationSchema) => {
    try {
      if (!token) return null;

      const response = await onAcceptInvite(values);

      toast({
        title: response?.error || "Invitation accepted!",
        variant: response?.error ? "destructive" : "default",
      });

      router.push("/dashboard");
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <div className="grid w-full grow items-center justify-center px-4 sm:justify-center">
      <Logo className="text-blue-500" />

      <Card className="w-full sm:w-96 bg-white dark:bg-muted/30">
        <CardHeader>
          <CardTitle>{t("INVITATION_HEADER")}</CardTitle>
          <CardDescription>{t("INVITATION_DESCRIPTION")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-y-4">
          <div className="grid w-full gap-y-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">{t("FULL_NAME")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">{t("PASSWORD")}</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </CardContent>
        <CardFooter>
          <div className="grid w-full gap-y-4">
            <Button onClick={form.handleSubmit(onSubmit)} type="button">
              {isLoading ? (
                <Icons.spinner className="size-4 animate-spin" />
              ) : (
                t("CONTINUE")
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
