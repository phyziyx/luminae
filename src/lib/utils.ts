import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Role } from "@prisma/client";

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
