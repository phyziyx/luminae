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

    const profile = await prisma.profile.findFirst({
      select: {
        banner: true,
        id: true,
      },
      where: {
        agencyProfile: {
          agencyId: agencyMember.agencyId,
        },
      },
    });

    if (!profile || !profile.banner) {
      return new NextResponse("No image found", { status: 404 });
    }

    entityId = agencyMember.agencyId ?? null;
    fileToDelete = profile?.banner ?? null;
  } else {
    const profile = await prisma.profile.findFirst({
      select: {
        banner: true,
        id: true,
      },
      where: {
        userProfile: {
          user: {
            id: user.id,
          },
        },
      },
    });

    entityId = profile?.id ?? null;
    fileToDelete = profile?.banner ?? null;
  }

  if (!entityId || !fileToDelete) {
    return new NextResponse("No image found", { status: 404 });
  }

  const response = await backendClient.profilePictures.deleteFile({
    url: fileToDelete,
  });

  if (!response.success) {
    return new NextResponse("Failed to delete image", { status: 500 });
  }

  if (isAgency) {
    await prisma.profile.update({
      data: {
        banner: null,
      },
      where: {
        id: entityId,
      },
    });
  } else {
    await prisma.profile.update({
      data: {
        banner: null,
      },
      where: {
        id: entityId,
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

    const profile = await prisma.profile.findFirst({
      select: {
        banner: true,
        id: true,
      },
      where: {
        agencyProfile: {
          agencyId: agencyMember.agencyId,
        },
      },
    });

    if (!profile) {
      return new NextResponse("No image found", { status: 404 });
    }

    entityId = profile.id;
  } else {
    const profile = await prisma.profile.findFirst({
      select: {
        banner: true,
        id: true,
      },
      where: {
        userProfile: {
          user: {
            id: user.id,
          },
        },
      },
    });

    if (!profile) {
      return new NextResponse("No image found", { status: 404 });
    }

    entityId = profile.id;
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
      replaceTargetUrl: `${isAgency ? "agency" : "user"}-${entityId}-banner`,
      temporary: false,
    },
    ctx: {
      userId: entityId,
      userRole: "visitor",
    },
  });

  if (isAgency) {
    await prisma.agencyProfile.update({
      data: {
        profile: {
          update: {
            banner: response.url,
          },
        },
      },
      where: {
        profileId: entityId,
      },
    });
  } else {
    await prisma.userProfile.update({
      data: {
        profile: {
          update: {
            banner: response.url,
          },
        },
      },
      where: {
        userId: user.id,
      },
    });
  }

  return NextResponse.json({ message: "User profile picture updated!" });
}
