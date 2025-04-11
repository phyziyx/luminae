import Logo from "@/components/logo";
import ChooseYourPath from "@/components/onboarding/choose-your-path";
import { getSession } from "@/lib/auth/auth";
import AgencyManager from "@/lib/managers/agencyManager";
import { redirect } from "next/navigation";

export default async function Onboarding() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return;
  }

  const { email } = user;
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
