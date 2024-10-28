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
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { PasswordInput } from "@/components/ui/password-input";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function Page() {
  const t = useTranslations();

  const { user } = useUser();
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
    },
  });

  // Handle signed-in users visiting this page
  // This will also redirect the user once they finish the sign-up process
  React.useEffect(() => {
    if (user?.id) {
      router.push("/");
    }
  }, [user]);

  // Get the token from the query params
  const token = useSearchParams().get("__clerk_ticket");

  // If there is no invitation token, restrict access to this page
  if (token) {
    return <p>No invitation token found.</p>;
  }

  // Handle submission of the sign-up form
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isLoaded) return;

    try {
      if (!token) return null;

      // Create a new sign-up with the supplied invitation token.
      // Make sure you're also passing the ticket strategy.
      // After the below call, the user's email address will be
      // automatically verified because of the invitation token.
      const signUpAttempt = await signUp.create({
        strategy: "ticket",
        ticket: token,
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password,
      });

      // If the sign-up was completed, set the session to active
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
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
          <CardTitle>{t("CREATE_ACCOUNT_HEADER")}</CardTitle>
          <CardDescription>{t("CREATE_ACCOUNT_DESCRIPTION")}</CardDescription>
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
                />

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
            <Button type="submit">
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
