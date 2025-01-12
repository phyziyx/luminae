"use client";

import onCreateLane from "@/actions/create-lane";
import { LoadingSpinner } from "@/components/site/loading-spinner";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CreateLaneSchema, createLaneSchema } from "@/lib/forms";
import { useModal } from "@/providers/modal-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lane } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type LaneFormProps = {
  data?: Pick<Lane, "id" | "name" | "colour">;
};

export default function LaneCreateForm({ data }: LaneFormProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const { closeModal } = useModal();
  const router = useRouter();

  const form = useForm<CreateLaneSchema>({
    mode: "onChange",
    resolver: zodResolver(createLaneSchema),
    defaultValues: {
      id: data?.id || "",
      name: data?.name || "",
      colour: data?.colour || "AA00AA",
    },
  });

  const isCreating = !data?.id;
  const isLoading = form.formState.isSubmitting;

  async function handleSubmit(values: CreateLaneSchema) {
    try {
      const result = await onCreateLane(values);

      toast({
        title: result?.error || "Lane information saved successfully",
        variant: result?.error ? "destructive" : "default",
      });

      // router.refresh();
      closeModal();
    } catch {
      toast({
        title: "An error occurred while saving the lane information",
      });
    }
  }

  return (
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
                <FormLabel>{t("KANBAN.BOARD_NAME")}</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    required
                    placeholder={t("KANBAN.BOARD_NAME")}
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
          name="colour"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>{t("KANBAN.BOARD_COLOUR")}</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  required
                  placeholder={t("KANBAN.BOARD_COLOUR")}
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
            t("KANBAN.CREATE_LANE_TITLE")
          ) : (
            t("WORKSPACE_DETAILS.SAVE_WORKSPACE_INFORMATION")
          )}
        </Button>
      </form>
    </Form>
  );
}
