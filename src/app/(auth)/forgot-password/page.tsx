"use client";

import React, { useState } from "react";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
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
import { PasswordInput } from "@/components/ui/password-input";
import { LoadingSpinner } from "@/components/site/loading-spinner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { formSchema } from "./types";

export default function Page() {
  const t = useTranslations();

  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  if (!isLoaded) {
    return null;
  }

  // If the user is already signed in,
  // redirect them to the home page
  //   if (isSignedIn) {
  //     router.push("/");
  //   }

  // Send the password reset code to the user's email
  async function create(e: React.FormEvent) {
    e.preventDefault();

    await signIn
      ?.create({
        strategy: "reset_password_email_code",
        identifier: form.getValues("email"),
      })
      .then(() => {
        setSuccessfulCreation(true);
        setError("");
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  // Reset the user's password.
  // Upon successful reset, the user will be
  // signed in and redirected to the home page
  async function reset(e: React.FormEvent) {
    e.preventDefault();

    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: form.getValues("code"),
        password: form.getValues("password"),
      })
      .then((result) => {
        // Check if 2FA is required
        if (result.status === "needs_second_factor") {
          setSecondFactor(true);
          setError("");
        } else if (result.status === "complete") {
          // Set the active session to
          // the newly created session (user is now signed in)
          setActive({ session: result.createdSessionId });
          setError("");
        } else {
          console.log(result);
        }
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  const onSubmit = (values: React.FormEvent) => {
    if (!successfulCreation) {
      create(values);
    } else {
      reset(values);
    }
  };

  return (
    <div className="grid w-full grow items-center justify-center px-4 sm:justify-center">
      <Logo className="text-blue-500" />

      <Card className="w-full sm:w-96">
        <CardHeader>
          <CardTitle>{t("FORGOT_PASSWORD.HEADER")}</CardTitle>
          <CardDescription>{t("FORGOT_PASSWORD.DESCRIPTION")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-y-4">
          <div className="grid w-full gap-y-4">
            <Form {...form}>
              <form onSubmit={onSubmit}>
                {!successfulCreation ? (
                  <>
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
                          {error ? (
                            <FormMessage>{error}</FormMessage>
                          ) : (
                            <FormMessage />
                          )}
                        </FormItem>
                      )}
                    />
                  </>
                ) : (
                  <>
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
                              type="password"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="code">
                            {t("FORGOT_PASSWORD.ENTER_RESET_CODE")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                          {error ? (
                            <FormMessage>{error}</FormMessage>
                          ) : (
                            <FormMessage />
                          )}
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {secondFactor && (
                  <FormMessage>
                    {t("FORGOT_PASSWORD.SECOND_FA_REQUIRED")}
                  </FormMessage>
                )}
              </form>
            </Form>
          </div>
        </CardContent>
        <CardFooter>
          <div className="grid w-full gap-y-4">
            <Button onClick={onSubmit} type="button">
              {false ? (
                <LoadingSpinner />
              ) : !successfulCreation ? (
                t("FORGOT_PASSWORD.SEND_RESET_CODE")
              ) : (
                t("FORGOT_PASSWORD.RESET")
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
