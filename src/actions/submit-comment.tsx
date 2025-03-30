"use server";

import { auth } from "@/lib/auth/auth";
import { commentFormSchema, CommentFormSchema } from "@/lib/forms";
import PostManager from "@/lib/managers/postManager";
import { headers } from "next/headers";

export default async function onSubmitComment(values: CommentFormSchema) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

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
    // as oppossed to more (or all) if we only want to
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

    // We can now create the comment!
    const comment = await PostManager.createComment({
      content: values.content,
      authorId: user.id,
      postId: values.postId,
      parentId: values.parentId || null,
    });

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
