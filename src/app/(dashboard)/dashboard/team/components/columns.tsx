"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
const statusBadgeMap: Record<TeamMember["status"], "default" | "destructive" | "outline"> = {
  Active: "default",
  "On Break": "outline",
  Removed: "destructive",
};

// Define the columns for the table
export const columns: ColumnDef<TeamMember>[] = [
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
    accessorKey: "workspacesAssigned",
    header: "Workspaces Assigned",
    cell: ({ row }) => {
      const count = row.getValue<number>("workspacesAssigned");
      return <div className="text-center">{count}</div>;
    },
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
    id: "modify",
    cell: ({ row }) => {
      const memberId = row.original.id;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Modify
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => alert(`Modify ${memberId}`)}>
              Open Modal
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    header: "Modify",
  },
];