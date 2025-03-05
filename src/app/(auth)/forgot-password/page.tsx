"use client";

import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { formSchema } from "./types";
import { authClient } from "@/lib/auth-client";

export default function Page() {
  const t = useTranslations();
  const [pending, setPending] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setPending(true);

    const { error } = await authClient.forgetPassword({
      email: data.email,
      redirectTo: "/reset-password",
    });

    if (error) {
      //
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid gap-y-4">
              <div className="grid w-full gap-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">
                        {t("FORGOT_PASSWORD.PLEASE_PROVIDE_EMAIL")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="e.g john@doe.com"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <div className="grid w-full gap-y-4">
                <Button type="submit" disabled={pending}>
                  {pending ? (
                    <LoadingSpinner />
                  ) : (
                    t("FORGOT_PASSWORD.SEND_RESET_CODE")
                  )}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
