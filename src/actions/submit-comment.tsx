"use server";

import { getSession } from "@/lib/auth/auth";
import prisma from "@/lib/db";
import { commentFormSchema, CommentFormSchema } from "@/lib/forms";
import PostManager from "@/lib/managers/postManager";

export default async function onSubmitComment(values: CommentFormSchema) {
  const session = await getSession();
  const user = session?.user;

  let error = "An error occurred while creating comment...";

  if (!user) {
    error = "A user who is not authenticated tried to submit a comment...";
    return { error };
  }

  const validatedFields = commentFormSchema.safeParse(values);
  if (!validatedFields.success) {
    error = "Invalid fields provided.";
    return { error };
  }

  try {
    // This is an optimisation to only select one field,
    // as opposed to more (or all) if we only want to
    // verify whether the post exists or not
    //
    // - phyziyx
    const post = await PostManager.doesPostExist(values.postId);

    if (!post) {
      error = "Post not found";
      return { error };
    }

    if (values.parentId) {
      // Looks like we've an optional parentId provided
      // So we need to verify whether the parent comment
      // exists or not
      //
      // - phyziyx
      const parentComment = await PostManager.doesCommentExist(values.parentId);

      if (!parentComment) {
        error = "Parent comment not found";
        return { error };
      }
    }

    let agencyId: string | undefined = undefined;
    if (values.asAgency) {
      // If the comment is being posted as an agency.
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

    // We can now create the comment!
    const comment = await PostManager.createComment(
      {
        content: values.content,
        postId: values.postId,
        parentId: values.parentId || null,
      },
      {
        ...(agencyId ? { agencyId } : { userId: user.id }),
      }
    );

    error = "";
    return {
      error,
      comment,
    };
  } catch (err) {
    console.log(err);

    error = "An error occurred while creating comment...";
  }

  return {
    error,
  };
}
