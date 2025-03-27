"use client";

import type React from "react";

import { useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

interface ProfileData {
  name: string;
  profileImage: string;
  bannerImage: string;
  isAgency: boolean;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: ProfileData;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  profileData,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: profileData.name,
    title: profileData.isAgency
      ? "Digital Marketing & Design"
      : "Senior UX Designer",
    tagline: profileData.isAgency
      ? "Helping brands transform their digital presence with cutting-edge design and marketing strategies."
      : "Passionate about creating intuitive user experiences that solve real problems.",
    description: profileData.isAgency
      ? "Stellar Digital is a full-service digital agency specializing in web design, development, and digital marketing. Founded in 2015, we've helped over 200 clients achieve their digital goals."
      : "I'm a UX designer with 7+ years of experience working with startups and enterprise companies. My approach combines user research, design thinking, and a dash of creativity.",
    profileImage: profileData.profileImage,
    bannerImage: profileData.bannerImage,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save the data to your backend here
    console.log("Saving profile data:", formData);
    onClose();
  };

  const initials = formData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            {/* Banner Image */}
            <div className="space-y-2">
              <Label htmlFor="bannerImage">Banner Image</Label>
              <div className="relative h-32 w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                {formData.bannerImage && (
                  <Image
                    src={formData.bannerImage || "/placeholder.svg"}
                    alt="Banner preview"
                    className="h-full w-full object-cover"
                    width={1200}
                    height={300}
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Label
                    htmlFor="bannerUpload"
                    className="flex cursor-pointer items-center gap-2 rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Camera className="h-4 w-4" />
                    Change Banner
                    <Input
                      id="bannerUpload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        // In a real app, you would handle file upload here
                        console.log(
                          "Banner file selected:",
                          e.target.files?.[0]
                        );
                      }}
                    />
                  </Label>
                </div>
              </div>
              <Input
                id="bannerImage"
                name="bannerImage"
                placeholder="Or enter image URL"
                value={formData.bannerImage}
                onChange={handleChange}
                className="dark:bg-gray-800 dark:text-gray-100"
              />
            </div>

            {/* Profile Image */}
            <div className="space-y-2">
              <Label htmlFor="profileImage">Profile Picture</Label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-2 border-white dark:border-gray-800 shadow-sm">
                    <AvatarImage
                      src={formData.profileImage}
                      alt={formData.name}
                    />
                    <AvatarFallback className="bg-primary dark:bg-primary-light text-white dark:text-gray-900">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <Label
                    htmlFor="profileUpload"
                    className="absolute -bottom-1 -right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-primary dark:bg-primary-light text-white dark:text-gray-900 shadow-sm hover:bg-primary/90 dark:hover:bg-primary-light/90"
                  >
                    <Camera className="h-3 w-3" />
                    <Input
                      id="profileUpload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        // In a real app, you would handle file upload here
                        console.log(
                          "Profile file selected:",
                          e.target.files?.[0]
                        );
                      }}
                    />
                  </Label>
                </div>
                <Input
                  id="profileImage"
                  name="profileImage"
                  placeholder="Or enter image URL"
                  value={formData.profileImage}
                  onChange={handleChange}
                  className="dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title / Role</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Tagline */}
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="dark:bg-gray-800 dark:text-gray-100"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                A brief one-liner that describes you or your agency
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                About {profileData.isAgency ? "Agency" : "Me"}
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="resize-y dark:bg-gray-800 dark:text-gray-100"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Markdown formatting is supported
              </p>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 dark:bg-primary-light dark:text-gray-900 dark:hover:bg-primary-light/90"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
