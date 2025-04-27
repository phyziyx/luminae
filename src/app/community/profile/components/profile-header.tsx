import Image from "next/image";
import { CommunityProfile } from "@/lib/types";
import Avatar from "@/components/site/avatar";

interface ProfileHeaderProps extends CommunityProfile {
  name: string;
  isAgency: boolean;
  myself?: boolean;
  children: React.ReactNode;
}

export default function ProfileHeader({
  profileImage,
  bannerImage,
  name,
  myself,
  children,
}: ProfileHeaderProps) {
  return (
    <>
      <div className="relative mb-24 mt-6 rounded-xl shadow-md">
        {/* Banner Image */}
        <div className="relative h-48 w-full sm:h-64 md:h-80 z-0">
          <Image
            src={bannerImage || "/banner_placeholder.webp"}
            alt="Profile banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Profile Picture */}
        <div className="absolute -bottom-16 left-6 sm:left-8 z-10">
          <Avatar
            profileImage={profileImage ?? ""}
            name={name}
            className="h-32 w-32 border-4 border-white dark:border-gray-900 shadow-lg sm:h-36 sm:w-36"
          />
        </div>

        {/* Edit Profile Button */}
        {myself && <div className="absolute bottom-4 right-4">{children}</div>}
      </div>
    </>
  );
}
