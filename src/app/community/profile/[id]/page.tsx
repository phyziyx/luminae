import ProfileHeader from "../components/profile-header";
import ProfileInfo from "../components/profile-info";
import StatsOverview from "../components/stats-overview";
import BadgesSection from "../components/badges-section";
// import RecentActivity from "../components/recent-activity";
import prisma from "@/lib/db";

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
    // recentActivity: {
    //   id: number;
    //   type: "post" | "comment";
    //   title?: string;
    //   preview?: string;
    //   postTitle?: string;
    //   comment?: string;
    //   date: string;
    //   engagement: {
    //     comments?: number;
    //     likes?: number;
    //   };
    // }[];
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
    // recentActivity: [],
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

    data.bannerImage =
      // foundAgency?.profile?.profile?.bannerImage ||
      "/placeholder.svg?height=300&width=1200";
    data.description = foundAgency?.profile?.profile?.content || "";
    data.id = idWithoutPrefix;
    data.name = foundAgency?.name || "";
    data.profileImage =
      foundAgency?.agencyLogo || "/placeholder.svg?height=150&width=150";
    data.stats = {
      comments: foundAgency?._count.comments ?? 0,
      likes:
        (foundAgency?._count?.likes ?? 0) +
        (foundAgency?._count?.commentLikes ?? 0),
      posts: foundAgency?._count.posts ?? 0,
    };
    data.tagline = foundAgency?.profile?.profile?.tagline || "";
    data.exists = true;

    // There is no such thing as a title...
    // data.title = foundUser?.profile?.profile?.website || "";
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

    data.bannerImage =
      // foundUser?.profile?.profile?.bannerImage ||
      "/placeholder.svg?height=300&width=1200";
    data.description = foundUser?.profile?.profile?.content || "";
    data.id = idWithoutPrefix;
    data.name = foundUser?.name || "";
    data.profileImage =
      foundUser?.image || "/placeholder.svg?height=150&width=150";
    data.stats = {
      comments: foundUser?._count.comments ?? 0,
      likes:
        (foundUser?._count?.likes ?? 0) +
        (foundUser?._count?.commentLikes ?? 0),
      posts: foundUser?._count.posts ?? 0,
    };
    data.tagline = foundUser?.profile?.profile?.tagline || "";
    data.exists = true;

    // There is no such thing as a title...
    // data.title = foundUser?.profile?.profile?.website || "";
  }

  return data;

  // return {
  //   id,
  //   name: isAgency ? "Stellar Digital Agency" : "Alex Johnson",
  //   title: isAgency ? "Digital Marketing & Design" : "Senior UX Designer",
  //   profileImage: "/placeholder.svg?height=150&width=150",
  //   bannerImage: "/placeholder.svg?height=300&width=1200",
  //   tagline: isAgency
  //     ? "Helping brands transform their digital presence with cutting-edge design and marketing strategies."
  //     : "Passionate about creating intuitive user experiences that solve real problems.",
  //   description: `
  // ## About ${isAgency ? "Us" : "Me"}
  // ${
  //   isAgency
  //     ? "Stellar Digital is a full-service digital agency specializing in web design, development, and digital marketing. Founded in 2015, we've helped over 200 clients achieve their digital goals."
  //     : "I'm a UX designer with 7+ years of experience working with startups and enterprise companies. My approach combines user research, design thinking, and a dash of creativity."
  // }
  // ### ${isAgency ? "Our Expertise" : "My Skills"}
  // ${
  //   isAgency
  //     ? "- Brand Strategy\n- Web Design & Development\n- Digital Marketing\n- Content Creation\n- SEO Optimization"
  //     : "- User Research\n- Wireframing & Prototyping\n- Interaction Design\n- Usability Testing\n- Design Systems"
  // }
  //     `,
  //   stats: {
  //     posts: isAgency ? 342 : 87,
  //     likes: isAgency ? 5678 : 1243,
  //     comments: isAgency ? 1204 : 356,
  //   },
  //   badges: [
  //     {
  //       id: 1,
  //       name: isAgency ? "Top Agency" : "Top Contributor",
  //       icon: "Award",
  //       color: "blue",
  //     },
  //     {
  //       id: 2,
  //       name: isAgency ? "Content Expert" : "Helpful Member",
  //       icon: "ThumbsUp",
  //       color: "green",
  //     },
  //     {
  //       id: 3,
  //       name: isAgency ? "Community Partner" : "Rising Star",
  //       icon: "Star",
  //       color: "amber",
  //     },
  //     {
  //       id: 4,
  //       name: isAgency ? "Verified Business" : "Problem Solver",
  //       icon: "CheckCircle",
  //       color: "indigo",
  //     },
  //   ],
  //   recentActivity: [
  //     {
  //       id: 1,
  //       type: "post" as const, // 👈 Fix type explicitly
  //       title: isAgency
  //         ? "5 Digital Marketing Trends to Watch in 2025"
  //         : "The Importance of Accessibility in Modern Web Design",
  //       preview: isAgency
  //         ? "Digital marketing continues to evolve at a rapid pace. Here are the top trends that will shape the industry in the coming year..."
  //         : "Web accessibility is not just a nice-to-have feature anymore. It's essential for creating inclusive digital experiences...",
  //       date: "2 days ago",
  //       engagement: { comments: 24, likes: 87 },
  //     },
  //     {
  //       id: 2,
  //       type: "comment" as const, // 👈 Fix type explicitly
  //       postTitle: "Building Scalable Design Systems",
  //       comment:
  //         "Great insights! I've found that establishing clear component naming conventions early on saves a lot of headaches later.",
  //       date: "3 days ago",
  //       engagement: { likes: 12 },
  //     },
  //     {
  //       id: 3,
  //       type: "post" as const, // 👈 Fix type explicitly
  //       title: isAgency
  //         ? "Case Study: How We Increased Conversion Rates by 200%"
  //         : "User Testing Methods That Actually Work",
  //       preview: isAgency
  //         ? "In this case study, we break down the strategy we used to help an e-commerce client dramatically improve their conversion rates..."
  //         : "After years of conducting user tests, I've developed a framework that consistently produces actionable insights...",
  //       date: "1 week ago",
  //       engagement: { comments: 18, likes: 64 },
  //     },
  //   ],
  //   isAgency,
  //   verified: isAgency, // Add this line to indicate agency verification status
  // };
};

function CommunityProfile({ profileData }: { profileData: any }) {
  return (
    <>
      <ProfileHeader
        profileImage={profileData.profileImage}
        bannerImage={profileData.bannerImage}
        name={profileData.name}
        isAgency={profileData.isAgency}
      />

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <ProfileInfo
            name={profileData.name}
            title={profileData.title}
            tagline={profileData.tagline}
            description={profileData.description}
            isAgency={profileData.isAgency}
            verified={profileData.verified}
          />

          {/* <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
              Recent Activity
              <div className="mt-1 h-1 w-24 bg-[#5B9AFF] dark:bg-[#7BABFF]"></div>
            </h2>
            <RecentActivity activities={profileData.recentActivity} />
          </div> */}
        </div>

        <div className="space-y-8">
          <StatsOverview stats={profileData.stats} />
          <BadgesSection badges={profileData.badges} />
        </div>
      </div>
    </>
  );
}

export default async function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const profileData = await getProfileData(params.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <main className="container mx-auto px-4 pb-12">
        {profileData.exists ? (
          <CommunityProfile profileData={profileData} />
        ) : (
          <div className="text-center py-20">
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
