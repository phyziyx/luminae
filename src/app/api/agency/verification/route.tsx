import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/db";
import BadgeManager from "@/lib/managers/badgeManager";
import { AgencyVerificationResponse, InfiniteQueryResponse } from "@/lib/types";
import { VerificationStatus } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id, status } = await request.json();

  if (!id || !["APPROVED", "REJECTED"].includes(status)) {
    return new NextResponse("Invalid request", { status: 400 });
  }

  try {
    const updatedVerification = await prisma.agencyVerification.update({
      where: { id, status: "PENDING" },
      data: { status },
    });

    if (status === "APPROVED") {
      BadgeManager.awardAchievement(
        {
          agencyId: updatedVerification.agencyId,
        },
        "VERIFIED"
      ).catch((err) => console.error("Failed to award VERIFIED badge:", err));
    }

    return NextResponse.json(updatedVerification);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to update verification status", {
      status: 500,
    });
  }
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const limit = 10;

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const rawFilter = searchParams.get("filter") || "ALL";

  const filter = ["ALL", "PENDING", "APPROVED", "REJECTED"].includes(rawFilter)
    ? rawFilter
    : "ALL";

  const offset = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.agencyVerification.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" },
      where: {
        ...(query
          ? {
              notes: { contains: query },
            }
          : {}),
        ...(filter !== "ALL" ? { status: filter as VerificationStatus } : {}),
      },
      select: {
        id: true,
        message: true,
        notes: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        agency: {
          select: {
            id: true,
            name: true,
            agencyLogo: true,
            companyEmail: true,
          },
        },
      },
    }),
    prisma.agencyVerification.count({
      where: {
        ...(query
          ? {
              notes: { contains: query },
            }
          : {}),
        ...(filter !== "ALL" ? { status: filter as VerificationStatus } : {}),
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    items,
    meta: {
      total,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  } satisfies AgencyVerificationResponse);
}
