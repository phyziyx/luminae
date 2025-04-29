import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Role } from "@prisma/client";
import { NotificationType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isAgencyAdmin(role: Role) {
  return role === "AGENCY_ADMIN" || role === "AGENCY_OWNER";
}

export function currencyFormat(currency: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(+currency);
}

export function getLinkByResourceType(
  resourceType: NotificationType,
  resourceId: string
) {
  switch (resourceType) {
    case "workspace":
      return `/workspace/${resourceId}`;
    // case "ticket":
    //   return `/ticket/${resourceId}`;
    default:
      return null;
  }
}
