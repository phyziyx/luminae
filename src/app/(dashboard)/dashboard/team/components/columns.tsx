"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import { useModal } from "@/providers/modal-provider"; // Import modal hook
import CustomModal from "@/components/site/custom-modal"; // Import custom modal

// Define team member data type
export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "Agency Admin" | "Team Member";
  workspacesAssigned: number;
  status: "Active" | "On Break" | "Removed";
};

// Map status to badge variants
const statusBadgeMap: Record<
  TeamMember["status"],
  "default" | "destructive" | "secondary"
> = {
  Active: "default",
  "On Break": "secondary",
  Removed: "destructive",
};

// Define the columns for the table
export const columns: ColumnDef<TeamMember>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<TeamMember["status"]>("status");
      const badgeVariant = statusBadgeMap[status];

      return <Badge variant={badgeVariant}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { openModal } = useModal();
      const member = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                openModal(
                  <CustomModal
                    title="Edit Details"
                    caption="Manage workspaces and roles for this team member."
                  >
                    <div className="space-y-4">
                      {/* Assign Role Section */}
                      <div className="space-y-2">
                        <h2 className="text-lg font-semibold">Assign Role</h2>
                        <div className="flex items-center justify-between">
                          <p>Select Role:</p>
                          <select
                            className="p-2 border rounded"
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Choose a role
                            </option>
                            <option value="Agency Admin">Agency Admin</option>
                            <option value="Team Member">Team Member</option>
                          </select>
                        </div>
                      </div>

                      {/* Horizontal Line */}
                      <hr className="border-t border-gray-300" />

                      {/* Workspaces Section */}
                      <p>Workspaces Assigned: 3</p>
                      <input
                        type="text"
                        placeholder="Search workspaces..."
                        className="w-full p-2 border rounded"
                      />
                      <div className="h-48 overflow-y-auto border rounded p-2">
                        {[
                          "Workspace 1",
                          "Workspace 2",
                          "Workspace 3",
                          "Workspace 4",
                          "Workspace 5",
                        ].map((workspace) => (
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
                        <h2 className="text-lg font-semibold">
                          Assign Workspace
                        </h2>
                        <p>Select Workspace:</p>
                      </div>
                    </div>
                  </CustomModal>
                )
              }
            >
              View details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(member.email)}
            >
              Copy email
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
