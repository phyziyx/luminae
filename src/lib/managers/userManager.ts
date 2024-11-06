import { User } from "@prisma/client";
import prisma from "../db";

type CreateUser = Pick<User, "id" | "email" | "name" | "avatarUrl">;

class UserManager {
  /**
   * Creates the user in the database
   * @param user user object
   * @returns user
   */

  public static async createUser(user: CreateUser) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    });
  }

  /**
   * Updates the user in the database
   * @param id user id
   * @returns user
   */
  public static async deleteUser(userId: string) {
    return await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
}

export default UserManager;
