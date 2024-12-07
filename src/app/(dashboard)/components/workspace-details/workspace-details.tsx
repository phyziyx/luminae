"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { Workspace } from "@prisma/client";
import { LoadingSpinner } from "@/components/site/loading-spinner";

import formSchema from "./schema";
import onSubmit from "./action";

type WorkspaceDetailsProps = {
  data?: Partial<Workspace>;
};

const WorkspaceDetails = ({ data }: WorkspaceDetailsProps) => {
  const t = useTranslations();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id || "",
      name: data?.name || "",
      description: data?.description || "",
    },
  });

  const isCreating = !data?.id;
  const isLoading = form.formState.isSubmitting;

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      await onSubmit(values);
      toast({
        title: "Workspace information saved successfully",
      });
    } catch {
      toast({
        title: "An error occurred while saving the workspace information",
      });
    }
  }

  // useEffect(() => {
  //   if (data) {
  //     form.reset({ ...data });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [data]);

  return (
    <Card className="w-full bg-white dark:bg-muted/90">
      <CardHeader>
        <CardTitle>
          {isCreating
            ? t("CREATE_WORKSPACE")
            : t("WORKSPACE_DETAILS.WORKSPACE_INFORMATION")}
        </CardTitle>
        <CardDescription>
          {isCreating
            ? t("WORKSPACE_DETAILS.CREATE_WORKSACE_DESCRIPTION")
            : t("WORKSPACE_DETAILS.UPDATE_WORKSPACE_DESCRIPTION")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((e) => {
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
                    <FormLabel>
                      {t("WORKSPACE_DETAILS.WORKSPACE_NAME")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        required
                        placeholder={t("WORKSPACE_DETAILS.WORKSPACE_NAME")}
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
              name="description"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    {t("WORKSPACE_DETAILS.WORKSPACE_DESCRIPTION")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      required
                      placeholder={t("WORKSPACE_DETAILS.WORKSPACE_DESCRIPTION")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>{"id"}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      required
                      placeholder={"id"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <LoadingSpinner />
              ) : isCreating ? (
                t("WORKSPACE_DETAILS.CREATE_WORKSPACE")
              ) : (
                t("WORKSPACE_DETAILS.SAVE_WORKSPACE_INFORMATION")
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default WorkspaceDetails;
