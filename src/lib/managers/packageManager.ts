import { Decimal } from "@prisma/client/runtime/library";
import prisma from "../db";

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
          },
          {
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
   * Get the package from the database using its ID
   * @param packageId The ID of the package
   */
  public static async getPackageById(packageId: string) {
    const packageData = await prisma.package.findUnique({
      where: { id: packageId },
      include: {
        features: true,
      },
    });

    if (!packageData) return null;

    // Convert Decimal fields to numbers
    return {
      ...packageData,
      monthlyPrice: (packageData.monthlyPrice as Decimal).toNumber(), // Safely convert Decimal to number
      features: packageData.features.map((feature) => ({
        ...feature,
        maxLimit: feature.maxLimit, // Convert other fields as needed
      })),
    };
  }

  /**
   * Get all the non-retired packages from the database
   */
  public static async getPackages() {
    return await prisma.package.findMany({
      where: { retired: false },
      include: {
        features: true,
      },
    });
  }

  /**
   * Update a package's primary details
   * @param packageId The ID of the package
   * @param data The data to update (e.g., name, status, monthlyPrice)
   */
  public static async updatePackage(packageId: string, data: { name: string }) {
    try {
      await prisma.package.update({
        where: { id: packageId },
        data,
      });
    } catch (error) {
      console.error("Failed to update package:", error);
      throw new Error("Failed to update package.");
    }
  }

  /**
   * Update the max limit of features
   * @param features Array of features with their IDs and new max limits
   */
  public static async updatePackageFeatures(
    features: Array<{ id: string; maxLimit: number }>
  ) {
    try {
      for (const feature of features) {
        await prisma.feature.update({
          where: { id: feature.id },
          data: { maxLimit: feature.maxLimit },
        });
      }
    } catch (error) {
      console.error("Failed to update features:", error);
      throw new Error("Failed to update features.");
    }
  }
}

export default PackageManager;
