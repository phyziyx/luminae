"use server";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { Suspense } from "react";
import FallbackSpinner from "@/components/site/fallback-spinner";
import PackageManager from "@/lib/managers/packageManager";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";

const t = await getTranslations({ locale: "en" });

interface PackageListProps {
  data: {
    id: string;
    name: string;
    monthlyPrice: number;
    status: string;
  }[];
}

const PackagesList = ({ data }: PackageListProps) => {
  return <DataTable columns={columns} data={data} />;
};

const PackagesPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user) {
    return <div>{t("ERROR_MESSAGES.NOT_AUTHENTICATED")}</div>;
  }

  const packages = await PackageManager.getPackages();

  // Map the fetched data into a format that the table expects
  const data = packages.map((pkg) => {
    const features = pkg.features
      ? pkg.features
          .map((feature) => ({ [feature.code]: feature.maxLimit }))
          .reduce((acc, cur) => ({ ...acc, ...cur }), {})
      : {};
    return {
      id: pkg.id,
      name: pkg.name,
      monthlyPrice: pkg.monthlyPrice.toNumber(), // Convert Decimal to number
      status: pkg.retired ? "Retired" : "Active", // Package status
      ...features,
    };
  });

  return (
    <>
      <header className="flex h-16 items-center px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <h1 className="text-3xl font-semibold">{t("PACKAGES")}</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Suspense fallback={<FallbackSpinner />}>
          <PackagesList data={data} />
        </Suspense>
      </div>
    </>
  );
};

export default PackagesPage;
