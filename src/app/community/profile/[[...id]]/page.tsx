import ProfileHeader from "./_components/profile-header";
import ProfileInfo from "./_components/profile-info";
import StatsOverview from "./_components/stats-overview";
import BadgesSection from "./_components/badges-section";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth/auth";
import { CommunityProfileWithStats } from "@/lib/types";
import EditProfile from "./_components/edit-profile";
import AgencyManager from "@/lib/managers/agencyManager";
import BadgeManager from "@/lib/managers/badgeManager";
import { Button } from "@/components/ui/button";
import { BadgeCheckIcon } from "lucide-react";
import { redirect } from "next/navigation";

const getProfileData = async (id: string) => {
  const isAgency = id.startsWith("a-");
  const idWithoutPrefix = id.replace("a-", "");

  const data = {
    exists: false,
    id: idWithoutPrefix,
    name: "",
    title: "",
    profileImage: "",
    bannerImage: "",
    tagline: "",
    content: "",
    stats: { posts: 0, likes: 0, comments: 0 },
    isAgency,
    badges: [],
    verified: false,
  };

  if (isAgency) {
    const [foundAgency, verification] = await Promise.all([
      prisma.agency.findUnique({
        select: {
          agencyLogo: true,
          name: true,
          profile: {
            include: {
              profile: true,
            },
          },
          _count: {
            select: {
              posts: true,
              comments: true,
            },
          },
        },
        where: {
          id: idWithoutPrefix,
        },
      }),
      prisma.agencyVerification.findFirst({
        select: {
          status: true,
        },
        where: {
          agencyId: idWithoutPrefix,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    if (!foundAgency) return data;

    return {
      ...data,
      exists: true,
      id: idWithoutPrefix,
      name: foundAgency.name || "",
      title: foundAgency.profile?.profile?.title || "",
      tagline: foundAgency.profile?.profile?.tagline || "",
      content: foundAgency.profile?.profile?.content || "",
      profileImage: foundAgency.agencyLogo || "",
      bannerImage: foundAgency.profile?.profile?.banner || "",
      stats: {
        comments: foundAgency._count.comments ?? 0,
        likes: 0,
        posts: foundAgency._count.posts ?? 0,
      },
      badges: foundAgency.profile?.profileId
        ? await BadgeManager.getRecentBadges(foundAgency.profile?.profileId, 6)
        : [],
      verified: !!(verification && verification.status === "APPROVED"),
    };
  } else {
    const foundUser = await prisma.user.findUnique({
      select: {
        image: true,
        name: true,
        profile: {
          include: {
            profile: true,
          },
        },
        _count: {
          select: {
            posts: true,
            likes: true,
            commentLikes: true,
            comments: true,
          },
        },
      },
      where: {
        id: idWithoutPrefix,
      },
    });

    if (!foundUser) return data;

    return {
      ...data,
      exists: true,
      id: idWithoutPrefix,
      name: foundUser.name || "",
      title: foundUser.profile?.profile?.title || "",
      tagline: foundUser.profile?.profile?.tagline || "",
      content: foundUser.profile?.profile?.content || "",
      profileImage: foundUser.image || "",
      bannerImage: foundUser.profile?.profile?.banner || "",
      stats: {
        comments: foundUser._count.comments ?? 0,
        likes:
          (foundUser._count.likes ?? 0) + (foundUser._count.commentLikes ?? 0),
        posts: foundUser._count.posts ?? 0,
      },
      badges: foundUser.profile?.profileId
        ? await BadgeManager.getRecentBadges(foundUser.profile?.profileId, 6)
        : [],
      verified: false,
    };
  }
};

function VerifyNow() {
  return (
    <div className="mb-2 bg-green-800 dark:bg-green-900 w-full rounded-xl p-3 flex flex-row items-center justify-between align-items-center">
      <div>
        <p className="text-lg text-white font-bold">You aren't verified yet!</p>
        <p className="text-sm text-white">
          Get verified like this agency to unlock exclusive features.
        </p>
      </div>
      <Button className="bg-white text-green-800 dark:text-green-900 font-bold hover:bg-gray-100">
        <BadgeCheckIcon className="h-6 w-6 text-green-800 fill-green-400 dark:text-primary-light" />
        Get Verified
      </Button>
    </div>
  );
}

function CommunityProfile({
  profileData,
  isOwner,
}: {
  profileData: CommunityProfileWithStats;
  isOwner: boolean;
}) {
  const {
    profileImage,
    bannerImage,
    name,
    title,
    tagline,
    isAgency,
    content,
    stats,
    badges,
    verified,
  } = profileData;

  return (
    <>
      <ProfileHeader
        id={profileData.id}
        profileImage={profileImage}
        bannerImage={bannerImage}
        name={name}
        isAgency={isAgency}
        content={content ?? ""}
        tagline={tagline ?? ""}
        title={title ?? ""}
        myself={isOwner}
      >
        <EditProfile profileData={profileData} />
      </ProfileHeader>

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        {/* LEFT SECTION (Main Info) */}
        <div className="md:col-span-2">
          {!isOwner && isAgency && <VerifyNow />}
          <ProfileInfo
            name={name}
            title={title ?? undefined}
            tagline={tagline ?? undefined}
            description={content ?? undefined}
            isAgency={isAgency}
            verified={verified}
            myself={isOwner}
          />
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-8">
          <StatsOverview stats={stats} />
          <BadgesSection badges={badges} />
        </div>
      </div>
    </>
  );
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: undefined | string[] }>;
}) {
  const { id: optionalId } = await params;
  const session = await getSession();

  const currentUserId = session?.user?.id ?? null;

  let id: string | undefined = optionalId?.[0];
  if (currentUserId) {
    id ||= currentUserId;
  } else if (!id) {
    redirect("/community");
    return;
  }

  const profileData = await getProfileData(id);
  const isAgency = profileData.isAgency;

  let isOwner =
    !isAgency && !!currentUserId && currentUserId === profileData.id;

  if (isAgency && session) {
    const agencyMember = await AgencyManager.findUserAgency(session.user.email);
    if (agencyMember) {
      isOwner = agencyMember.agencyId === profileData.id;
    }
  }

  const fullProfileData = {
    ...profileData,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <main className="container mx-auto px-4 pb-12">
        {profileData.exists ? (
          <CommunityProfile profileData={fullProfileData} isOwner={isOwner} />
        ) : (
          <div className="py-20 text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Profile Not Found
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              The profile you are looking for does not exist.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
