import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/db";
import { backendClient } from "@/lib/edgestore/edgestore";
import AgencyManager from "@/lib/managers/agencyManager";
import { unstable_noStore } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const isAgency = req.nextUrl.searchParams.get("agency");
  let fileToDelete: string | null = null;
  let entityId: string | null = null;

  if (isAgency) {
    const agencyMember = await AgencyManager.findUserAgency(user.email);
    if (!agencyMember) {
      return new NextResponse("No agency found", { status: 404 });
    }

    const agency = await prisma.agency.findFirst({
      select: {
        agencyLogo: true,
      },
      where: {
        id: agencyMember.id,
      },
    });

    if (!agency || !agency.agencyLogo) {
      return new NextResponse("No image found", { status: 404 });
    }

    entityId = agencyMember.agencyId;
    fileToDelete = agency.agencyLogo;
  } else {
    const foundUser = await prisma.user.findFirst({
      select: {
        image: true,
      },
      where: {
        id: user.id,
      },
    });

    if (!foundUser || !foundUser.image) {
      return new NextResponse("No image found", { status: 404 });
    }

    fileToDelete = foundUser.image;
    entityId = user.id;
  }

  if (!fileToDelete) {
    return new NextResponse("No image found", { status: 404 });
  }

  const response = await backendClient.profilePictures.deleteFile({
    url: fileToDelete,
  });

  if (!response.success) {
    return new NextResponse("Failed to delete image", { status: 500 });
  }

  console.log("Image deleted successfully");

  if (isAgency) {
    await prisma.agency.update({
      data: {
        agencyLogo: "",
      },
      where: {
        id: entityId,
      },
    });
  } else {
    await prisma.user.update({
      data: {
        image: null,
      },
      where: {
        id: user.id,
      },
    });
  }

  return NextResponse.json({ message: "User profile picture deleted!" });
}

export async function POST(req: NextRequest) {
  unstable_noStore();

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const isAgency = req.nextUrl.searchParams.get("agency");
  let entityId: string | null = null;

  if (isAgency) {
    const agencyMember = await AgencyManager.findUserAgency(user.email);
    if (!agencyMember) {
      return new NextResponse("No agency found", { status: 404 });
    }

    entityId = agencyMember.agencyId;
  } else {
    const foundUser = await prisma.user.findFirst({
      select: {
        id: true,
      },
      where: {
        id: user.id,
      },
    });

    if (!foundUser) {
      return new NextResponse("No user found", { status: 404 });
    }

    entityId = foundUser.id;
  }

  const formData = await req.formData();

  const file = formData.get("file") as unknown;
  if (!file) {
    return new NextResponse("No file found", { status: 400 });
  }

  const fileToStore =
    file instanceof File ? file : file instanceof FileList ? file[0] : null;

  if (!fileToStore) {
    return new NextResponse("Invalid file", { status: 400 });
  }

  const bytes = await fileToStore.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileBlob = new Blob([buffer], { type: fileToStore.type });

  const response = await backendClient.profilePictures.upload({
    content: {
      blob: fileBlob,
      extension: fileToStore.type,
    },
    options: {
      manualFileName: undefined,
      replaceTargetUrl: `${isAgency ? "agency" : "user"}-${entityId}`,
      temporary: false,
    },
    ctx: {
      userId: entityId,
      userRole: "visitor",
    },
  });

  if (isAgency) {
    await prisma.agency.update({
      data: {
        agencyLogo: response.url,
      },
      where: {
        id: entityId,
      },
    });
  } else {
    await prisma.user.update({
      data: {
        image: response.url,
      },
      where: {
        id: user.id,
      },
    });
  }

  return NextResponse.json({ message: "User profile picture updated!" });
}
