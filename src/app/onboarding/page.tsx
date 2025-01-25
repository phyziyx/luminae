"use server";

import Logo from "@/components/logo";
import ChooseYourPath from "@/components/onboarding/choose-your-path";
import AgencyManager from "@/lib/managers/agencyManager";
import UserManager from "@/lib/managers/userManager";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Onboarding() {
  const user = await currentUser();
  const { redirectToSignIn } = await auth();

  if (!user) {
    redirectToSignIn();
    return;
  }

  const email = user.emailAddresses[0].emailAddress;

  const foundUser = await UserManager.findUser(email);
  if (!foundUser) {
    // User not found, lets create an account...
    await UserManager.createUser({
      id: user.id,
      email: email,
      firstName: user.firstName!,
      lastName: user.lastName!,
      avatarUrl: user.imageUrl,
    });
  }

  const agencyMember = await AgencyManager.findUserAgency(email);

  if (agencyMember) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Logo className="text-blue-500 max-w-sm" />
      <ChooseYourPath />
    </div>
  );
}
