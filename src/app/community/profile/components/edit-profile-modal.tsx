"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
// import { useTranslations } from "next-intl";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { LoadingSpinner } from "@/components/site/loading-spinner";
import updateUserProfile from "@/app/community/search/components/actions/edit-profile";
import { toast } from "sonner";
import Avatar from "@/components/site/avatar";
import { communityProfileSchema, CommunityProfileSchema } from "@/lib/forms";
import Image from "next/image";
import { Label } from "@/components/ui/label";

interface EditProfile extends CommunityProfileSchema {
  isAgency: boolean;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: EditProfile;
}

function ProfileImage({
  register,
}: {
  register: UseFormRegister<CommunityProfileSchema>;
}) {
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const { ref: registerRef, ...rest } = register("profileImage");
  const [preview, setPreview] = useState<string | null>(null);

  const handleUploadedFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.item(0);
      if (!file) return;

      const urlImage = URL.createObjectURL(file);

      setPreview(urlImage);
    },
    [setPreview]
  );

  const onUpload = useCallback(() => {
    if (!hiddenInputRef.current) return;

    hiddenInputRef.current.click();
  }, [hiddenInputRef]);

  return (
    <FormField
      {...rest}
      name="profileImage"
      render={() => (
        <FormItem className="flex flex-col gap-4">
          <FormLabel>Profile Image</FormLabel>
          <Input
            type="file"
            {...rest}
            accept="image/*"
            className="hidden"
            onChange={handleUploadedFile}
            ref={(e) => {
              registerRef(e);
              hiddenInputRef.current = e;
            }}
          />
          <div className="relative">
            <Avatar name="" profileImage={preview ?? ""} />
            <Label
              className="absolute -bottom-1 -right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-primary dark:bg-primary-light text-white dark:text-gray-900 shadow-sm hover:bg-primary/90 dark:hover:bg-primary-light/90"
              onClick={onUpload}
            >
              <Camera className="h-3 w-3" />
            </Label>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function BannerImage({
  register,
}: {
  register: UseFormRegister<CommunityProfileSchema>;
}) {
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const { ref: registerRef, ...rest } = register("bannerImage");

  const [preview, setPreview] = useState<string | null>(null);

  const handleUploadedFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.item(0);
      if (!file) return;

      const urlImage = URL.createObjectURL(file);

      setPreview(urlImage);
    },
    [setPreview]
  );

  const onUpload = useCallback(() => {
    if (!hiddenInputRef.current) return;

    hiddenInputRef.current.click();
  }, [hiddenInputRef]);

  return (
    <FormField
      {...rest}
      name="bannerImage"
      render={() => (
        <FormItem>
          <FormLabel>Banner Image</FormLabel>
          <Input
            type="file"
            {...rest}
            accept="image/*"
            className="sr-only"
            onChange={handleUploadedFile}
            ref={(e) => {
              registerRef(e);
              hiddenInputRef.current = e;
            }}
          />
          <div className="relative h-32 w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
            <Image
              src={preview ?? "/assets/banner_placeholder.webp"}
              alt="Banner preview"
              className="h-full w-full object-cover"
              width={1200}
              height={300}
            />
            <FormControl>
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Button
                  onClick={onUpload}
                  className="flex cursor-pointer items-center gap-2 rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Camera className="h-4 w-4" />
                  Change Banner
                </Button>
              </div>
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default function EditProfileModal({
  isOpen,
  onClose,
  profileData,
}: EditProfileModalProps) {
  const form = useForm<CommunityProfileSchema>({
    resolver: zodResolver(communityProfileSchema),
    defaultValues: {
      ...profileData,
    },
    mode: "onChange",
  });

  const isLoading = form.formState.isSubmitting;
  // const t = useTranslations();

  const onSubmit = useCallback(
    async (data: CommunityProfileSchema) => {
      console.log("Submitting profile data:", data);

      const result = await updateUserProfile(
        {
          name: data.name ?? "",
          bannerImage: data.bannerImage ?? "",
          profileImage: data.profileImage ?? "",
          title: data.title ?? "",
          tagline: data.tagline ?? "",
          content: data.content ?? "",
        },
        profileData.isAgency
      );

      if (result?.error) {
        toast.error("Something went wrong. Please try again.");
      } else {
        toast.success("Profile updated successfully!");
        onClose();
      }
    },
    [onClose, profileData.isAgency]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Profile Image */}
            <div className="space-y-2">
              {/* Banner Image */}
              <BannerImage register={form.register} />

              <ProfileImage register={form.register} />

              {/* Basic Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-white dark:bg-gray-800 dark:text-gray-100"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-white dark:bg-gray-800 dark:text-gray-100"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Tagline */}
              <FormField
                control={form.control}
                name="tagline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tagline</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-white dark:bg-gray-800 dark:text-gray-100"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500 dark:text-gray-400">
                      A short description that appears below your name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="content"
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
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                className="bg-primary hover:bg-primary/90 dark:bg-primary-light dark:text-gray-900 dark:hover:bg-primary-light/90"              >
                {isLoading ? <LoadingSpinner /> : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
