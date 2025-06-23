"use client";

import React, { Suspense, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Logo from "@/components/logo";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSpinner } from "@/components/site/loading-spinner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { PasswordInput } from "@/components/ui/password-input";
import FallbackSpinner from "@/components/site/fallback-spinner";
import { useToast } from "@/hooks/use-toast";

const formSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Page() {
  return (
    <Suspense fallback={<FallbackSpinner />}>
      <ResetPassword />
    </Suspense>
  );
}

function ResetPassword() {
  const t = useTranslations();
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const error = searchParams?.get("error") || null;

  const [pending, setPending] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setPending(true);

    const { error } = await authClient.resetPassword({
      newPassword: data.password,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Password reset successfully",
      });

      router.push("/sign-in");
    }

    setPending(true);
  };

  return (
    <div className="grid w-full grow items-center justify-center px-4 sm:justify-center">
      <Logo className="text-blue-500" />

      <Card className="w-full sm:w-96 bg-white dark:bg-muted/30">
        <CardHeader>
          <CardTitle>{t("FORGOT_PASSWORD.HEADER")}</CardTitle>
          <CardDescription>{t("FORGOT_PASSWORD.DESCRIPTION")}</CardDescription>
        </CardHeader>

        {error === "invalid_token" ? (
          <CardContent className="grid gap-y-4">
            <div className="space-y-4">
              <p className="text-center">
                This password link is invalid or has expired.
              </p>
            </div>
          </CardContent>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="grid gap-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">
                        {t("FORGOT_PASSWORD.ENTER_NEW_PASSWORD")}
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="code">
                        {t("FORGOT_PASSWORD.ENTER_NEW_PASSWORD")}
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
                  <Button type="submit" disabled={pending}>
                    {pending ? <LoadingSpinner /> : t("FORGOT_PASSWORD.RESET")}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Form>
        )}
      </Card>
    </div>
  );
}
