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
import { useModal } from "@/providers/modal-provider";
import CustomModal from "@/components/site/custom-modal";
import { AgencyMember } from "@prisma/client";
import { useTranslations } from "next-intl";
import TeamMemberDetails from "./team-member-details";

// Define team member data type
export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: AgencyMember["role"];
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
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const t = useTranslations();
      const role = row.getValue<TeamMember["role"]>("role");

      return <span>{t(`ROLES.${role}`)}</span>;
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
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const t = useTranslations();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { openModal } = useModal();
      const member = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{t("MENU.OPEN_MENU")}</span>
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("ACTIONS.HEADER")}</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                openModal(
                  <CustomModal
                    title="Edit Details"
                    caption="Manage workspaces and roles for this team member."
                  >
                    <TeamMemberDetails memberId={member.email} />
                  </CustomModal>
                )
              }
            >
              {t("ACTIONS.VIEW_DETAILS")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(member.email)}
            >
              {t("ACTIONS.COPY_EMAIL")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t("ACTIONS.SET_AS_ON_BREAK")}</DropdownMenuItem>
            <DropdownMenuItem>{t("ACTIONS.SET_AS_REMOVED")}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {t("ACTIONS.DELETE_FROM_TABLE")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
