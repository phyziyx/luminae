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
// import { useModal } from "@/providers/modal-provider";
// import CustomModal from "@/components/site/custom-modal";
import { useTranslations } from "next-intl";
// import { toast } from "@/hooks/use-toast";

// Define user data type
export type ClientData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  ticket_size: number;
  status: string;
};

// Map status to badge variants
const statusBadgeMap: Record<
  ClientData["status"],
  "default" | "destructive" | "secondary"
> = {
  ACTIVE: "default",
  INACTIVE: "destructive",
};

// Define the columns for the user table
export const columns: ColumnDef<ClientData>[] = [
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
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "state",
    header: "State",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "ticket_size",
    header: "Ticket Size",
    cell: ({ row }) => {
      const ticketSize = row.getValue<ClientData["ticket_size"]>("ticket_size");
      return <span>${ticketSize}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<ClientData["status"]>("status");
      const badgeVariant = statusBadgeMap[status];

      return <Badge variant={badgeVariant}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const client = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      //   const { openModal, closeModal } = useModal();

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
            //   onClick={() =>
            //     openModal(
            //       <CustomModal
            //         title="Edit Client Details"
            //         caption="Edit the client's details"
            //       >
            //         TO DO: Add form for editing client details
            //       </CustomModal>
            //     )
            //   }
            >
              {t("ACTIONS.EDIT_DETAILS")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(client.email)}
            >
              {t("ACTIONS.COPY_EMAIL")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {client.status === "ACTIVE"
                ? t("ACTIONS.SET_INACTIVE")
                : t("ACTIONS.SET_ACTIVE")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t("ACTIONS.DELETE")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
