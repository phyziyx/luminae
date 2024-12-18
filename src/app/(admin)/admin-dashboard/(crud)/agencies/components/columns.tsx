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
// import { toast } from "@/components/ui/use-toast";
import { MoreVerticalIcon } from "lucide-react";
import { useModal } from "@/providers/modal-provider";
import CustomModal from "@/components/site/custom-modal";
import { Agency } from "@prisma/client";
import { useTranslations } from "next-intl";

import UpdateAgencyModal from "./modals/update-agency-modal"; // Import the UpdateAgencyModal component
import { toast } from "@/hooks/use-toast";

// Define agency data type
export type AgencyData = {
  id: string;
  name: string;
  email: string;
  status: "Active" | "Inactive";
};

// Map status to badge variants
const statusBadgeMap: Record<
  AgencyData["status"],
  "default" | "destructive" | "secondary"
> = {
  Active: "default",
  Inactive: "destructive",
};

// Define the columns for the agency table
export const columns: ColumnDef<AgencyData>[] = [
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<AgencyData["status"]>("status");
      const badgeVariant = statusBadgeMap[status];

      return <Badge variant={badgeVariant}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { openModal } = useModal();
      const t = useTranslations();
      const agency = row.original;

      const handleDelete = async () => {
        try {
          // Perform delete operation here (e.g., API call)
          // Assuming a function deleteAgency(id: string) exists
          await fetch(`/api/agencies/${agency.id}`, {
            method: "DELETE",
          });

          toast({
            title: "Agency Deleted",
            description: `${agency.name} has been successfully deleted.`,
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error Deleting Agency",
            description: "There was an issue deleting the agency. Please try again.",
          });
        }
      };

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
                    title="Edit Agency Details"
                    caption="Modify agency information as needed."
                  >
                    <UpdateAgencyModal agencyId={agency.id} />
                  </CustomModal>
                )
              }
            >
              Edit Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(agency.email)}
            >
              Copy Email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];