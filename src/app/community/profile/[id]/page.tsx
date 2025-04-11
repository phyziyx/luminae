import ProfileHeader from "../components/profile-header";
import ProfileInfo from "../components/profile-info";
import StatsOverview from "../components/stats-overview";
import BadgesSection from "../components/badges-section";
import BookmarkedPostsList from "../components/bookmarked-posts";
import prisma from "@/lib/db";
import PostManager from "@/lib/managers/postManager";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

const getProfileData = async (id: string) => {
  const isAgency = id.startsWith("a-");
  const idWithoutPrefix = id.replace("a-", "");

  const data: {
    id: string;
    name: string;
    title: string;
    profileImage: string;
    bannerImage: string;
    tagline: string;
    description: string;
    stats: {
      posts: number;
      likes: number;
      comments: number;
    };
    exists: boolean;
    isAgency: boolean;
    badges: {
      id: number;
      name: string;
      icon: string;
      color: string;
    }[];
    bookmarkedPosts?: any[]; // We'll store fetched bookmarked posts here (if it's a user and we want to show them).
  } = {
    exists: false,
    id,
    name: "",
    title: "",
    profileImage: "",
    bannerImage: "",
    tagline: "",
    description: "",
    stats: { posts: 0, likes: 0, comments: 0 },
    isAgency,
    badges: [],
  };

  if (isAgency) {
    // ---------------------
    // AGENCY PROFILE FETCH
    // ---------------------
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

    data.bannerImage = "/placeholder.svg?height=300&width=1200";
    data.description = foundAgency.profile?.profile?.content || "";
    data.id = idWithoutPrefix;
    data.name = foundAgency.name || "";
    data.profileImage =
      foundAgency.agencyLogo || "/placeholder.svg?height=150&width=150";
    data.stats = {
      comments: foundAgency._count.comments ?? 0,
      likes: 0, // or fetch/aggregate if needed
      posts: foundAgency._count.posts ?? 0,
    };
    data.tagline = foundAgency.profile?.profile?.tagline || "";
    data.exists = true;
    data.title = foundAgency.profile?.profile?.title || "";
  } else {
    // ---------------------
    // USER PROFILE FETCH
    // ---------------------
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

    data.bannerImage = "/placeholder.svg?height=300&width=1200";
    data.description = foundUser.profile?.profile?.content || "";
    data.id = idWithoutPrefix;
    data.name = foundUser.name || "";
    data.profileImage =
      foundUser.image || "/placeholder.svg?height=150&width=150";
    data.stats = {
      comments: foundUser._count.comments ?? 0,
      likes: (foundUser._count.likes ?? 0) + (foundUser._count.commentLikes ?? 0),
      posts: foundUser._count.posts ?? 0,
    };
    data.tagline = foundUser.profile?.profile?.tagline || "";
    data.exists = true;
    data.title = foundUser.profile?.profile?.title || "";
  }

  return data;
};

// --------------
// PROFILE PAGE
// --------------
function CommunityProfile({
  profileData,
  isOwner,
}: {
  profileData: any;
  isOwner: boolean;
}) {
  const {
    profileImage,
    bannerImage,
    name,
    title,
    tagline,
    description,
    isAgency,
    verified,
    stats,
    badges,
    bookmarkedPosts = [],
  } = profileData;

  return (
    <>
      <ProfileHeader
        profileImage={profileImage}
        bannerImage={bannerImage}
        name={name}
        isAgency={isAgency}
      />

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        {/* LEFT SECTION (Main Info) */}
        <div className="md:col-span-2">
          <ProfileInfo
            name={name}
            title={title}
            tagline={tagline}
            description={description}
            isAgency={isAgency}
            verified={verified}
          />

          {/* Show "Saved Posts" ONLY if the user is viewing their own personal (non-agency) profile */}
          {isOwner && !isAgency && (
            <div className="mt-8">
              <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
                Saved Posts
                <div className="mt-1 h-1 w-24 bg-[#5B9AFF] dark:bg-[#7BABFF]"></div>
              </h2>

              {/* Render the user's bookmarked posts */}
              <BookmarkedPostsList posts={bookmarkedPosts} />
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR (Stats, Badges, etc.) */}
        <div className="space-y-8">
          <StatsOverview stats={stats} />
          <BadgesSection badges={badges} />
        </div>
      </div>
    </>
  );
}

export default async function ProfilePage({ params }: { params: { id: string } }) {
  // 1) Identify the currently logged-in user
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const currentUserId = session?.user?.id ?? null;

  // 2) Gather profile data
  const profileData = await getProfileData(params.id);

  // 3) If the profile belongs to a user (not an agency) and it matches the signed-in user, fetch bookmarked posts
  let bookmarkedPosts = [];
  const isAgency = profileData.isAgency;
  const profileUserId = profileData.id; // This is the "idWithoutPrefix" if it's a user

  const isOwner = !isAgency && !!currentUserId && currentUserId === profileUserId;
  // ^ Means "this is the same user who is logged in" (and not an agency)

  if (isOwner) {
    // Fetch bookmarked posts
    bookmarkedPosts = await PostManager.getBookmarkedPosts(profileUserId);
  }

  // 4) Inject bookmarkedPosts into profileData for the CommunityProfile
  const fullProfileData = {
    ...profileData,
    bookmarkedPosts,
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
