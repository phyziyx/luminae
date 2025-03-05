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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Controller, useForm } from "react-hook-form";
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
import { LoadingSpinner } from "@/components/site/loading-spinner";
import { User } from "@prisma/client";

interface TeamMemberDetailsFormProps {
  data: {
    member: Pick<User, "name" | "email" | "image">;
    role: "AGENCY_ADMIN" | "AGENCY_USER" | "AGENCY_OWNER";
    workspaces: {
      id: string;
      name: string;
      access: boolean;
      manager: boolean;
    }[];
  };
}

export default function TeamMemberDetailsForm({
  data,
}: TeamMemberDetailsFormProps) {
  const t = useTranslations();

  const initialWorkspaces = data.workspaces.map((workspace) => ({
    id: workspace.id,
    access: workspace.access || false,
    manager: workspace.manager || false,
  }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: data.member.email,
      role: data.role || "AGENCY_USER",
      workspaces: data.workspaces.map((workspace) => ({
        id: workspace.id,
        access: workspace.access || false,
        manager: workspace.manager || false,
      })),
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const modifiedWorkspaces = values.workspaces.filter(
        (workspace, index) => {
          const initialWorkspace = initialWorkspaces[index];
          return (
            workspace.access !== initialWorkspace.access ||
            workspace.manager !== initialWorkspace.manager
          );
        }
      );

      const modifiedValues = {
        ...values,
        workspaces: modifiedWorkspaces,
      };

      const response = await onUpdateMember(modifiedValues);

      // For debugging!
      // toast({
      //   title: "You submitted the following values:",
      //   description: (
      //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
      //       <code className="text-white">
      //         {JSON.stringify(modifiedValues, null, 2)}
      //       </code>
      //     </pre>
      //   ),
      // });

      toast({
        title: response?.error || "Member information updated successfully",
        variant: response?.error ? "destructive" : "default",
      });
    } catch {
      toast({
        title: "An error occurred while saving the team member information",
      });
    }
  }

  return (
    <div className="space-y-2">
      <div className="gap-4 flex flex-row justify-between place-items-center">
        <Avatar>
          <AvatarImage src={data.member.image} />
          <AvatarFallback>{data.member.name.split(" ")[0]}</AvatarFallback>
        </Avatar>
        <h2 className="font-semibold text-black dark:text-white">
          {`${data.member.name}`}
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
            {/* Assign Role Section -- Not visible for agency owner */}
            {(data.role as string) !== "AGENCY_OWNER" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p>{t("ASSIGN_ROLE.SELECT_ROLE")}</p>
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="border-blue-500 border-collapse border-2 rounded-md">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={data.role}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choose a role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>
                                  {t("ASSIGN_ROLE.ROLES")}
                                </SelectLabel>
                                <SelectItem value="AGENCY_ADMIN">
                                  {t("ROLES.AGENCY_ADMIN")}
                                </SelectItem>
                                <SelectItem value="AGENCY_USER">
                                  {t("ROLES.AGENCY_USER")}
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Workspaces Section */}
            <div className="space-y-2">
              <div className="flex flex-row justify-between">
                <p className="font-semibold">
                  {t("INVITE_TEAM_MEMBER.WORKSPACES_ASSIGNED")}
                </p>
                <p>{data.workspaces.length || 0}</p>
              </div>

              <Command>
                <CommandInput placeholder={t("SEARCH_IN_AGENCY")} />
                <CommandList>
                  <CommandEmpty>{t("NO_RESULTS_FOUND")}</CommandEmpty>
                  <CommandGroup>
                    {data.workspaces.map((workspace, index) => (
                      <CommandItem
                        key={workspace.id}
                        className="flex flex-row justify-between p-1 border-b"
                      >
                        <span>{workspace.name}</span>

                        <div className="flex items-center space-x-2 text-xs">
                          <Controller
                            name={`workspaces.${index}.access`}
                            control={form.control}
                            render={({ field }) => (
                              <>
                                <label
                                  htmlFor={`access-${workspace.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {t("INVITE_TEAM_MEMBER.HAS_ACCESS")}
                                </label>
                                <Checkbox
                                  id={`access-${workspace.id}`}
                                  checked={field.value}
                                  onCheckedChange={(checked) =>
                                    field.onChange(checked)
                                  }
                                />
                              </>
                            )}
                          />
                          <Separator
                            orientation="vertical"
                            className="bg-black dark:bg-slate-200"
                          />
                          <Controller
                            name={`workspaces.${index}.manager`}
                            control={form.control}
                            render={({ field }) => (
                              <>
                                <label
                                  htmlFor={`manager-${workspace.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {t("INVITE_TEAM_MEMBER.IS_WORKSPACE_MANAGER")}
                                </label>
                                <Checkbox
                                  id={`manager-${workspace.id}`}
                                  checked={field.value}
                                  onCheckedChange={(checked) =>
                                    field.onChange(checked)
                                  }
                                />
                              </>
                            )}
                          />
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>

            {/* Submit Button */}
            <div className="text-right">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <LoadingSpinner /> : t("BUTTONS.SAVE_CHANGES")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
