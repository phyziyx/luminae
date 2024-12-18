"use server";

import UserManager from "@/lib/managers/userManager";
import { currentUser } from "@clerk/nextjs/server";

export default async function getTeamMemberDetails(memberId: string) {
  console.log("called it", memberId);
  const user = await currentUser();

  if (!user) {
    console.log("User not found");
    throw new Error("User not found");
  }

  const member = await UserManager.findUser(memberId);
  console.log("member", member);
  return member;
}
