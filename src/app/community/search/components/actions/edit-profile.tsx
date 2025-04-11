"use server";

import { z } from "zod";
import { communityProfileSchema } from "@/lib/forms";
import { revalidatePath } from "next/cache";
import ProfileManager from "@/lib/managers/profileManager";
import { getSession } from "@/lib/auth/auth";

const updateUserProfile = async (
  values: z.infer<typeof communityProfileSchema>,
  isAgency: boolean = false
) => {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    console.error("Unauthenticated request to update profile.");
    return { error: "You must be signed in to update your profile." };
  }

  const validatedFields = communityProfileSchema.safeParse(values);
  if (!validatedFields.success) {
    console.warn("Invalid profile input:", validatedFields.error.flatten());
    return { error: "Invalid profile fields provided." };
  }

  try {
    await ProfileManager.updateProfile(validatedFields.data, isAgency);
    revalidatePath("/community/profile", "page");
    return { error: "" };
  } catch (err) {
    console.error("Unexpected error updating profile:", err);
    return { error: "Something went wrong while updating your profile." };
  }
};

export default updateUserProfile;
