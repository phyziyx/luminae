import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/db";
import { commentLikeSchema } from "@/lib/forms";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!request.bodyUsed)
    return NextResponse.json({ error: "No body" }, { status: 400 });

  const validatedFields = commentLikeSchema.safeParse(body);
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

  const session = await getSession();
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

  const { type, commentId } = validatedFields.data;

  // Let us first check, if the user has already (dis)liked the comment
  const existingLike = await prisma.commentLikes.findUnique({
    where: {
      userId_commentId: {
        userId: user.id,
        commentId,
      },
    },
  });

  // If the user has already liked the comment,
  // we will check if the type is the same
  if (existingLike && existingLike.type === type) {
    // If the type is the same, we will remove the like
    await prisma.commentLikes.delete({
      where: {
        userId_commentId: {
          userId: user.id,
          commentId,
        },
      },
    });

    return NextResponse.json(
      {
        message: "Comment like removed successfully.",
      },
      {
        status: 200,
      }
    );
  }

  await prisma.commentLikes.upsert({
    create: {
      type,
      commentId,
      userId: user.id,
    },
    update: {
      type,
    },
    where: {
      userId_commentId: {
        userId: user.id,
        commentId,
      },
    },
  });

  return NextResponse.json(
    {
      message: "Comment like updated successfully.",
    },
    {
      status: 200,
    }
  );
}
