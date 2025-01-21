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
import { toast } from "@/hooks/use-toast";
import { CreateLaneSchema, createLaneSchema } from "@/lib/forms";
import { useModal } from "@/providers/modal-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lane } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

type LaneFormProps = {
  data?: Pick<Lane, "id" | "workspaceId" | "name" | "colour">;
  onSubmit: (values: CreateLaneSchema) => Promise<void>;
};

type LaneCreateModalProps = {
  workspaceId: string;
  lane: Lane;
};

export default function LaneCreateModal({
  workspaceId,
  lane,
}: LaneCreateModalProps) {
  const { closeModal } = useModal();

  // const {
  //   data: laneData,
  //   error,
  //   isLoading,
  // } = useSWR(lane.id ? ["lane", lane.id] : null, ([, laneId]) =>
  //   fetchLaneDetails(laneId)
  // );

  async function onSubmit(values: CreateLaneSchema) {
    try {
      const result = await onCreateLane(values);

      toast({
        title: result?.error || "Lane information saved successfully",
        variant: result?.error ? "destructive" : "default",
      });

      closeModal();
    } catch {
      toast({
        title: "An error occurred while saving the lane information",
      });
    }
  }

  // if (isLoading) {
  //   return <LoadingSpinner />;
  // }

  // if (error || (laneId && !laneData)) {
  //   return <div>{t("ERROR_MESSAGES.FAILED_TO_LOAD_AGENCY_DETAILS")}</div>;
  // }

  return (
    <LaneCreateForm
      onSubmit={onSubmit}
      data={{
        id: lane.id,
        workspaceId,
        colour: lane.colour,
        name: lane.name,
      }}
    />
  );
}

function LaneCreateForm({ data, onSubmit }: LaneFormProps) {
  const t = useTranslations();

  const form = useForm<CreateLaneSchema>({
    mode: "onChange",
    resolver: zodResolver(createLaneSchema),
    defaultValues: {
      id: data?.id || "",
      workspaceId: data?.workspaceId || "",
      name: data?.name || "",
      colour: data?.colour || "AA00AA",
    },
  });

  const isCreating = !data?.id;
  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            t("BUTTONS.SAVE_CHANGES")
          )}
        </Button>
      </form>
    </Form>
  );
}
