// app/actions/toggleBookmark.ts
"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import PostManager from "@/lib/managers/postManager";
import { bookmarkPostFormSchema, BookmarkPostFormSchema } from "@/lib/forms";

export async function onToggleBookmark(formData: BookmarkPostFormSchema) {
  // Validate session
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  if (!user) {
    throw new Error("You must be logged in to bookmark posts.");
  }

  // Validate input
  const result = bookmarkPostFormSchema.safeParse(formData);
  if (!result.success) {
    throw new Error(`Invalid request: ${result.error.message}`);
  }

  // Toggle the bookmark
  const { postId } = result.data;
  await PostManager.toggleBookmark(user.id, postId);

  return { success: true };
}
