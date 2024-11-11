"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Logo from "../logo";
import { useTranslations } from "next-intl";

const formSchema = z.object({
  name: z.string().min(3, "This field is required.").max(64, "Too long."),
  email: z
    .string()
    .email("This is not an email.")
    .min(5, "This field is required.")
    .max(64, "Too long."),
  subject: z.string().min(5, "This field is required.").max(64, "Too long."),
  description: z
    .string()
    .min(10, "This field is required.")
    .max(1024, "Too long."),
});

const ContactForm = () => {
  const t = useTranslations();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Send the form data to the server
    console.log(values);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Logo className="text-blue-500 max-w-sm" />
      <h1 className="mt-5 text-3xl font-bold mb-6">{t("CONTACT_US")}</h1>
      <Card className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            {t("GET_IN_TOUCH")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("NAME")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("EMAIL")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("SUBJECT")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter the subject" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("DESCRIPTION")}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter the description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                {t("SUBMIT")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactForm;
