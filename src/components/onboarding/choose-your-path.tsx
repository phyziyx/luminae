"use client";

import { useState } from "react";
import { CheckboxCard } from "@/components/site/checkbox-card";
import AgencyDetails from "@/app/(dashboard)/components/agency-details/agency-details";
import CommunityUser from "./community-user";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

export default function ChooseYourPath() {
  const t = useTranslations();

  const [selectedOption, setSelectedOption] = useState<
    "agency" | "community" | null
  >(null);
  const [step, setStep] = useState(1);

  const handleSelect = (option: "agency" | "community") => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption) {
      setStep(2);
    }
  };

  return (
    <div className="w-full max-w-4xl p-8 bg-white dark:bg-muted/40 rounded-lg">
      {step === 1 ? (
        <>
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-500 dark:text-blue-700">
            {t("ONBOARDING.CHOOSE_YOUR_PATH")}
          </h1>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <CheckboxCard
              title={t("ONBOARDING.AGENCY_OWNER")}
              caption={t("ONBOARDING.AGENCY_OWNER_CAPTION")}
              selected={selectedOption === "agency"}
              onSelect={() => handleSelect("agency")}
            />
            <CheckboxCard
              title={t("ONBOARDING.FORUM_MEMBER")}
              caption={t("ONBOARDING.FORUM_MEMBER_CAPTION")}
              note={t("ONBOARDING.FORUM_MEMBER_NOTE")}
              selected={selectedOption === "community"}
              onSelect={() => handleSelect("community")}
            />
          </div>
          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              disabled={!selectedOption}
              variant={"default"}
            >
              {t("ONBOARDING.NEXT")}
            </Button>
          </div>
        </>
      ) : selectedOption === "agency" ? (
        <AgencyDetails />
      ) : (
        <CommunityUser />
      )}
    </div>
  );
}
