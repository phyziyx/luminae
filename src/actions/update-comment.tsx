"use server";

import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/db";
import { UpdateCommentSchema, updateCommentSchema } from "@/lib/forms";
import PostManager from "@/lib/managers/postManager";

export default async function onUpdateComment(values: UpdateCommentSchema) {
  const session = await getSession();
  const user = session?.user;

  let error = "An error occurred while updating comment...";

  if (!user) {
    error = "A user who is not authenticated tried to submit a comment...";
    return { error };
  }

  const validatedFields = updateCommentSchema.safeParse(values);
  if (!validatedFields.success) {
    error = "Invalid fields provided.";
    return { error };
  }

  try {
    const comment = await PostManager.doesCommentExist(values.commentId);

    if (!comment) {
      error = "Comment not found";
      return { error };
    }

    let agencyId: string | undefined = undefined;
    if (comment.agencyComments && comment.agencyComments.length > 0) {
      // If the comment was posted by an agency.
      agencyId = (
        await prisma.agencyMember.findFirst({
          select: {
            agencyId: true,
          },
          where: {
            user: {
              id: user.id,
            },
          },
        })
      )?.agencyId;
    }

    if (comment.userComments && comment.userComments[0].userId !== user.id) {
      error = "You cannot edit this comment. You did not post this comment.";
      return { error };
    } else if (
      agencyId &&
      comment.agencyComments &&
      comment.agencyComments[0].agencyId !== agencyId
    ) {
      error = "You cannot edit this comment. You are not part of the agency.";
      return { error };
    }

    const updatedComment = await PostManager.updateComment({
      content: values.content,
      id: values.commentId,
    });
    error = "";

    return {
      error,
      comment: updatedComment,
    };
  } catch (err) {
    console.log(err);

    error = "An error occurred while updating comment...";
  }

  return {
    error,
  };
}
