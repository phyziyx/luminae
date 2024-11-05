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

export default pricingTiers;

// export const Pricing = () => {
//     return null;
// };