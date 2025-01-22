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
import { useTranslations } from "next-intl";
import { currencyFormat } from "@/lib/utils";
import CustomModal from "@/components/site/custom-modal";
import UpsertClientModal from "../modals/upsert-client-modal";
import { useModal } from "@/providers/modal-provider";
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
  ticketSize: number;
  status: string;
};

// Map status to badge variants
const statusBadgeMap: Record<
  ClientData["status"],
  "default" | "destructive" | "secondary"
> = {
  ACTIVE: "default",
  INACTIVE: "destructive",
  // LEAD: "secondary",
  ONBOARDING: "secondary",
  LOST: "destructive",
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
    accessorKey: "ticketSize",
    header: "Ticket Size",
    cell: ({ row }) => {
      const ticketSize = row.getValue<ClientData["ticketSize"]>("ticketSize");
      return <span>{currencyFormat(ticketSize)}</span>;
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
                    title="Edit Client Details"
                    caption="Edit the client's details"
                  >
                    {
                      <UpsertClientModal
                        clientId={client.id}
                        onClose={closeModal}
                        create={false}
                      />
                    }
                  </CustomModal>
                )
              }
            >
              {t("ACTIONS.EDIT_DETAILS")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(client.email)}
            >
              {t("ACTIONS.COPY_EMAIL")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
