"use server";

import { z } from "zod";
import packageFormSchema from "../package-details/schema";
import PackageManager from "@/lib/managers/packageManager";
import { revalidatePath } from "next/cache";

const onPackageUpdate = async (values: z.infer<typeof packageFormSchema>) => {
  let error = "An error occurred while updating the package.";

  // Validate incoming values using schema
  const validatedFields = packageFormSchema.safeParse(values);
  if (!validatedFields.success) {
    error = "Invalid fields provided.";
    return { error };
  }

  const { id: packageID, name, features } = validatedFields.data;

  if (!packageID) {
    error = "Package ID is required.";
    return { error };
  }

  try {
    // Update package details
    await PackageManager.updatePackage(packageID, {
      name,
    });

    // Map and validate features for the update
    if (features && features.length > 0) {
      // Retrieve existing features from the database
      const existingPackage = await PackageManager.getPackageById(packageID);

      if (!existingPackage) {
        throw new Error("Package not found.");
      }

      const mappedFeatures = features.map((feature) => {
        const existingFeature = existingPackage.features.find(
          (f) => f.code === feature.code
        );

        if (!existingFeature) {
          throw new Error(`Feature with code ${feature.code} not found.`);
        }


        return {
          id: existingFeature.id, // Use the existing feature ID
          maxLimit: feature.maxLimit || 0, // Ensure a valid maxLimit value
        };
      });

      // Perform the update
      await PackageManager.updatePackageFeatures(mappedFeatures);
    }

    error = ""; // Clear error on successful updates
  } catch (err) {
    console.error("Error updating package:", err);
    error = "An error occurred while attempting to update the package.";
  }

  // Revalidate the cache to reflect updates
  revalidatePath("/packages");

  return { error };
};

export default onPackageUpdate;