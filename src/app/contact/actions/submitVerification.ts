"use server";

import { z } from "zod";
import { getSession } from "@/lib/auth/auth";
import VerificationManager from "@/lib/managers/verificationManager";

const verificationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
});

export type VerificationFormInput = z.infer<typeof verificationSchema>;

export async function submitVerification(data: VerificationFormInput) {
  const session = await getSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const agencyId = await VerificationManager.getAgencyIdByUserId(
    session.user.id
  );

  if (!agencyId) {
    throw new Error("No agency found for user.");
  }

  const alreadyExists = await VerificationManager.hasActiveVerificationRequest(
    agencyId
  );
  if (alreadyExists) {
    throw new Error(
      "A verification request is already pending or approved for this agency."
    );
  }

  const isBlocked = await VerificationManager.isAgencyBlockedFromVerification(
    agencyId
  );
  if (isBlocked) {
    throw new Error(
      "This agency has been rejected too many times and cannot submit again."
    );
  }

  await VerificationManager.createVerification({
    name: data.name,
    email: data.email,
    message: data.message,
    agencyId,
  });

  return { success: true };
}
