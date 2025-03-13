"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import Logo from "@/components/logo";
import { PasswordInput } from "@/components/ui/password-input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";

const getNameSchema = () =>
  z
    .string({
      required_error: "Name is required",
    })
    .min(1, "Name is required")
    .max(64, "Name must be less than 64 characters.");

const getEmailSchema = () =>
  z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required.")
    .email("Email is invalid");

const formSchema = z
  .object({
    name: getNameSchema(),
    emailAddress: getEmailSchema(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignUpPage() {
  const [isPending, setPending] = useState(false);

  const t = useTranslations();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      emailAddress: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const { data: result, error } = await authClient.signUp.email(
      {
        email: data.emailAddress,
        password: data.password,
        name: data.name,
        callbackURL: "/dashboard",
      },
      {
        onRequest: () => {
          setPending(true);
        },
        onError: (ctx) => {
          console.error("Signup error:", ctx.error.message);
          toast({
            title: "Signup error",
            description: ctx.error.message || "",
            variant: "destructive",
          });
        },
        onSuccess: () => {
          console.log("Signup success");
          toast({
            title: "Signup success",
            description: "success",
          });

          redirect("/dashboard");
        },
      }
    );

    console.log("Signup data:", result);
    console.log("Signup error:", error);

    setPending(false);
  };

  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center">
      <Logo className="text-blue-500" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <Card className="w-full sm:w-96 bg-white dark:bg-muted/30">
            <CardHeader>
              <CardTitle>{t("CREATE_ACCOUNT_HEADER")}</CardTitle>
              <CardDescription>
                {t("CREATE_ACCOUNT_DESCRIPTION")}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-y-4">
              <div className="grid grid-cols-1 gap-x-4">
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Icons.spinner className="size-4 animate-spin" />
                  ) : (
                    <>
                      <Icons.google className="mr-2 size-4" />
                      {t("GOOGLE")}
                    </>
                  )}
                </Button>
              </div>
              <p className="flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                or
              </p>
              <div className="flex flex-row gap-x-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{t("FULL_NAME")}</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage className="block text-sm text-destructive" />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="emailAddress"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t("EMAIL")}</FormLabel>
                    <FormControl>
                      <Input type="email" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage className="block text-sm text-destructive" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t("PASSWORD")}</FormLabel>
                    <FormControl>
                      <PasswordInput disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage className="block text-sm text-destructive" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t("CONFIRM_PASSWORD")}</FormLabel>
                    <FormControl>
                      <PasswordInput disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage className="block text-sm text-destructive" />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <div className="grid w-full gap-y-4">
                <Button disabled={isPending}>
                  {isPending ? (
                    <Icons.spinner className="size-4 animate-spin" />
                  ) : (
                    t("CONTINUE")
                  )}
                </Button>
                <Button variant="link" size="sm" asChild>
                  <Link href="/sign-in">{t("ALREADY_HAVE_AN_ACCOUNT")}</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>

      {/* Verification */}
      {/* <SignUp.Step name="verifications">
        <SignUp.Strategy name="email_code">
          <Card className="w-full sm:w-96">
            <CardHeader>
              <CardTitle>{t("VERIFY_EMAIL")}</CardTitle>
              <CardDescription>{t("VERIFICATION_EMAIL_SENT")}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-y-4">
              <div className="grid items-center justify-center gap-y-2">
                <Clerk.Field name="code" className="space-y-2">
                  <Clerk.Label className="sr-only">{t("EMAIL")}</Clerk.Label>
                  <div className="flex justify-center text-center">
                    <Clerk.Input
                      type="otp"
                      className="flex justify-center has-[:disabled]:opacity-50"
                      autoSubmit
                      render={({ value, status }) => {
                        return (
                          <div
                            data-status={status}
                            className={cn(
                              "relative flex size-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
                              {
                                "z-10 ring-2 ring-ring ring-offset-background":
                                  status === "cursor" || status === "selected",
                              }
                            )}
                          >
                            {value}
                            {status === "cursor" && (
                              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <div className="animate-caret-blink h-4 w-px bg-foreground duration-1000" />
                              </div>
                            )}
                          </div>
                        );
                      }}
                    />
                  </div>
                  <Clerk.FieldError className="block text-center text-sm text-destructive" />
                </Clerk.Field>
                <SignUp.Action
                  asChild
                  resend
                  className="text-muted-foreground"
                  fallback={({ resendableAfter }) => (
                    <Button variant="link" size="sm" disabled>
                      {t("DIDNT_RECEIVE_CODE_RESEND")}(
                      <span className="tabular-nums">{resendableAfter}</span>)
                    </Button>
                  )}
                >
                  <Button type="button" variant="link" size="sm">
                    {t("DIDNT_RECEIVE_CODE_RESEND")}
                  </Button>
                </SignUp.Action>
              </div>
            </CardContent>
            <CardFooter>
              <div className="grid w-full gap-y-4">
                <SignUp.Action submit asChild>
                  <Button disabled={isGlobalLoading}>
                    <Clerk.Loading>
                      {(isLoading) => {
                        return isLoading ? (
                          <Icons.spinner className="size-4 animate-spin" />
                        ) : (
                          t("CONTINUE")
                        );
                      }}
                    </Clerk.Loading>
                  </Button>
                </SignUp.Action>
              </div>
            </CardFooter>
          </Card>
        </SignUp.Strategy>
      </SignUp.Step> */}
    </div>
  );
}
