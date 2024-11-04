"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { DollarSign, Goal, UsersRoundIcon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getTranslations } from "next-intl/server";

const Dashboard = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  const t = await getTranslations();

  if (!userId || !user) {
    return <div>Not authenticated!</div>;
  }

  const currentYear = new Date().getFullYear();

  const income = Intl.NumberFormat("en-US").format(1337);
  const potentialIncome = Intl.NumberFormat("en-US").format(4200);
  const activeClients = 12;
  const goalProgress = 6;
  const currentGoal = 9;

  const progressPercent = (goalProgress / currentGoal) * 100;

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
              <CardTitle className="text-4xl">${income}</CardTitle>
              <small className="text-xs text-muted-foreground">
                {t("FOR_THE_YEAR", {
                  YEAR: currentYear,
                })}
              </small>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t("INCOME_DESCRIPTION")}
            </CardContent>
            <DollarSign className="absolute right-4 top-4 text-muted-foreground" />
          </Card>

          <Card className="bg-muted/50 dark:bg-muted flex-1 relative">
            <CardHeader>
              <CardDescription>{t("POTENTIAL_INCOME")}</CardDescription>
              <CardTitle className="text-4xl">${potentialIncome}</CardTitle>
              <small className="text-xs text-muted-foreground">
                {t("FOR_THE_YEAR", {
                  YEAR: currentYear,
                })}
              </small>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t("POTENTIAL_INCOME_DESCRIPTION")}
            </CardContent>
            <DollarSign className="absolute right-4 top-4 text-muted-foreground" />
          </Card>

          <Card className="bg-muted/50 dark:bg-muted flex-1 relative">
            <CardHeader>
              <CardDescription>{t("ACTIVE_WORKSPACES")}</CardDescription>
              <CardTitle className="text-4xl">{activeClients}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t("ACTIVE_WORKSPACES_DESCRIPTION")}
            </CardContent>
            <UsersRoundIcon className="absolute right-4 top-4 text-muted-foreground" />
          </Card>

          <Card className="bg-muted/50 dark:bg-muted flex-1 relative">
            <CardHeader>
              <CardTitle>{t("AGENCY_GOAL")}</CardTitle>
              <CardDescription>
                <span className="mt-2">{t("AGENCY_GOAL_DESCRIPTION")}</span>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    {t("CURRENT_GOAL_ACHIEVED", {
                      GOAL: goalProgress,
                    })}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {t("CURRENT_GOAL", {
                      GOAL: currentGoal,
                    })}
                  </span>
                </div>
                <Progress value={progressPercent} />
              </div>
            </CardFooter>
            <Goal className="absolute right-4 top-4 text-muted-foreground" />
          </Card>
        </div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-4">
          <Card className="bg-muted/50 dark:bg-muted col-span-3 flex-1">
            <CardHeader>
              <CardTitle>{t("TRANSACTION_HISTORY")}</CardTitle>
            </CardHeader>
            <CardContent>{/* TODO: */}</CardContent>
          </Card>
          <Card className="bg-muted/50 dark:bg-muted w-full">
            <CardHeader>
              <CardTitle>{t("CLOSING_RATE")}</CardTitle>
            </CardHeader>
            <CardContent>{/* TODO: */}</CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
