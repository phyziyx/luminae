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
    cell: ({ row }) => row.getValue("status"),
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
      const { openModal } = useModal();
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
                    title="Edit Package Details"
                    caption="Modify package information as needed."
                  >
                    <UpdatePackageModal
                      packageId={packageData.id}
                      onClose={() => openModal(null)}
                    />
                  </CustomModal>
                )
              }
            >
              Edit Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => alert("Delete Package")}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
