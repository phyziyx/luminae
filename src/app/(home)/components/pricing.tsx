"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import Heading from "./heading";
import { PricingPackage } from "@/lib/types";

interface PricingCardProps {
  data: PricingPackage;
  isAnnual: boolean;
}

const PricingCard = ({ data, isAnnual }: PricingCardProps) => {
  const t = useTranslations();

  // TODO: I've not yet programmed the functionality for the popular package...
  const popular = data.name === "Professional";

  // Hardcoding the 20% discount rate for going annual for now...
  const discountRate = 1.2;

  // months in a year, should really be a public constant somewhere else...
  const MONTHS_IN_YEAR = 12;

  // OG pricing...
  const monthlyPrice = data.monthlyPrice;
  const yearlyPrice = monthlyPrice * MONTHS_IN_YEAR;

  const discountedYearlyPrice = yearlyPrice / discountRate;
  // const discountedMonthlyPrice = discountedYearlyPrice / MONTHS_IN_YEAR;

  return (
    <div
      className={cn({
        "bg-primary rounded-3xl flex flex-col items-center place-items-center":
          popular,
      })}
    >
      {popular && (
        <Badge variant={"default"} className="p-2 font-bold text-sm text-white">
          MOST POPULAR
        </Badge>
      )}
      <Card
        className={cn(
          "bg-white dark:bg-muted p-8 border-2 rounded-3xl shadow-md max-w-xs w-full flex flex-col justify-between",
          {
            "border-primary": popular,
          }
        )}
      >
        <CardHeader className="text-2xl font-bold ">
          <CardTitle className="flex flex-col items-center -mt-6">
            {data.name}
            <div className="flex items-center justify-center gap-1 mt-[30px]">
              <span className="text-4xl font-bold tracking-tighter leading-none">
                $
                {monthlyPrice === 0
                  ? 0
                  : isAnnual
                  ? discountedYearlyPrice.toFixed(2)
                  : monthlyPrice.toFixed(2)}
              </span>
              <span className="text-base tracking-tight font-bold text-black/50 dark:text-gray-400">
                {monthlyPrice === 0
                  ? t("PRICING.LIFETIME")
                  : isAnnual
                  ? t("PRICING.PRICING_PER_YEAR")
                  : t("PRICING.PRICING_PER_MONTH")}
              </span>
            </div>
            {monthlyPrice > 0 && (
              <>
                <span className="text-base text-black/50 dark:text-gray-400">
                  {isAnnual
                    ? t("PRICING.SAVE_AMOUNT", {
                        AMOUNT: (yearlyPrice - discountedYearlyPrice).toFixed(
                          2
                        ),
                      })
                    : t("PRICING.ANNUAL_TOTAL", {
                        AMOUNT: yearlyPrice,
                      })}
                </span>
              </>
            )}
            <a
              target="_blank"
              href={isAnnual ? data.stripeLinkAnnually : data.stripeLinkMonthly}
            >
              <Button
                className={cn("w-full mt-[30px]", {
                  "dark:bg-slate-500": !popular,
                })}
                variant={popular ? "default" : "secondary"}
              >
                {t("CHOOSE_PLAN")} <ChevronRightIcon />
              </Button>
            </a>
          </CardTitle>
        </CardHeader>

        <CardFooter>
          <ul className="flex flex-col gap-5 mt-8">
            {data.features.map((feature, index) => (
              <li key={index} className="text-sm flex items-center gap-4">
                <CheckIcon className="h-6 w-6" />
                <span>
                  {feature.maxLimit === 0 ||
                  (feature.maxLimit && feature.maxLimit === -1)
                    ? t(`PACKAGE_FEATURES.ACCESS`, {
                        FEATURE_CODE: t(`PACKAGE_FEATURES.${feature.code}`),
                      })
                    : t(`PACKAGE_FEATURES.QUANTITY`, {
                        QUANTITY: feature.maxLimit,
                        FEATURE_CODE: t(`PACKAGE_FEATURES.${feature.code}`),
                      })}
                </span>
              </li>
            ))}
          </ul>
        </CardFooter>
      </Card>
    </div>
  );
};

interface PricingProps {
  packages: PricingPackage[];
}

import { authClient } from "@/lib/auth-client";

export const Pricing = ({ packages }: PricingProps) => {
  const t = useTranslations();

  const { data: session } = authClient.useSession();

  const user = useMemo(() => session?.user, [session]);

  const [isAnnual, setAnnual] = useState<boolean>(false);

  const getProductLink = (link: string) => {
    if (!link) {
      return "#";
    }

    return !user ? "/sign-in" : link + "?prefilled_email=" + user.email;
  };

  return (
    <section
      id="pricing"
      className="py-24 flex flex-col items-center place-items-center justify-center"
    >
      <Heading>{t("PRICING.HEADER")}</Heading>
      <p className="text-center text-base dark:text-white text-black leading-[30px] tracking-tight mt-5 text-normal md:text-lg">
        {t("PRICING.PRICING_DESCRIPTION")}
      </p>

      <div className="relative self-center mt-6 bg-blue-500/10 rounded-lg p-0.5 flex sm:mt-8 border">
        <button
          onClick={() => setAnnual(false)}
          type="button"
          className={`${
            isAnnual === false
              ? "relative w-1/2 bg-blue-500 border-blue-800 shadow-sm text-white"
              : "ml-0.5 relative w-1/2 border border-transparent text-zinc-500"
          } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
        >
          {t("PRICING.PRICING_BILLED_MONTHLY")}
        </button>
        <button
          onClick={() => setAnnual(true)}
          type="button"
          className={`${
            isAnnual === true
              ? "relative w-1/2 bg-blue-500 border-blue-800 shadow-sm text-white"
              : "ml-0.5 relative w-1/2 border border-transparent text-zinc-500"
          } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
        >
          {t("PRICING.PRICING_BILLED_YEARLY")}
        </button>
      </div>

      {/* <div className="flex flex-row items-center gap-2 mt-10">
        <span
          className={cn("font-bold", {
            "text-primary": !isAnnual,
          })}
        >
          {t("PRICING.PRICING_BILLED_MONTHLY")}
        </span>
        <Switch
          checked={isAnnual}
          onCheckedChange={(value) => setAnnual(value)}
        />
        <span
          className={cn("font-bold", {
            "text-primary": isAnnual,
          })}
        >
          {t("PRICING.PRICING_BILLED_YEARLY")}
        </span>
      </div> */}

      <div className="flex flex-col gap-6 items-center mt-10 lg:flex-row lg:items-end lg:justify-center">
        {packages.map((p) => (
          <PricingCard
            key={p.id}
            data={{
              ...p,
              stripeLinkAnnually: getProductLink(p.stripeLinkAnnually),
              stripeLinkMonthly: getProductLink(p.stripeLinkMonthly),
            }}
            isAnnual={isAnnual}
          />
        ))}
      </div>
    </section>
  );
};

export default Pricing;
