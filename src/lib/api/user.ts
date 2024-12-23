"use server";

import prisma from "@/lib/db";

export const fetchUserDetails = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl || "",
    email: user.email || "",
    stripeConnectAccountId: user.stripeConnectAccountId || "",
    stripeCustomerId: user.stripeCustomerId || "",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};