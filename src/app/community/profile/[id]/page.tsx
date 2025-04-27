import ProfileHeader from "../components/profile-header";
import ProfileInfo from "../components/profile-info";
// import StatsOverview from "../components/stats-overview";
// import BadgesSection from "../components/badges-section";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth/auth";
import { CommunityProfile as ICommunityProfile } from "@/lib/types";
import EditProfile from "../components/edit-profile";

const getProfileData = async (id: string) => {
  const isAgency = id.startsWith("a-");
  const idWithoutPrefix = id.replace("a-", "");

  const data = {
    exists: false,
    id,
    name: "",
    title: "",
    profileImage: "",
    bannerImage: "",
    tagline: "",
    content: "",
    stats: { posts: 0, likes: 0, comments: 0 },
    isAgency,
    badges: [],
  };

  if (isAgency) {
    const foundAgency = await prisma.agency.findUnique({
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
    });

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
      bannerImage: "/assets/banner_placeholder.webp",
      stats: {
        comments: foundAgency._count.comments ?? 0,
        likes: 0,
        posts: foundAgency._count.posts ?? 0,
      },
      badges: [],
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
      bannerImage: "/assets/banner_placeholder.webp",
      stats: {
        comments: foundUser._count.comments ?? 0,
        likes:
          (foundUser._count.likes ?? 0) + (foundUser._count.commentLikes ?? 0),
        posts: foundUser._count.posts ?? 0,
      },
      badges: [],
    };
  }
};

function CommunityProfile({
  profileData,
  isOwner,
}: {
  profileData: ICommunityProfile;
  isOwner: boolean;
}) {
  const { profileImage, bannerImage, name, title, tagline, isAgency, content } =
    profileData;

  return (
    <>
      <ProfileHeader
        profileImage={profileImage}
        bannerImage={bannerImage}
        name={name}
        isAgency={isAgency}
        content={content ?? undefined}
        tagline={tagline ?? undefined}
        title={title ?? undefined}
        myself={isOwner}
      >
        <EditProfile profileData={profileData} />
      </ProfileHeader>

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        {/* LEFT SECTION (Main Info) */}
        <div className="md:col-span-2">
          <ProfileInfo
            name={name}
            title={title ?? undefined}
            tagline={tagline ?? undefined}
            description={content ?? undefined}
            isAgency={isAgency}
            verified={false}
          />
        </div>

        {/* RIGHT SIDEBAR */}
        {/* <div className="space-y-8">
          <StatsOverview stats={stats} />
          <BadgesSection badges={badges} />
        </div> */}
      </div>
    </>
  );
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  const currentUserId = session?.user?.id ?? null;
  const profileData = await getProfileData(id);
  const isAgency = profileData.isAgency;
  const isOwner =
    !isAgency && !!currentUserId && currentUserId === profileData.id;

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
