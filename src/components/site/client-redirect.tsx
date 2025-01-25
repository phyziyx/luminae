"use client";

import { useRouter } from "next/navigation";
import type { Route } from "next";
import { useEffect } from "react";

export default function ClientRedirect({ href }: { href: Route }) {
  const router = useRouter();

  useEffect(() => {
    router.push(href);
  }, []);

  return null;
}
