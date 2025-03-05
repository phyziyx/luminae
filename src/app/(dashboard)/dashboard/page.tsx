import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DollarSign, TicketIcon, UsersRoundIcon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getTranslations } from "next-intl/server";
import { ClosingRateChart } from "../components/chart/closing-rate-chart";
import AgencyManager from "@/lib/managers/agencyManager";
import { isAgencyAdmin } from "@/lib/utils";
import { redirect } from "next/navigation";
import KpiManager from "@/lib/managers/kpiManager";
import { Component } from "../components/chart/bar-chart";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const Dashboard = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  const t = await getTranslations();

  if (!user) {
    return <div>Not authenticated!</div>;
  }

  const agencyMember = await AgencyManager.findUserAgency(user.email);

  if (agencyMember && !isAgencyAdmin(agencyMember.role)) {
    redirect("/dashboard/workspace");
  }

  // const currentYear = new Date().getFullYear();

  const kpis = await KpiManager.fetchAgencyKpi(agencyMember!.agencyId);

  const kpiData = await KpiManager.fetchClientsOnboardedByMonth(
    agencyMember!.agencyId
  );

  const closingRateData = await KpiManager.fetchClientClosingRate(
    agencyMember!.agencyId
  );

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-3xl font-semibold">{t("DASHBOARD")}</h1>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-4">
          <Card className="bg-muted/50 dark:bg-muted flex-1 relative">
            <CardHeader>
              <CardDescription>{t("INCOME")}</CardDescription>
              <CardTitle className="text-4xl">${kpis.income}</CardTitle>
              {/* <small className="text-xs text-muted-foreground">
                {t("FOR_THE_YEAR", {
                  YEAR: currentYear,
                })}
              </small> */}
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t("INCOME_DESCRIPTION")}
            </CardContent>
            <DollarSign className="absolute right-4 top-4 text-muted-foreground" />
          </Card>

          <Card className="bg-muted/50 dark:bg-muted flex-1 relative">
            <CardHeader>
              <CardDescription>{t("POTENTIAL_INCOME")}</CardDescription>
              <CardTitle className="text-4xl">
                ${kpis.potentialIncome}
              </CardTitle>
              {/* <small className="text-xs text-muted-foreground">
                {t("FOR_THE_YEAR", {
                  YEAR: currentYear,
                })}
              </small> */}
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t("POTENTIAL_INCOME_DESCRIPTION")}
            </CardContent>
            <DollarSign className="absolute right-4 top-4 text-muted-foreground" />
          </Card>

          <Card className="bg-muted/50 dark:bg-muted flex-1 relative">
            <CardHeader>
              <CardDescription>{t("ACTIVE_WORKSPACES")}</CardDescription>
              <CardTitle className="text-4xl">{kpis.workspaces}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t("ACTIVE_WORKSPACES_DESCRIPTION")}
            </CardContent>
            <UsersRoundIcon className="absolute right-4 top-4 text-muted-foreground" />
          </Card>

          <Card className="bg-muted/50 dark:bg-muted flex-1 relative">
            <CardHeader>
              <CardDescription>{t("AGENCY_GOAL")}</CardDescription>
              <CardTitle className="text-4xl">{kpis.tickets}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t("AGENCY_GOAL_DESCRIPTION")}
            </CardContent>
            <TicketIcon className="absolute right-4 top-4 text-muted-foreground" />
          </Card>
        </div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-4 grid-cols-1">
          <Card className="bg-muted/50 dark:bg-muted md:col-span-3">
            <CardHeader>
              <CardTitle>{t("CLIENT_TIMELINE")}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* TODO: */}
              <Component data={kpiData} />
            </CardContent>
          </Card>
          <Card className="bg-muted/50 dark:bg-muted w-full">
            <CardHeader>
              <CardTitle>{t("SALES_PIPELINE")}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* TODO: */}
              <ClosingRateChart data={closingRateData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
