import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/db";
import { backendClient } from "@/lib/edgestore/edgestore";
import { unstable_noStore } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

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

  const response = await backendClient.profilePictures.deleteFile({
    url: foundUser.image,
  });

  if (!response.success) {
    return new NextResponse("Failed to delete image", { status: 500 });
  }

  console.log("Image deleted successfully");

  await prisma.user.update({
    data: {
      image: null,
    },
    where: {
      id: user.id,
    },
  });

  return NextResponse.json({ message: "User profile picture deleted!" });
}

export async function POST(req: NextRequest) {
  unstable_noStore();

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
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

  console.log(fileToStore);

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
      replaceTargetUrl: `user-${user.id}`,
      temporary: false,
    },
    ctx: {
      userId: user.id,
      userRole: "visitor",
    },
  });

  console.log(response);

  await prisma.user.update({
    data: {
      image: response.url,
    },
    where: {
      id: user.id,
    },
  });

  return NextResponse.json({ message: "User profile picture updated!" });
}
