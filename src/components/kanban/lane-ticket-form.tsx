import { Input } from "../ui/input";
import { useModal } from "@/providers/modal-provider";
import { LaneTicketFormSchema, laneTicketFormSchema } from "@/lib/forms";
import onUpdateTicket from "@/actions/update-ticket";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { DialogFooter } from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import useSWR from "swr";
import fetchMembersByWorkspace from "@/actions/fetch-members-by-workspace";
import ComboBox from "../site/combo-box";
import fetchClients from "@/actions/fetch-clients";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { startTransition, useActionState, useMemo } from "react";
import { LoadingSpinner } from "../site/loading-spinner";
import { Button } from "../ui/button";
import fetchTicketDetails from "@/actions/fetch-ticket-details";
import { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import clsx from "clsx";
import deleteTicket from "@/actions/delete-ticket";

type LaneTicketFormProps = {
  onSubmit: (values: LaneTicketFormSchema) => Promise<void>;
  data: LaneTicketFormSchema;
  workspaceId: string;
};

type LaneTicketModalProps = {
  workspaceId: string;
  laneId: string;
  ticketId: string;
};

export default function LaneTicketModal({
  workspaceId,
  laneId,
  ticketId,
}: LaneTicketModalProps) {
  const t = useTranslations();
  const { closeModal } = useModal();

  const {
    data: ticketData,
    error,
    isLoading,
  } = useSWR(ticketId ? ["ticket", ticketId] : null, ([, tId]) =>
    fetchTicketDetails(tId)
  );

  async function onSubmit(values: LaneTicketFormSchema) {
    try {
      const response = await onUpdateTicket(values);

      toast({
        title: response?.error || "Ticked information saved successfully",
        variant: response?.error ? "destructive" : "default",
      });

      closeModal();
    } catch {
      toast({
        title: "An error occurred while saving the ticket information",
        variant: "destructive",
      });
    }
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || (ticketId && !ticketData)) {
    return <div>{t("ERROR_MESSAGES.FAILED_TO_LOAD_AGENCY_DETAILS")}</div>;
  }

  return (
    <LaneTicketForm
      workspaceId={workspaceId}
      onSubmit={onSubmit}
      data={{
        clientId: ticketData?.clientId || "",
        description: ticketData?.description || "",
        id: ticketData?.id || "",
        name: ticketData?.title || "",
        tag: ticketData?.tag || "Low",
        userId: ticketData?.assigneeUserId || "",
        value: `${ticketData?.value ?? 0}`,
        open: ticketData?.open || false,
        laneId,
      }}
    />
  );
}

function LaneTicketForm({ onSubmit, data, workspaceId }: LaneTicketFormProps) {
  const form = useForm<LaneTicketFormSchema>({
    resolver: zodResolver(laneTicketFormSchema),
    defaultValues: {
      ...data,
    },
    mode: "onBlur",
  });

  const isLoading = form.formState.isSubmitting;
  const t = useTranslations();

  const { data: rawClientsData, isLoading: isLoadingClients } = useSWR(
    ["clients"],
    () => fetchClients()
  );

  const { data: rawMembersData, isLoading: isLoadingMembers } = useSWR(
    ["members", workspaceId],
    ([, workspaceId]) => fetchMembersByWorkspace(workspaceId)
  );

  const membersData = useMemo(
    () =>
      rawMembersData?.map((e) => {
        return {
          label: `${e.user.name}`,
          value: e.user.id,
          data: {
            ...e.user,
          },
        };
      }) || [],
    [rawMembersData]
  );

  const clientsData = useMemo(
    () => rawClientsData?.map((e) => ({ label: e.name, value: e.id })) || [],
    [rawClientsData]
  );

  const deleteTicketWithId = deleteTicket.bind(null, {
    ticketId: data.id || "",
  });
  const [, deleteAction, isDeleting] = useActionState(deleteTicketWithId, {
    error: "",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("FORMS.NAME")}</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {data.id && (
          <FormField
            control={form.control}
            name="open"
            render={({ field }) => (
              <FormItem className="flex items-center place-items-center gap-2">
                <FormLabel>Open</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select a Priority</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">{t("TAGS.HIGH")}</SelectItem>
                    <SelectItem value="Medium">{t("TAGS.MEDIUM")}</SelectItem>
                    <SelectItem value="Low">{t("TAGS.LOW")}</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Team Member</FormLabel>
              <FormControl>
                {isLoadingMembers ? (
                  <LoadingSpinner />
                ) : (
                  <ComboBox<User>
                    modal={true}
                    className="bg-transparent"
                    value={field.value}
                    setValue={field.onChange}
                    data={membersData}
                    renderFn={(value, checked) => (
                      <div className="flex flex-row gap-2 place-items-center">
                        <Avatar>
                          <AvatarImage src={value.image || ""} />
                          <AvatarFallback>{`${value.name}`}</AvatarFallback>
                        </Avatar>
                        <span
                          className={clsx({
                            "font-bold": checked,
                          })}
                        >{`${value.name}`}</span>
                      </div>
                    )}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <FormControl>
                {isLoadingClients ? (
                  <LoadingSpinner />
                ) : (
                  <ComboBox
                    modal={true}
                    className="bg-transparent"
                    value={field.value}
                    setValue={field.onChange}
                    data={clientsData}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="justify-between">
          {data.id && (
            <Button
              variant={"destructive"}
              type="button"
              disabled={isLoading || isDeleting}
              onClick={() => {
                startTransition(deleteAction);
              }}
            >
              {t("BUTTONS.DELETE")}
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : t("BUTTONS.SAVE_CHANGES")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
