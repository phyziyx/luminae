import { Input } from "../ui/input";
import { useModal } from "@/providers/modal-provider";
import { z } from "zod";
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
import { useMemo } from "react";
import { LoadingSpinner } from "../site/loading-spinner";
import { Button } from "../ui/button";

export default function LaneTicketForm({
  workspaceId,
  data,
}: {
  workspaceId: string;
  data: LaneTicketFormSchema;
}) {
  const { closeModal } = useModal();

  const form = useForm<LaneTicketFormSchema>({
    resolver: zodResolver(laneTicketFormSchema),
    defaultValues: {
      ...data,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof laneTicketFormSchema>) => {
    try {
      const response = await onUpdateTicket(values);

      toast({
        title: response?.error || "User information saved successfully",
        variant: response?.error ? "destructive" : "default",
      });
      closeModal();
    } catch {
      toast({
        title: "An error occurred while saving the user information",
        variant: "destructive",
      });
    }
  };

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
          label: `${e.user.firstName} ${e.user.lastName}`,
          value: e.user.id,
        };
      }) || [],
    [rawMembersData]
  );

  const clientsData = useMemo(
    () => rawClientsData?.map((e) => ({ label: e.name, value: e.id })) || [],
    [rawClientsData]
  );

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
                <Input {...field} required />
              </FormControl>
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
                <Input {...field} required />
              </FormControl>
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
                <Input {...field} required />
              </FormControl>
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
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select a Role:</FormLabel>
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
            <FormItem>
              <FormLabel>Team Member:</FormLabel>
              <FormControl>
                {isLoadingMembers ? (
                  <LoadingSpinner />
                ) : (
                  <ComboBox
                    value={field.value}
                    setValue={field.onChange}
                    data={membersData}
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

        <DialogFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : t("BUTTONS.SAVE_CHANGES")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
