"use client";

import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import EditProfileModal from "./edit-profile-modal";
import { CommunityProfile } from "@/lib/types";

export default function EditProfile({
  profileData,
}: {
  profileData: CommunityProfile;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-primary hover:bg-primary/90 dark:bg-primary-light dark:text-gray-900 dark:hover:bg-primary-light/90"
      >
        <PencilIcon className="mr-2 h-4 w-4" />
        Edit Profile
      </Button>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profileData={{
          profileImage: profileData.profileImage,
          bannerImage: profileData.bannerImage,
          name: profileData.name,
          title: profileData?.title ?? "",
          tagline: profileData?.tagline ?? "",
          content: profileData?.content ?? "",
          isAgency: profileData.isAgency,
        }}
      />
    </>
  );
}
