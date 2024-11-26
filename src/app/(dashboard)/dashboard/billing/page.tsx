"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SubscriptionManager from "@/lib/managers/subscriptionManager";
import PackageManager from "@/lib/managers/packageManager";
import AgencyManager from "@/lib/managers/agencyManager";
import {
  ArrowBigUpDashIcon,
  CircleAlertIcon,
  DotIcon,
  FileCog2Icon,
  LinkIcon,
  NetworkIcon,
  UsersRoundIcon,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import React from "react";

const usages = [
  {
    icon: <UsersRoundIcon />,
    feature: "TEAM_MEMBERS",
  },
  {
    icon: <NetworkIcon />,
    feature: "WORKSPACE",
  },
  {
    icon: <FileCog2Icon />,
    feature: "FILE_STORAGE",
  },
  {
    icon: <LinkIcon />,
    feature: "CUSTOM_URL",
  },
];

const Billing = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  const t = await getTranslations();

  if (!userId || !user) {
    return <div>Not authenticated!</div>;
  }

  const agencyMember = await AgencyManager.findUserAgency(
    user.emailAddresses[0].emailAddress
  );
  const agency = agencyMember?.agency;

  if (!agency) {
    return <div>Not part of any agency!</div>;
  }

  const agencyId = agency?.id;
  const subscription = await SubscriptionManager.findByAgency(agencyId);

  // Get the subscription associated and then fetch the information for that package.
  const pricingPackage = await PackageManager.getPackageByPriceId(
    subscription?.priceId || PackageManager.FREE_PLAN_PRICE_ID
  );
  if (!pricingPackage) {
    // This code should never be reachable... so let's narrow down the type inference.
    return <></>;
  }

  const data = {
    isFree:
      !subscription ||
      subscription.packageId === PackageManager.FREE_PLAN_PRICE_ID,
    isExpired:
      Date.now() > (subscription?.currentPeriodEnd.valueOf() || Date.now()),
    expiryDate: subscription?.currentPeriodEnd.toLocaleDateString() || "N/A",
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-3xl font-semibold">{t("BILLING.HEADER")}</h1>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {t("BILLING.BILLING_DESCRIPTION")}

        <Card className="w-full bg-white dark:bg-muted/90">
          <CardHeader className="mt-0 mb-0 pt-0" />
          <CardContent className="flex flex-row justify-between place-items-center">
            <div className="flex flex-row gap-2">
              <CircleAlertIcon color="red" />{" "}
              {data.isFree
                ? t("BILLING.YOUR_PLAN_EXPIRES_ON_FREE")
                : !data.isExpired
                ? t("BILLING.YOUR_PLAN_EXPIRES_ON", {
                    DATE: "December 31st, 2024",
                  })
                : t("BILLING.YOUR_PLAN_HAS_EXPIRED_ON", {
                    DATE: data.expiryDate,
                  })}
            </div>
            <Button>{t("BILLING.EXPLORE_PLANS")}</Button>
          </CardContent>
          <CardFooter className="mb-0 mt-0 pb-0" />
        </Card>

        <div className="pt-2">
          <div className="flex h-5 items-center space-x-4 text-sm font-bold flex-row">
            <div>{pricingPackage.name}</div>
            <DotIcon />
            <div>{t("BILLING.CURRENT_PLAN")}</div>
          </div>
          <Separator className="my-4" />

          <Card>
            <CardHeader>
              <CardTitle>{t("BILLING.USAGE_DETAILS")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col justify-between gap-4">
                {pricingPackage.features.map((feature) => (
                  <UsageCard
                    key={feature.name}
                    icon={usages.find((u) => u.feature === feature.code)!.icon}
                    feature={t(`BILLING.${feature.code}`)}
                    value={0}
                    max={feature.maxLimit}
                  />
                ))}

                {/* {usages.map((usage) => (
                  <UsageCard
                    key={usage.feature}
                    icon={usage.icon}
                    feature={t(`BILLING.${usage.feature}`)}
                    value={usage.value}
                    max={usage.max}
                  />
                ))} */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

interface UsageCardProps {
  icon: JSX.Element;
  feature: string;
  value: number;
  max: number | null;
}

const UsageCard = ({ icon, feature, value, max }: UsageCardProps) => {
  // TODO: Infinite max value support and true/false for max value needed
  const maxValue = max || value + 1;
  const percentage = Math.floor((value / maxValue) * 100);

  return (
    <Card className="bg-white dark:bg-muted/90">
      <CardHeader>
        <CardTitle className="flex flex-row gap-4 items-center">
          {icon} {feature}
        </CardTitle>
      </CardHeader>
      <CardContent className="items-center">
        {max === 0 ? (
          <div className="flex flex-row justify-between">
            Upgrade to get access to {feature}
            <ArrowBigUpDashIcon className="w-16 h-16 text-muted-foreground" />
          </div>
        ) : (
          <div className="flex flex-row gap-4 items-center">
            <Progress value={percentage} />
            <span className="font-bold text-lg">
              {value}/{maxValue}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-0" />
    </Card>
  );
};

export default Billing;
