import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/db";
import { postLikeSchema } from "@/lib/forms";
import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  if (!request.bodyUsed)
    return NextResponse.json({ error: "No body" }, { status: 400 });

  const validatedFields = postLikeSchema.safeParse(request.body);
  if (!validatedFields.success) {
    return NextResponse.json(
      {
        error: "Invalid fields provided.",
      },
      {
        status: 400,
      }
    );
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user) {
    return NextResponse.json(
      {
        error: "User not authenticated.",
      },
      {
        status: 401,
      }
    );
  }

  const { type, postId } = validatedFields.data;

  // Let us first check, if the user has already (dis)liked the comment
  const existingLike = await prisma.likes.findUnique({
    where: {
      userId_postId: {
        userId: user.id,
        postId,
      },
    },
  });

  // If the user has already liked the post,
  // we will check if the type is the same
  if (existingLike && existingLike.type === type) {
    // If the type is the same, we will remove the like
    await prisma.likes.delete({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
    });

    return NextResponse.json(
      {
        message: "Post like removed successfully.",
      },
      {
        status: 200,
      }
    );
  }

  await prisma.likes.upsert({
    create: {
      type,
      postId,
      userId: user.id,
    },
    update: {
      type,
    },
    where: {
      userId_postId: {
        userId: user.id,
        postId,
      },
    },
  });

  return NextResponse.json(
    {
      message: "Post like updated successfully.",
    },
    {
      status: 200,
    }
  );
}
