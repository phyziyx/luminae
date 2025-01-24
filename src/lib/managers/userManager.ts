import { User } from "@prisma/client";
import prisma from "../db";
import { clerkClient } from "@clerk/nextjs/server";
import NotificationManager from "./notificationManager";

type CreateUser = Pick<
  User,
  "id" | "email" | "firstName" | "lastName" | "avatarUrl"
>;

class UserManager {
  public static async fetchUsers() {
    const users = await prisma.user.findMany({
      include: {
        AgencyMembers: true,
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
    const createdUser = await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {},
      create: {
        email: user.email,
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
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
    const clerk = await clerkClient();
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        isLocked: true,
      },
    });
    if (!user) {
      return false;
    }
    const ban = user.isLocked
      ? await clerk.users.unbanUser(userId)
      : await clerk.users.banUser(userId);
    console.log(ban);
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isLocked: ban.banned,
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
    data: Pick<User, "firstName" | "lastName" | "email" | "avatarUrl">
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
        isAdmin: true,
      },
      where: {
        id: userId,
      },
    });

    return user?.isAdmin || false;
  }
}

export default UserManager;
