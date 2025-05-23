import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/db";
import AgencyManager from "@/lib/managers/agencyManager";
import { renameFile } from "@/lib/r2";
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

    const { key, newName } = await request.json();

    if (!key || !newName) {
      return NextResponse.json(
        { error: "File key and new name are required" },
        { status: 400 }
      );
    }

    // Verify that the file belongs to the user's agency
    const file = await prisma.agencyFile.findFirst({
      where: {
        key,
        agencyId: agencyMember.agencyId,
      },
    });

    if (!file) {
      return NextResponse.json(
        { error: "File not found or access denied" },
        { status: 404 }
      );
    }

    const newKey = `${agencyMember.agencyId}/${Date.now()}_${newName}`;

    // Rename the file in R2
    await renameFile(key, newKey);

    // Update the database with the new key and name
    await prisma.agencyFile.update({
      where: { key },
      data: {
        key: newKey,
        name: newName,
      },
    });

    return NextResponse.json({ success: true, newKey });
  } catch (error) {
    console.error("Rename error:", error);
    return NextResponse.json(
      { error: "Failed to rename file" },
      { status: 500 }
    );
  }
}
