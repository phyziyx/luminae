import prisma from "../db";

// const pricingTiers: PricingCard[] = [
//   {
//     title: "Starter",
//     monthlyPrice: 0,
//     popular: false,
//     features: [
//       "Up to 3 team members",
//       "Community Access",
//       "5GB storage",
//       "Basic integrations",
//       "Email support",
//     ],
//   },
//   {
//     title: "Professional",
//     monthlyPrice: 29,
//     popular: true,
//     features: [
//       "Up to 15 team members",
//       "Unlimited projects",
//       "50GB storage",
//       "Advanced integrations",
//       "Priority email support",
//       "Task automation",
//     ],
//   },
//   {
//     title: "Enterprise",
//     monthlyPrice: 99,
//     popular: false,
//     features: [
//       "Unlimited team members",
//       "Unlimited projects",
//       "500GB storage",
//       "All integrations",
//       "Dedicated account manager",
//       "Phone support",
//       "Custom onboarding",
//       "API access",
//     ],
//   },
// ];

class PackageManager {
  public static FREE_PLAN_PRICE_ID = "FREE";

  /**
   * Get the package from the database from the provided Stripe's Product Price ID
   * @param priceId The Stripe Stripe Produce Price ID
   */
  public static async getPackageByPriceId(priceId: string) {
    return await prisma.package.findFirst({
      where: {
        OR: [
          {
            stripePriceIdMonthly: priceId,
            stripePriceIdAnnually: priceId,
          },
        ],
      },
      include: {
        features: true,
      },
    });
  }

  /**
   * Get all the non-retired packages from the databases
   */
  public static async getPackages() {
    // Dummy packages for the testing

    // return [
    //   {
    //     id: "1",
    //     name: "Starter",
    //     monthlyPrice: new Decimal(0),
    //     discountRate: 0,
    //     retired: false,
    //     features: [
    //       {
    //         id: "1",
    //         code: "WORKSPACE",
    //         name: "Workspace",
    //         maxLimit: 3,
    //         hasAccess: true,
    //         packageId: "1",
    //       },
    //       {
    //         id: "2",
    //         code: "TEAM_MEMBERS",
    //         name: "Team Members",
    //         maxLimit: 3,
    //         hasAccess: true,
    //         packageId: "1",
    //       },
    //     ],
    //   },
    //   {
    //     id: "2",
    //     name: "Professional",
    //     monthlyPrice: new Decimal(29),
    //     discountRate: 0,
    //     retired: false,
    //     features: [
    //       {
    //         id: "1",
    //         code: "WORKSPACE",
    //         name: "Workspace",
    //         maxLimit: 10,
    //         hasAccess: true,
    //         packageId: "1",
    //       },
    //       {
    //         id: "2",
    //         code: "TEAM_MEMBERS",
    //         name: "Team Members",
    //         maxLimit: 15,
    //         hasAccess: true,
    //         packageId: "1",
    //       },
    //     ],
    //   },
    // ];

    return await prisma.package.findMany({
      where: {
        retired: false,
      },
      include: {
        features: true,
      },
    });
  }
}

export default PackageManager;
