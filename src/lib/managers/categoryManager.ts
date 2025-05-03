import prisma from "../db";


export default class CategoryManager {
  /**
   * Fetches all categories from the DB, returning minimal fields for navigation.
   */
  public static async getAllCategories() {
    return prisma.category.findMany({
      select: {
        id: true,
        name: true,
        title: true,
      },
      orderBy: {
        // Optional: how you want them sorted
        title: "asc",
      },
    });
  }
}
