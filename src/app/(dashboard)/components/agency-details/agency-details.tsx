"use client";

import { Agency } from "@prisma/client";
import { useForm } from "react-hook-form";
import React, { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { NumberInput } from "@tremor/react";

import {
  Card,
  CardContent,
  CardDescription,
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
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { LoadingSpinner } from "@/components/site/loading-spinner";

import formSchema from "./schema";
import onSubmit from "./action";

type AgencyDetailsProps = {
  data?: Partial<Agency>;
};

const AgencyDetails = ({ data }: AgencyDetailsProps) => {
  const t = useTranslations();

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name || "",
      companyEmail: data?.companyEmail || "",
      companyPhone: data?.companyPhone || "",
      address: data?.address || "",
      city: data?.city || "",
      zipCode: data?.zipCode || "",
      state: data?.state || "",
      country: data?.country || "",
      agencyLogo: data?.agencyLogo || "",
    },
  });

  const isCreating = !data?.id;
  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values);
  };

  useEffect(() => {
    if (data) {
      form.reset({ ...data });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Card className="w-full bg-white dark:bg-muted/90">
      <CardHeader>
        <CardTitle>
          {isCreating
            ? t("AGENCY_DETAILS.CREATE_AGENCY")
            : t("AGENCY_DETAILS.AGENCY_INFORMATION")}
        </CardTitle>
        <CardDescription>
          {isCreating
            ? t("AGENCY_DETAILS.CREATE_AGENCY_DESCRIPTION")
            : t("AGENCY_DETAILS.UPDATE_AGENCY_DESCRIPTION")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((e) => {
              console.log("clicked 1");
              return handleSubmit(e);
            })}
            className="space-y-4"
          >
            <div className="flex md:flex-row gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t("AGENCY_DETAILS.AGENCY_NAME")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("AGENCY_DETAILS.YOUR_AGENCY_NAME")}
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                defaultValue={form.control}
                disabled={true}
                name="companyEmail"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t("AGENCY_DETAILS.AGENCY_EMAIL")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("AGENCY_DETAILS.AGENCY_EMAIL")}
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex md:flex-row gap-4">
              <FormField
                control={form.control}
                name="companyPhone"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t("AGENCY_DETAILS.AGENCY_PHONE")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("AGENCY_DETAILS.AGENCY_PHONE")}
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>{t("AGENCY_DETAILS.AGENCY_ADDRESS")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("AGENCY_DETAILS.AGENCY_ADDRESS")}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex md:flex-row gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t("AGENCY_DETAILS.AGENCY_CITY")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("AGENCY_DETAILS.AGENCY_CITY")}
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t("AGENCY_DETAILS.AGENCY_STATE")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("AGENCY_DETAILS.AGENCY_STATE")}
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t("AGENCY_DETAILS.AGENCY_ZIPCODE")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("AGENCY_DETAILS.AGENCY_ZIPCODE")}
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>{t("AGENCY_DETAILS.AGENCY_COUNTRY")}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder={t("AGENCY_DETAILS.AGENCY_COUNTRY")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <LoadingSpinner />
              ) : isCreating ? (
                t("AGENCY_DETAILS.CREATE_AGENCY")
              ) : (
                t("AGENCY_DETAILS.SAVE_AGENCY_INFORMATION")
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AgencyDetails;
