import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/community");
  }

  redirect("/community/profile/" + user.id);

  return null;
}
