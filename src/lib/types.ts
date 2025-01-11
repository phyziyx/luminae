import { Feature, Package } from "@prisma/client";

export type PricingPackage = Omit<Package, "monthlyPrice"> & {
  monthlyPrice: number;
  features: Feature[];
};
