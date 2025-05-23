import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/db";
import AgencyManager from "@/lib/managers/agencyManager";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const user = session?.user;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const agencyMember = await AgencyManager.findUserAgency(user.email);
    if (!agencyMember) {
      return NextResponse.json(
        { error: "Not part of any agency" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
