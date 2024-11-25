"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SubscriptionManager from "@/lib/managers/subscriptionManager";
import PackageManager from "@/lib/managers/packageManager";

const Billing = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  const t = await getTranslations();

  if (!userId || !user) {
    return <div>Not authenticated!</div>;
  }

  const agencyId = '';
  const subscription = await SubscriptionManager.findByAgency(agencyId);

  // Get the subscription associated and then fetch the information for that package.
  const pricingPackage = await PackageManager.getPackageByPriceId(subscription?.priceId || PackageManager.FREE_PLAN_PRICE_ID);
  if (!pricingPackage) {
    // This code should never be reachable... so let's narrow down the type inference.
    return <></>;
  }

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

        <Card>
          <CardContent className="w-full flex flex-row justify-between">Your free plan ends on December 31st, 2024.  <Button>Explore Plans</Button></CardContent>
        </Card>

        Free Plan - {t("BILLING.CURRENT_PLAN")}

        <hr />
      </div>
    </>
  );
};

export default Billing;
