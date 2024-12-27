"use client";

import * as React from "react";
import { useSignUp, useUser } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
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
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { PasswordInput } from "@/components/ui/password-input";

import { formSchema } from "./types";

export default function Page() {
  const t = useTranslations();

  const { user } = useUser();
  const router = useRouter();
  const token = useSearchParams().get("__clerk_ticket");
  const { isLoaded, signUp, setActive } = useSignUp();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // firstName: "",
      // lastName: "",
      password: "",
    },
  });

  React.useEffect(() => {
    if (user?.id) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!token) {
    return <p>No invitation token found.</p>;
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isLoaded) return;

    try {
      if (!token) return null;

      console.log(values);

      const signUpAttempt = await signUp.create({
        strategy: "ticket",
        ticket: token,
        // firstName: values.firstName,
        // lastName: values.lastName,
        password: values.password,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <div className="grid w-full grow items-center justify-center px-4 sm:justify-center">
      <Logo className="text-blue-500" />

      <Card className="w-full sm:w-96">
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
                {/* <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="firstName">
                        Enter first name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="lastName">Enter last name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">Enter password</FormLabel>
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
              {false ? (
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
