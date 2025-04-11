import { headers } from "next/headers";
import prisma from "../db";
import { auth } from "../auth/auth";
import { CommunityProfileSchema } from "../forms";

class ProfileManager {
  public static async updateProfile(
    values: CommunityProfileSchema,
    isUpdatingAgency: boolean
  ) {
    const userSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!userSession || !userSession.user) {
      return;
    }

    const agency = await prisma.agency.findFirst({
      select: {
        id: true,
      },
      where: {
        agencyMembers: {
          some: {
            user: {
              id: userSession?.user.id,
            },
          },
        },
      },
    });

    const agencyId = isUpdatingAgency ? agency?.id : undefined;

    const existingProfile = await prisma.profile.findFirst({
      select: {
        id: true,
      },
      where: {
        OR: [
          {
            agencyProfile: {
              ...(agencyId
                ? {
                    agencyId: agencyId,
                  }
                : undefined),
            },
          },
          {
            userProfile: {
              ...(!isUpdatingAgency
                ? {
                    userId: userSession?.user.id,
                  }
                : undefined),
            },
          },
        ],
      },
    });

    if (!existingProfile) {
      await prisma.profile.create({
        data: {
          tagline: values.tagline,
          content: values.content,
          title: values.title,
          agencyProfile: {
            ...(agencyId
              ? {
                  connectOrCreate: {
                    create: {
                      agencyId: agencyId,
                    },
                    where: {
                      agencyId: agencyId,
                    },
                  },
                }
              : undefined),
          },
          userProfile: {
            ...(!isUpdatingAgency
              ? {
                  connectOrCreate: {
                    create: {
                      userId: userSession.user.id,
                    },
                    where: {
                      userId: userSession.user.id,
                    },
                  },
                }
              : undefined),
          },
        },
      });
    } else {
      // If the profile exists, we will update it
      await prisma.profile.update({
        data: {
          tagline: values.tagline,
          content: values.content,
          title: values.title,
          agencyProfile: {
            ...(agencyId
              ? {
                  connectOrCreate: {
                    create: {
                      agencyId: agencyId,
                    },
                    where: {
                      agencyId: agencyId,
                    },
                  },
                }
              : undefined),
          },
          userProfile: {
            ...(!isUpdatingAgency
              ? {
                  connectOrCreate: {
                    create: {
                      userId: userSession.user.id,
                    },
                    where: {
                      userId: userSession.user.id,
                    },
                  },
                }
              : undefined),
          },
        },
        where: {
          id: existingProfile.id,
        },
      });
    }
  }
}

export default ProfileManager;
