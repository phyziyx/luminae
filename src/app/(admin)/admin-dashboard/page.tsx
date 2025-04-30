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
import {
  DollarSign,
  Goal,
  TrendingUpDownIcon,
  UsersRoundIcon,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getTranslations } from "next-intl/server";
import AgencyManager from "@/lib/managers/agencyManager";
import UserManager from "@/lib/managers/userManager";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import stripeManager from "@/lib/managers/stripeManager";
import { getSession } from "@/lib/auth/auth";
import PostManager from "@/lib/managers/postManager";

const Dashboard = async () => {
  const session = await getSession();
  const user = session?.user;

  const t = await getTranslations();

  if (!user) {
    return <div>Not authenticated!</div>;
  }

  const agencyCount = await AgencyManager.getAllAgenciesCount();
  const userCount = await UserManager.getAllUsersCount();
  const communityPosts = await PostManager.getCount();

  const goalProgress = 100;
  const currentGoal = 1000;
  const progressPercent = (goalProgress / currentGoal) * 100;

  const subscriptions = await stripeManager.stripe.subscriptions.list({
    limit: 10,
  });

  const { difference, lastMonth, thisMonth } =
    await AgencyManager.getRegistrationRate();

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
              <CardDescription>Total Agencies</CardDescription>
              <CardTitle className="text-4xl">{agencyCount}</CardTitle>
              {/* <small className="text-xs text-muted-foreground">
                {t("FOR_THE_YEAR", {
                  YEAR: currentYear,
                })}
              </small> */}
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Total number of agencies in the system
            </CardContent>
            <DollarSign className="absolute right-4 top-4 text-muted-foreground" />
          </Card>

          <Card className="bg-muted/50 dark:bg-muted flex-1 relative">
            <CardHeader>
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-4xl">{userCount}</CardTitle>
              {/* <small className="text-xs text-muted-foreground">
                {t("FOR_THE_YEAR", {
                  YEAR: currentYear,
                })}
              </small> */}
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Total number of users in the system
            </CardContent>
            <DollarSign className="absolute right-4 top-4 text-muted-foreground" />
          </Card>

          <Card className="bg-muted/50 dark:bg-muted flex-1 relative">
            <CardHeader>
              <CardDescription>Total Community Posts</CardDescription>
              <CardTitle className="text-4xl">{communityPosts}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Total number of community posts in the system
            </CardContent>
            <UsersRoundIcon className="absolute right-4 top-4 text-muted-foreground" />
          </Card>

          <Card className="bg-muted/50 dark:bg-muted flex-1 relative">
            <CardHeader>
              <CardTitle>Platform Goal</CardTitle>
              <CardDescription>
                <span className="mt-2">{t("PLATFORM_GOAL_DESCRIPTION")}</span>
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
        <div className="grid auto-rows-min gap-4 md:grid-cols-4 grid-cols-1">
          <Card className="bg-muted/50 dark:bg-muted md:col-span-3">
            <CardHeader>
              <CardTitle>{t("LATEST_AGENCIES")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>{t("LATEST_AGENCIES_DESCRIPTION")}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.data.map((sub, id) => (
                    <TableRow key={sub.id}>
                      <TableCell className="w-fit font-medium">
                        {id + 1}
                      </TableCell>
                      <TableCell>{sub.items.data[0].plan.nickname}</TableCell>
                      <TableCell>{sub.status}</TableCell>
                      <TableCell>{sub.customer.toString()}</TableCell>
                      <TableCell className="text-right">
                        $
                        {sub?.items?.data[0]?.plan?.amount
                          ? (sub.items.data[0].plan.amount / 100).toFixed(2)
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="bg-muted/50 dark:bg-muted w-full">
            <CardHeader>
              <CardTitle>Retention Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                  <CardTitle>Agencies Registered This Month</CardTitle>
                </CardHeader>
                <CardContent className="pt-2 flex flex-col items-center place-items-center pb-0">
                  <div>Trending by</div>
                  <div className="text-4xl font-semibold flex flex-row gap-2 items-center">
                    {difference}% <TrendingUpDownIcon className="h-4 w-4" />
                  </div>
                  <div>this month</div>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-xs">
                  {thisMonth} this month, compared to {lastMonth} last month.
                </CardFooter>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
