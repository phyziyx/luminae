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

interface TeamMemberDetailsFormProps {
  data: any;
}

// make dummy function that does nothing
const placeholder = () => {};

export default function TeamMemberDetailsForm({
  data,
}: TeamMemberDetailsFormProps) {
  const t = useTranslations();

  return (
    <form onSubmit={placeholder} className="space-y-6">
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
          <p>{t("WORKSPACES.WORKSPACES_ASSIGNED")}</p>
          <p className="font-semibold">3</p>
        </div>
        <Input
          type="text"
          placeholder="Search workspaces..."
          className="w-full p-2 border rounded"
        />
        <div className="h-48 overflow-y-auto border rounded p-2">
          {workspaces.map((workspace) => (
            <div
              key={workspace}
              className="flex justify-between items-center p-2 border-b"
            >
              <span>{workspace}</span>
              <label className="flex items-center gap-2 text-xs">
                {t("WORKSPACES.IS_WORKSPACE_MANAGER")}
                <input type="checkbox" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Horizontal Line */}
      <hr className="border-t border-gray-300" />

      {/* Assign Workspace Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t("ASSIGN_WORKSPACE.HEADER")}</h2>
        <p>{t("ASSIGN_WORKSPACE.SELECT_WORKSPACE")}</p>
        <Command>
          <CommandInput placeholder={t("SEARCH_IN_AGENCY")} />
          <CommandList className="pb-16">
            <CommandEmpty>{t("NO_RESULTS_FOUND")}</CommandEmpty>
            <CommandGroup heading={t("WORKSPACES")}>
              {workspaces && workspaces.length > 0
                ? workspaces.map((e) => (
                    <CommandItem key={e.id}>{e.name}</CommandItem>
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
    </form>
  );
}
