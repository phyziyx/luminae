"use server";

import Link from "next/link";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations();

  return (
    <div className="flex items-center justify-center min-h-[100dvh]">
      <div className="max-w-md space-y-8 p-4 text-center">
        <div className="flex justify-center">
          <Logo className="text-blue-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          {t("NOT_FOUND.TITLE")}
        </h1>
        <p className="text-base text-gray-500">{t("NOT_FOUND.CAPTION")}</p>
        <Link
          href={"/"}
          className="max-w-48 mx-auto flex justify-center py-2 px-4 shadow-sm text-sm font-medium"
        >
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
