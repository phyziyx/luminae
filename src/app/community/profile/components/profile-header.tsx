// import { useMemo } from "react";
import Image from "next/image";
// import { Camera, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
import { CommunityProfileSchema } from "@/lib/forms";

interface ProfileHeaderProps extends CommunityProfileSchema {
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
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

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
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-900 shadow-lg sm:h-36 sm:w-36">
              <AvatarImage src={profileImage} alt={name} />
              <AvatarFallback className="bg-primary dark:bg-primary-light text-white dark:text-gray-900 text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Edit Profile Button */}
        {myself && <div className="absolute bottom-4 right-4">{children}</div>}
      </div>
    </>
  );
}
