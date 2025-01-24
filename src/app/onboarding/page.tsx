"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckboxCard } from "@/components/site/checkbox-card";
import AgencyDetails from "../(dashboard)/components/agency-details/agency-details";
import Link from "next/link";

function CommunityUser() {
  return (
    <div className="max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">
        Welcome, Community Member!
      </h2>
      <p className="text-lg mb-6 text-blue-700 dark:text-slate-100">
        Our community forums are coming soon...
      </p>
      <p className="text-blue-600 dark:text-slate-100">
        We're working hard to bring you an amazing community experience. Stay
        tuned for updates, and thank you for your patience!
      </p>
      <Link href="/">
        <Button className="mt-2">Go Back</Button>
      </Link>
    </div>
  );
}

export default function Onboarding() {
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
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-4xl p-8 bg-white dark:bg-muted/40 rounded-lg">
        {step === 1 ? (
          <>
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-500 dark:text-blue-700">
              Choose Your Path
            </h1>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <CheckboxCard
                title="I'm an Agency Owner"
                caption="Create your agency and streamline your operations + access community forums"
                selected={selectedOption === "agency"}
                onSelect={() => handleSelect("agency")}
              />
              <CheckboxCard
                title="I'm a Community Member"
                caption="Browse our community forums"
                note="You can choose to create your agency later"
                selected={selectedOption === "community"}
                onSelect={() => handleSelect("community")}
              />
            </div>
            <div className="flex justify-center">
              <Button
                onClick={handleNext}
                disabled={!selectedOption}
                variant={"default"}
                // className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white"
              >
                NEXT
              </Button>
            </div>
          </>
        ) : selectedOption === "agency" ? (
          <AgencyDetails />
        ) : (
          <CommunityUser />
        )}
      </div>
    </div>
  );
}
