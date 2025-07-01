import { getSession } from "@/lib/auth/auth";
import AgencyManager from "@/lib/managers/agencyManager";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const agencyMember = await AgencyManager.findUserAgency(user.email);

  return NextResponse.json({
    canPostAsAgency: !!agencyMember?.agencyId,
  });
}
