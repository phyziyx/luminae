import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/db";
import AgencyManager from "@/lib/managers/agencyManager";
import SubscriptionManager from "@/lib/managers/subscriptionManager";
import { type NextRequest, NextResponse } from "next/server";
import { type AgencyFilesResponse } from "@/lib/types";
import { deleteFile, getFileMetadata, uploadFile } from "@/lib/r2";

export async function GET(request: NextRequest) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    throw new Error("Unauthorized");
  }

  const agencyMember = await AgencyManager.findUserAgency(user.email);
  if (!agencyMember) {
    throw new Error("Not part of any agency");
  }

  const searchName = request.nextUrl.searchParams.get("search");
  const cursorParam = request.nextUrl.searchParams.get("cursor");
  const cursor = cursorParam ? cursorParam : undefined;
  const takeLimit = 10;

  const files = await prisma.agencyFile.findMany({
    take: takeLimit,
    skip: cursor ? 1 : undefined,
    cursor: cursor
      ? {
          key: cursor,
        }
      : undefined,
    where: {
      agencyId: agencyMember.agencyId,
      ...(searchName ? { name: { contains: searchName } } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalFiles = await prisma.agencyFile.count({
    where: {
      agencyId: agencyMember.agencyId,
    },
  });

  const nextCursor = totalFiles > takeLimit ? files.at(-1)?.key : undefined;
  return NextResponse.json({
    items: files,
    nextCursor,
  } satisfies AgencyFilesResponse);
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const agencyMember = await AgencyManager.findUserAgency(user.email);
  if (!agencyMember) throw new Error("Not part of any agency");

  const { key } = await request.json();

  // Delete from DB
  await prisma.agencyFile.delete({
    where: {
      key,
      agencyId: agencyMember.agencyId,
    },
  });

  // Delete from R2
  await deleteFile(key);

  return NextResponse.json({ success: true });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const agencyMember = await AgencyManager.findUserAgency(user.email);
  if (!agencyMember) throw new Error("Not part of any agency");

  const { free, maxLimit, used } =
    await SubscriptionManager.checkFileStorageLimit(agencyMember.agencyId);

  if (!free) {
    return NextResponse.json(
      {
        error: `File storage limit reached. You have used ${used}MB out of ${maxLimit}MB.`,
      },
      { status: 400 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return new NextResponse("No file found", { status: 400 });
  }

  const fileSize = file.size / (1024 * 1024); // Convert to MB
  if (fileSize > free) {
    return NextResponse.json(
      {
        error: `File size exceeds the limit. You have ${free}MB left.`,
      },
      { status: 400 }
    );
  }

  // Convert file to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const key = `${agencyMember.agencyId}/${Date.now()}_${file.name}`;

  // Upload to R2
  await uploadFile(buffer, key, file.type);

  // Get file metadata
  const headRes = await getFileMetadata(key);

  // Save to DB
  await prisma.agencyFile.create({
    data: {
      createdAt: new Date(),
      key: key,
      name: file.name,
      size: headRes.ContentLength ?? file.size,
      agencyId: agencyMember.agencyId,
    },
  });

  return NextResponse.json({ success: true, key });
}
