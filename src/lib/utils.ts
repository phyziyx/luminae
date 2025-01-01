import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AccountType } from "./types";
import { Role } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStripeOAuthLink(accountType: AccountType, state: string) {
  return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${process.env.NEXT_PUBLIC_URL}${accountType}&state=${state}`;
}

export function isAgencyAdmin(role: Role) {
  return role === "AGENCY_ADMIN" || role === "AGENCY_OWNER";
}
