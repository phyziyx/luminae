"use client";

import { ColumnDef } from "@tanstack/react-table";
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
import UpdatePackageModal from "./modals/package-update-modal";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

// Define package data type
export type PackageData = {
  id: string;
  name: string;
  TEAM_MEMBERS?: number;
  WORKSPACE?: number;
  FILE_STORAGE?: number;
  status: string;
  monthlyPrice: number;
};

const statusBadgeMap: Record<
  PackageData["status"],
  "default" | "destructive" | "secondary"
> = {
  Active: "default",
  Inactive: "destructive",
};

// Define columns for package table dynamically based on features
export const columns: ColumnDef<PackageData>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "name",
    header: "Package Name",
  },
  {
    accessorKey: "monthlyPrice",
    header: "Price ($)",
    cell: ({ row }) => `$${row.getValue("monthlyPrice")}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<PackageData["status"]>("status");
      const badgeVariant = statusBadgeMap[status];

      return <Badge variant={badgeVariant}>{status}</Badge>;
    }
  },
  {
    accessorKey: "TEAM_MEMBERS",
    header: "Team Members",
    cell: ({ row }) => row.getValue("TEAM_MEMBERS") || 0,
  },
  {
    accessorKey: "WORKSPACE",
    header: "Workspace",
    cell: ({ row }) => row.getValue("WORKSPACE") || 0,
  },
  {
    accessorKey: "FILE_STORAGE",
    header: "Storage",
    cell: ({ row }) => row.getValue("FILE_STORAGE") || 0,
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const packageData = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { openModal, closeModal } = useModal();
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const t = useTranslations();
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
                    title={t("PACKAGE_FORM.EDIT_PACKAGE")}
                    caption={t("PACKAGE_FORM.EDIT_PACKAGE_CAPTION")}
                  >
                    <UpdatePackageModal
                      packageId={packageData.id}
                      onClose={closeModal}
                    />
                  </CustomModal>
                )
              }
            >
              {t("ACTIONS.EDIT_DETAILS")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => alert("Delete Package")}>
              {t("ACTIONS.DELETE")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
