import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

const pricingTiers = [
  {
    title: "Starter",
    monthlyPrice: 0,
    buttonText: "Sign up now",
    popular: false,
    inverse: false,
    features: [
      "Up to 3 team members",
      "Community Access",
      "5GB storage",
      "Basic integrations",
      "Email support",
    ],
  },
  {
    title: "Professional",
    monthlyPrice: 29,
    buttonText: "Sign up Now",
    popular: true,
    inverse: true,
    features: [
      "Up to 15 team members",
      "Unlimited projects",
      "50GB storage",
      "Advanced integrations",
      "Priority email support",
      "Task automation",
    ],
  },
  {
    title: "Enterprise",
    monthlyPrice: 99,
    buttonText: "Sign up Now",
    popular: false,
    inverse: false,
    features: [
      "Unlimited team members",
      "Unlimited projects",
      "500GB storage",
      "All integrations",
      "Dedicated account manager",
      "Phone support",
      "Custom onboarding",
      "API access",
    ],
  },
];


export const Pricing = async() => {
  const t = await getTranslations();
    return <section className="py-24">
    <div className="container">
      <div className="max-w-[540px] mx-auto">
        <h2 className="section-title">{t("PRICING")}</h2>
        <p className="section-description mt-5">
          {t("PRICING_DESCRIPTION")}
        </p>
      </div>
      <div className="flex flex-col gap-6 items-center mt-10 lg:flex-row lg:items-end lg:justify-center">
        {pricingTiers.map(
          ({
            title,
            monthlyPrice,
            buttonText,
            popular,
            inverse,
            features,
          }) => (
            <div
              className={cn(
                "p-10 border border-[#F1F1F1] rounded-3xl shadow-[0_7px_14px_#EAEAEA] max-w-xs w-full",
                inverse === true &&
                  "border-primary bg-primary text-primary-foreground"
              )}
            >
              <div className="flex justify-between">
                <h3
                  className={cn(
                    "text-lg font-bold text-black/50",
                    inverse === true && "text-white"
                  )}
                >
                  {title}
                </h3>
                {popular === true && (
                  <div className="inline-flex text-sm px-4 py-1.5 rounded-xl border border-white">
                    <span className="bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF)] text-transparent bg-clip-text font-bold">
                      Popular
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-baseline gap-1 mt-[30px]">
                <span className="text-4xl font-bold tracking-tighter leading-none">
                  ${monthlyPrice}
                </span>
                <span className="tracking-tight font-bold text-black/50">
                  /month
                </span>
              </div>
              <Button
                className={cn(
                  "w-full mt-[30px] hover:bg-black hover:text-white",
                  inverse === true && "bg-white text-black"
                )}
              >
                {buttonText}
              </Button>
              <ul className="flex flex-col gap-5 mt-8">
                {features.map((feature) => (
                  <li className="text-sm flex items-center gap-4">
                    <CheckIcon className="h-6 w-6" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        )}
      </div>
    </div>
  </section>;
};

export default Pricing;