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

export default function TeamMemberDetailsForm({
  data,
}: TeamMemberDetailsFormProps) {
  const t = useTranslations();

  return (
    <div className="space-y-4">
      {/* Assign Role Section */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Assign Role</h2>
        <div className="flex items-center justify-between">
          <p>Select Role:</p>

          <Select>
            <SelectTrigger className="w-2/3">
              <SelectValue placeholder="Choose a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Roles</SelectLabel>
                <SelectItem value="agency_admin">Agency Admin</SelectItem>
                <SelectItem value="team_member">Team Member</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Horizontal Line */}
      <hr className="border-t border-gray-300" />

      {/* Workspaces Section */}
      <div className="flex flex-row justify-between">
        <p>Workspaces Assigned:</p>
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
              Is Workspace Manager?
              <input type="checkbox" />
            </label>
          </div>
        ))}
      </div>

      {/* Horizontal Line */}
      <hr className="border-t border-gray-300" />

      {/* Assign Workspace Section */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Assign Workspace</h2>
        <p>Select Workspace:</p>
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
    </div>
  );
}
