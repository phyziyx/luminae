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
    await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {},
      create: {
        email: user.email,
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    });
  }

  /**
   * Deletes the user in the database
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

  /**
   * Deletes the user from the database, ignoring if it exists or not
   * @param userIds user ids
   * @returns number of users deleted
   */
  public static async deleteUsers(userIds: string[]) {
    return (
      await prisma.user.deleteMany({
        where: {
          id: {
            in: userIds,
          },
        },
      })
    ).count;
  }

  /**
   * Find if the user exists in the database
   * @param email user email
   * @returns user
   */
  public static async findUser(email: string) {
    return await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
  }
}

export default UserManager;
