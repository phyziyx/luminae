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
import { useTranslations } from "next-intl";
import UpdateUserModal from "./modals/update-user-modal";
import { toast } from "@/hooks/use-toast";
import deleteUser from "./actions/delete-user";

// Define user data type
export type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

// Map status to badge variants
const statusBadgeMap: Record<
  UserData["status"],
  "default" | "destructive" | "secondary"
> = {
  Active: "default",
  Inactive: "destructive",
};

// Define the columns for the user table
export const columns: ColumnDef<UserData>[] = [
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
      const role = row.getValue<UserData["role"]>("role");
      return <span>{t(`ROLES.${role}`)}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<UserData["status"]>("status");
      const badgeVariant = statusBadgeMap[status];

      return <Badge variant={badgeVariant}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { openModal, closeModal } = useModal();
      const handleDeleteClick = async () => {
        try {
          const result = await deleteUser({ id: user.id });
          if (result.error) {
            toast({
              variant: "destructive",
              title: "Error Deleting User",
              description: result.error,
            });
          } else {
            toast({
              title: "User Deleted",
              description: `${user.name} has been successfully deleted.`,
            });
          }
        } catch {
          toast({
            variant: "destructive",
            title: "Error Deleting User",
            description:
              "There was an issue deleting the user. Please try again.",
          });
        }
      };

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
                    title={t("USER_FORM.EDIT_USER")}
                    caption={t("USER_FORM.EDIT_USER_CAPTION")}
                  >
                    <UpdateUserModal userId={user.email} onClose={closeModal} />
                  </CustomModal>
                )
              }
            >
              {t("ACTIONS.EDIT_DETAILS")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.email)}
            >
              {t("ACTIONS.COPY_EMAIL")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDeleteClick}>
              {t("ACTIONS.DELETE")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
