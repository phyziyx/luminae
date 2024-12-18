"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useTranslations } from "next-intl";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import formSchema from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import onUpdateMember from "./action";

interface TeamMemberDetailsFormProps {
  data: any;
}

export default function TeamMemberDetailsForm({
  data,
}: TeamMemberDetailsFormProps) {
  const t = useTranslations();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "AGENCY_USER",
    },
  });

  console.log(data);

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await onUpdateMember(values);

      toast({
        title: response?.error || "Workspace information saved successfully",
        variant: response?.error ? "destructive" : "default",
      });
    } catch {
      toast({
        title: "An error occurred while saving the workspace information",
      });
    } finally {
      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(values, null, 2)}
            </code>
          </pre>
        ),
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Assign Role Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t("ASSIGN_ROLE.HEADER")}</h2>
          <div className="flex items-center justify-between">
            <p>{t("ASSIGN_ROLE.SELECT_ROLE")}</p>
            <Select>
              <SelectTrigger className="w-2/3">
                <SelectValue placeholder="Choose a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("ASSIGN_ROLE.ROLES")}</SelectLabel>
                  <SelectItem value="agency_admin">
                    {t("ROLES.AGENCY_ADMIN")}
                  </SelectItem>
                  <SelectItem value="team_member">
                    {t("ROLES.AGENCY_USER")}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Horizontal Line */}
        <hr className="border-t border-gray-300" />

        {/* Workspaces Section */}
        <div className="space-y-4">
          <div className="flex flex-row justify-between">
            <p>{t("INVITE_TEAM_MEMBER.WORKSPACES_ASSIGNED")}</p>
            <p className="font-semibold">3</p>
          </div>
          <Input
            type="text"
            placeholder="Search workspaces..."
            className="w-full p-2 border rounded"
          />
          <div className="h-48 overflow-y-auto border rounded p-2">
            {data.workspaces.map((workspace, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 border-b"
              >
                <span>{workspace.name}</span>
                <label className="flex items-center gap-2 text-xs">
                  {t("INVITE_TEAM_MEMBER.IS_WORKSPACE_MANAGER")}
                  <input type="checkbox" />
                </label>
              </div>
            ))}
          </div>

          {/* Horizontal Line */}
          <hr className="border-t border-gray-300" />

          {/* Assign Workspace Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              {t("ASSIGN_WORKSPACE.HEADER")}
            </h2>
            <p>{t("ASSIGN_WORKSPACE.SELECT_WORKSPACE")}</p>
            <Command>
              <CommandInput placeholder={t("SEARCH_IN_AGENCY")} />
              <CommandList className="pb-16">
                <CommandEmpty>{t("NO_RESULTS_FOUND")}</CommandEmpty>
                <CommandGroup heading={t("WORKSPACES")}>
                  {data.workspaces && data.workspaces.length > 0
                    ? data.workspaces.map((e, index) => (
                        <CommandItem key={index}>{e.name}</CommandItem>
                      ))
                    : t("NO_WORKSPACES_FOUND")}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {t("BUTTONS.SAVE_CHANGES")}
            </button>
          </div>
        </div>
      </form>
    </Form>
  );
}
