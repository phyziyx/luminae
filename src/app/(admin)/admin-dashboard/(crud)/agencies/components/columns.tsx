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

import UpdateAgencyModal from "./modals/update-agency-modal"; // Import the UpdateAgencyModal component
import { toast } from "@/hooks/use-toast";
import deleteAgency from "./actions/agency-delete";

// Define agency data type
export type AgencyData = {
  id: string;
  name: string;
  email: string;
  status: "Active" | "Inactive" | "No Members";
};

// Map status to badge variants
const statusBadgeMap: Record<
  AgencyData["status"],
  "default" | "destructive" | "secondary"
> = {
  Active: "default",
  Inactive: "destructive",
  "No Members": "secondary",
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
      const agency = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { openModal } = useModal();
      const handleDeleteClick = async () => {
        try {
          const result = await deleteAgency({ id: agency.id });
          if (result.error) {
            toast({
              variant: "destructive",
              title: "Error Deleting Agency",
              description: result.error,
            });
          } else {
            toast({
              title: "Agency Deleted",
              description: `${agency.name} has been successfully deleted.`,
            });
          }
        } catch {
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
            <DropdownMenuItem onClick={handleDeleteClick}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];