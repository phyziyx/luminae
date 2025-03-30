import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/db";
import { commentLikeSchema } from "@/lib/forms";
import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  if (!request.bodyUsed)
    return NextResponse.json({ error: "No body" }, { status: 400 });

  const validatedFields = commentLikeSchema.safeParse(request.body);
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

  const { type, commentId } = validatedFields.data;

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
