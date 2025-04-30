"use client";

import { useLinkStatus } from "next/link";
import { LoadingSpinner } from "./loading-spinner";

export default function LoadingIndicator() {
  const { pending } = useLinkStatus();
  return pending ? <LoadingSpinner /> : null;
}
