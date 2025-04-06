"use client";

import { z } from "zod";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import { LoadingSpinner } from "@/components/site/loading-spinner";

interface ProfileData {
  name: string;
  profileImage: string;
  bannerImage: string;
  isAgency: boolean;
  title?: string;
  tagline?: string;
  description?: string;
}

const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().optional(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  profileImage: z.string().url("Invalid URL").optional(),
  bannerImage: z.string().url("Invalid URL").optional(),
});

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
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      ...profileData,
    },
    mode: "onChange",
  });

  const isLoading = form.formState.isSubmitting;
  const t = useTranslations();

  const initials = useMemo(
    () =>
      profileData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase(),
    [profileData.name]
  );

  const onSubmit = useCallback(
    async (data: z.infer<typeof profileFormSchema>) => {
      console.log("Form submitted:", data);
      onClose();
    },
    [onClose]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Update your profile information. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              {/* Banner Image */}
              <div className="space-y-2">
                <Label htmlFor="bannerImage">Banner Image</Label>
                <div className="relative h-32 w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                  {profileData.bannerImage && (
                    <Image
                      src={profileData.bannerImage || "/placeholder.svg"}
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
                        name="bannerUpload"
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
                  name="bannerImage"
                  placeholder="Or enter image URL"
                  value={form.getValues("bannerImage")}
                  // onChange={handleChange}
                  className="dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Profile Image */}
            <div className="space-y-2">
              <Label htmlFor="profileImage">Profile Picture</Label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-2 border-white dark:border-gray-800 shadow-sm">
                    <AvatarImage
                      src={form.getValues("profileImage")}
                      alt={form.getValues("name")}
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
                      name="profileUpload"
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
                <FormField
                  control={form.control}
                  name="profileImage"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          {...field}
                          className="dark:bg-gray-800 dark:text-gray-100 w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Basic Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-white dark:bg-gray-800 dark:text-gray-100"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>title</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-white dark:bg-gray-800 dark:text-gray-100"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Tagline */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="tagline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>tagline</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-white dark:bg-gray-800 dark:text-gray-100"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500 dark:text-gray-400">
                        A short description that appears below your name
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        About {profileData.isAgency ? "Agency" : "Me"}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={5}
                          className="bg-white resize-y dark:bg-gray-800 dark:text-gray-100"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500 dark:text-gray-400">
                        Markdown formatting is supported
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                disabled={isLoading}
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
              >
                {isLoading ? <LoadingSpinner /> : "Cancel"}
              </Button>
              <Button
                disabled={isLoading}
                type="submit"
                className="bg-primary hover:bg-primary/90 dark:bg-primary-light dark:text-gray-900 dark:hover:bg-primary-light/90"
              >
                {isLoading ? <LoadingSpinner /> : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
