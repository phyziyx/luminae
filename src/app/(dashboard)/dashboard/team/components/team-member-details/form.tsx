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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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
    <div className="space-y-2">
      <div className="gap-4 flex flex-row justify-between place-items-center">
        <Avatar>
          <AvatarImage src={data.member.avatarUrl} />
          <AvatarFallback>{data.member.name}</AvatarFallback>
        </Avatar>
        <h2 className="font-semibold text-black dark:text-white">
          {data.member.name}
        </h2>
        <Badge className="text-center" variant={"default"}>
          {t(`ROLES.${data.role}`)}
        </Badge>
      </div>
      <Separator
        orientation="horizontal"
        className="bg-black dark:bg-slate-200"
      />
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Assign Role Section */}
            {data.role !== "AGENCY_OWNER" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">
                  {t("ASSIGN_ROLE.HEADER")}
                </h2>
                <div className="flex items-center justify-between">
                  <p>{t("ASSIGN_ROLE.SELECT_ROLE")}</p>
                  <Select defaultValue={data.role}>
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
            )}

            {/* Workspaces Section */}
            <div className="space-y-4">
              <div className="flex flex-row justify-between">
                <p>{t("INVITE_TEAM_MEMBER.WORKSPACES_ASSIGNED")}</p>
                <p className="font-semibold">{data.workspaces.length || 0}</p>
              </div>

              <Command>
                <CommandInput placeholder={t("SEARCH_IN_AGENCY")} />
                <CommandList>
                  <CommandEmpty>{t("NO_RESULTS_FOUND")}</CommandEmpty>
                  <CommandGroup>
                    {data.workspaces.map((workspace) => (
                      <CommandItem
                        key={workspace.id}
                        className="flex flex-row justify-between p-1 border-b"
                      >
                        <span>{workspace.name}</span>

                        <div className="flex items-center space-x-2 text-xs">
                          <label
                            htmlFor="access"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {t("INVITE_TEAM_MEMBER.HAS_ACCESS")}
                          </label>
                          <Checkbox id="access" />

                          <Separator
                            orientation="vertical"
                            className="bg-black dark:bg-slate-200"
                          />

                          <label
                            htmlFor="manager"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {t("INVITE_TEAM_MEMBER.IS_WORKSPACE_MANAGER")}
                          </label>
                          <Checkbox id="manager" />
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>

            {/* Submit Button */}
            <div className="text-right">
              <Button type="submit">{t("BUTTONS.SAVE_CHANGES")}</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
