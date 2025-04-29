import { User } from "@prisma/client";
import prisma from "../db";
import NotificationManager from "./notificationManager";
import { auth } from "../auth/auth";

type CreateUser = Pick<User, "email" | "name" | "image"> & {
  password: string;
};

class UserManager {
  public static async fetchUsers() {
    const users = await prisma.user.findMany({
      include: {
        agencyMember: true,
      },
    });
    return users;
  }

  /**
   * Creates the user in the database
   * @param user user object
   * @returns user
   */
  public static async createUser(user: CreateUser) {
    const { user: createdUser } = await auth.api.createUser({
      body: {
        name: user.name,
        email: user.email,
        password: user.password,
        role: "user",
      },
    });

    await NotificationManager.create(createdUser.id, "WELCOME");

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
  public static async toggleUserBan(userId: string) {
    const user = await auth.api.banUser({
      body: {
        userId: userId,
      },
    });

    return !!user;
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
    data: Pick<User, "name" | "email" | "image">
  ) {
    return await prisma.user.update({
      where: { id },
      data: data,
    });
  }

  /**
   * Check if the user is a platform admin
   * @returns boolean
   */
  public static async isAdmin(userId: string) {
    const user = await prisma.user.findUnique({
      select: {
        role: true,
      },
      where: {
        id: userId,
      },
    });

    return user?.role === "admin" || false;
  }

  public static getAllUsersCount() {
    return prisma.user.count();
  }
}

export default UserManager;
