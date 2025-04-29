"use client";

import Link from "next/link";
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
import { useTranslations } from "next-intl";
import Logo from "@/components/logo";
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

const getEmailSchema = () =>
  z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required.")
    .email("Email is invalid");

const formSchema = z.object({
  emailAddress: getEmailSchema(),
  password: z.string().min(8),
  rememberMe: z.boolean(),
});

export default function SignInPage() {
  const [isPending, setPending] = useState(false);

  const router = useRouter();

  const t = useTranslations();

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
      rememberMe: true,
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    await authClient.signIn.email(
      {
        email: data.emailAddress,
        password: data.password,
        rememberMe: data.rememberMe,
      },
      {
        onRequest: () => {
          setPending(true);
        },
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (ctx) => {
          console.error(ctx.error.message);
        },
      }
    );

    setPending(false);
  };

  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center">
      <Logo className="text-blue-500" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((e) => {
            return handleSubmit(e);
          })}
          className="space-y-4"
        >
          <Card className="w-full sm:w-96 bg-white dark:bg-muted/30">
            <CardHeader>
              <CardTitle>{t("SIGN_IN_HEADER")}</CardTitle>
              <CardDescription>{t("SIGN_IN_DESCRIPTION")}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-y-4">
              <div className="grid grid-cols-1 gap-x-4">
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    authClient.signIn.social({
                      provider: "google",
                    });
                  }}
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
              <FormField
                control={form.control}
                name="emailAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("EMAIL")}</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage className="block text-sm text-destructive" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("PASSWORD")}</FormLabel>
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
                  <Link href="/sign-up">{t("DONT_HAVE_AN_ACCOUNT")}</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>

      {/* Choose Strategy */}
      {/* <SignIn.Step name="choose-strategy">
                <Card className="w-full sm:w-96">
                  <CardHeader>
                    <CardTitle>{t("USE_ANOTHER_METHOD")}</CardTitle>
                    <CardDescription>
                      {t("FACING_ISSUES_SIGNING_IN")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-y-4">
                    <SignIn.SupportedStrategy name="email_code" asChild>
                      <Button
                        type="button"
                        variant="link"
                        disabled={isGlobalLoading}
                      >
                        {t("EMAIL_CODE")}
                      </Button>
                    </SignIn.SupportedStrategy>
                    <SignIn.SupportedStrategy name="password" asChild>
                      <Button
                        type="button"
                        variant="link"
                        disabled={isGlobalLoading}
                      >
                        {t("PASSWORD")}
                      </Button>
                    </SignIn.SupportedStrategy>
                  </CardContent>
                  <CardFooter>
                    <div className="grid w-full gap-y-4">
                      <SignIn.Action navigate="previous" asChild>
                        <Button disabled={isGlobalLoading}>
                          <Clerk.Loading>
                            {(isLoading) => {
                              return isLoading ? (
                                <Icons.spinner className="size-4 animate-spin" />
                              ) : (
                                t("GO_BACK")
                              );
                            }}
                          </Clerk.Loading>
                        </Button>
                      </SignIn.Action>
                    </div>
                  </CardFooter>
                </Card>
              </SignIn.Step> */}

      {/* Verification */}
      {/* <SignIn.Step name="verifications">
                <SignIn.Strategy name="password">
                  <Card className="w-full sm:w-96">
                    <CardHeader>
                      <CardTitle>{t("CHECK_YOUR_EMAIL")}</CardTitle>
                      <CardDescription>
                        {t("USE_VERIFICATION_CODE")}
                      </CardDescription>
                      <p className="text-sm text-muted-foreground">
                        {t("WELCOME_BACK")} <SignIn.SafeIdentifier />
                      </p>
                    </CardHeader>
                    <CardContent className="grid gap-y-4">
                      <Clerk.Field name="password" className="space-y-2">
                        <Clerk.Label asChild>
                          <Label>{t("PASSWORD")}</Label>
                        </Clerk.Label>
                        <Clerk.Input type="password" asChild>
                          <PasswordInput required />
                        </Clerk.Input>
                        <Clerk.FieldError className="block text-sm text-destructive" />
                      </Clerk.Field>
                    </CardContent>
                    <CardFooter>
                      <div className="grid w-full gap-y-4">
                        <SignIn.Action submit asChild>
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
                        </SignIn.Action>
                        <SignIn.Action navigate="choose-strategy" asChild>
                          <Button type="button" size="sm" variant="link">
                            {t("USE_ANOTHER_METHOD")}
                          </Button>
                        </SignIn.Action>
                      </div>
                    </CardFooter>
                  </Card>
                </SignIn.Strategy>

                <SignIn.Strategy name="email_code">
                  <Card className="w-full sm:w-96">
                    <CardHeader>
                      <CardTitle>{t("CHECK_YOUR_EMAIL")}</CardTitle>
                      <CardDescription>
                        {t("USE_VERIFICATION_CODE")}
                      </CardDescription>
                      <p className="text-sm text-muted-foreground">
                        {t("WELCOME_BACK")} <SignIn.SafeIdentifier />
                      </p>
                    </CardHeader>
                    <CardContent className="grid gap-y-4">
                      <Clerk.Field name="code">
                        <Clerk.Label className="sr-only">
                          {t("EMAIL_VERIFICATION_CODE")}
                        </Clerk.Label>
                        <div className="grid gap-y-2 items-center justify-center">
                          <div className="flex justify-center text-center">
                            <Clerk.Input
                              type="otp"
                              autoSubmit
                              className="flex justify-center has-[:disabled]:opacity-50"
                              render={({ value, status }) => {
                                return (
                                  <div
                                    data-status={status}
                                    className="relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md data-[status=selected]:ring-1 data-[status=selected]:ring-ring data-[status=cursor]:ring-1 data-[status=cursor]:ring-ring"
                                  >
                                    {value}
                                  </div>
                                );
                              }}
                            />
                          </div>
                          <Clerk.FieldError className="block text-sm text-destructive text-center" />
                          <SignIn.Action
                            asChild
                            resend
                            className="text-muted-foreground"
                            fallback={({ resendableAfter }) => (
                              <Button variant="link" size="sm" disabled>
                                {t("DIDNT_RECEIVE_CODE_RESEND")} (
                                <span className="tabular-nums">
                                  {resendableAfter}
                                </span>
                                )
                              </Button>
                            )}
                          >
                            <Button variant="link" size="sm">
                              {t("DIDNT_RECEIVE_CODE_RESEND")}
                            </Button>
                          </SignIn.Action>
                        </div>
                      </Clerk.Field>
                    </CardContent>
                    <CardFooter>
                      <div className="grid w-full gap-y-4">
                        <SignIn.Action submit asChild>
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
                        </SignIn.Action>
                        <SignIn.Action navigate="choose-strategy" asChild>
                          <Button size="sm" variant="link">
                            {t("USE_ANOTHER_METHOD")}
                          </Button>
                        </SignIn.Action>
                      </div>
                    </CardFooter>
                  </Card>
                </SignIn.Strategy>
              </SignIn.Step> */}
    </div>
  );
}
