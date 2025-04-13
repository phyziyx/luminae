// app/actions/fetchCategoriesAction.ts
"use server";

import CategoryManager from "@/lib/managers/categoryManager";

/**
 * Server action that fetches all categories from DB.
 */
export async function fetchCategoriesAction() {
  const categories = await CategoryManager.getAllCategories();
  return categories;
}
