"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import EditProfileModal from "./edit-profile-modal";

interface ProfileHeaderProps {
  profileImage: string;
  bannerImage: string;
  name: string;
  isAgency: boolean;
}

export default function ProfileHeader({
  profileImage,
  bannerImage,
  name,
  isAgency,
}: ProfileHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            src={bannerImage || "/placeholder.svg"}
            alt="Profile banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
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
            <Button
              className="absolute bottom-1 right-1 rounded-full bg-primary dark:bg-primary-light p-2 text-white dark:text-gray-900 shadow-md hover:bg-primary/90 dark:hover:bg-primary-light/90 transition-colors"
              onClick={() => setIsModalOpen(true)}
              aria-label="Change profile picture"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="absolute bottom-4 right-4">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary/90 dark:bg-primary-light dark:text-gray-900 dark:hover:bg-primary-light/90"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profileData={{
          name,
          profileImage,
          bannerImage,
          isAgency,
        }}
      />
    </>
  );
}
