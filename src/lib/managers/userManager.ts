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

    const invitation = await prisma.invitation.findFirst({
      where: {
        email: user.email,
      },
    });

    if (invitation) {
      await prisma.invitation.delete({
        where: {
          id: invitation.id,
        },
      });

      await prisma.agencyMember.create({
        data: {
          agencyId: invitation.agencyId,
          email: invitation.email,
          role: invitation.role,
        },
      });
    }
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

  /**
   * Update a user's details in the database
   * @param userId user id
   * @param userUpdates updated user data
   * @returns updated user
   */
  public static async updateUser(
    id: string,
    userUpdates: { name: string; email: string; avatarUrl: string }
  ) {
    return await prisma.user.update({
      where: { id },
      data: userUpdates,
    });
  }

  /**
   * Find if user is admin
   * @returns boolean
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static async isUserAdmin(userId: string) {
    // const user = await prisma.user.findUnique({
    //   where: {
    //     id: userId,
    //   },
    // });

    // TODO: UPDATE SCHEMA, ADD IS ADMIN
    return true;
  }
}

export default UserManager;
