"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostTitleInput from "./post-title-input";
import MarkdownEditor from "./markdown-editor";
import MarkdownPreview from "./markdown-preview";
import ImageUpload from "./image-upload";
import TagInput from "./tag-input";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSpinner } from "@/components/site/loading-spinner";
import { createPostSchema, CreatePostSchema } from "@/lib/forms";
import onCreatePost from "@/actions/create-post";
import { TagsPreview } from "@/app/community/components/tag-preview";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";

// function SaveAsDraft({
//   handleSubmit,
//   isDisabled,
// }: {
//   handleSubmit: () => void;
//   isDisabled: boolean;
// }) {
//   return (
//     <div className="flex items-center gap-2 self-end">
//       <Button
//         variant="outline"
//         size="sm"
//         onClick={handleSubmit}
//         disabled={isDisabled}
//         className="border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
//       >
//         Save as Draft
//       </Button>
//     </div>
//   );
// }

export default function CreatePostForm({ category }: { category: string }) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("edit");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ["canPostAsAgency"],
    queryFn: async () => {
      const response = await fetch("/api/community/agency-status");
      if (!response.ok) {
        throw new Error("Failed to fetch agency status");
      }
      return (await response.json()) as { canPostAsAgency: boolean };
    },
  });

  const form = useForm<CreatePostSchema>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      category: category,
      title: "",
      content: "",
      image: null,
      tags: [],
      asAgency: false,
    },
  });

  const tags = useMemo(() => form.getValues("tags"), [form]);

  const onSubmit = useCallback(
    async (data: CreatePostSchema, isDraft = false) => {
      try {
        console.log("Submitting post:", { ...data, isDraft });

        const response = await onCreatePost({
          ...data,
          asAgency: data.asAgency,
        });

        if (response.post) router.push(response.post);
      } catch (error) {
        console.error("Error submitting post:", error);
      }
    },
    [router]
  );

  const submitForm = useCallback(() => {
    form.handleSubmit((data) => onSubmit(data, false))();
  }, [form, onSubmit]);

  const handleCancel = useCallback(() => {
    if (
      window.confirm(
        "Are you sure you want to cancel? Any unsaved changes will be lost."
      )
    ) {
      router.back();
    }
  }, [router]);

  return (
    <Card className="mb-8 overflow-hidden bg-white dark:bg-gray-800 shadow-soft">
      <CardContent className="p-6 sm:p-8">
        <Tabs
          defaultValue="edit"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList className="bg-blue-50 dark:bg-gray-700">
              <TabsTrigger
                value="edit"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
              >
                Edit
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
              >
                Preview
              </TabsTrigger>
            </TabsList>

            {/* <SaveAsDraft
              handleSubmit={submitForm}
              isDisabled={
                !form.formState.isValid || form.formState.isSubmitting
              }
            /> */}
          </div>

          <TabsContent value="preview" className="mt-0">
            <div className="rounded-md border border-gray-200 dark:border-gray-700 p-6">
              {form.getValues("title") ? (
                <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {form.getValues("title")}
                </h1>
              ) : (
                <p className="mb-4 text-gray-400 dark:text-gray-500 italic">
                  No title provided
                </p>
              )}

              {imagePreview && (
                <div className="mb-6 overflow-hidden rounded-md">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Post image"
                    className="w-full object-cover max-h-96"
                    width={1200}
                    height={600}
                  />
                </div>
              )}

              <div className="prose prose-blue dark:prose-invert max-w-none">
                {form.getValues("content") ? (
                  <MarkdownPreview content={form.getValues("content")} />
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 italic">
                    No content provided
                  </p>
                )}
              </div>

              <TagsPreview tags={tags} />
            </div>
          </TabsContent>

          <TabsContent value="edit" className="mt-0">
            <div className="space-y-6">
              <Form {...form}>
                <form onSubmit={submitForm} className="space-y-4">
                  {/* Title Input */}
                  <FormField
                    name="title"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Controller
                          {...field}
                          render={({ field }) => (
                            <PostTitleInput
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Content */}
                  <FormField
                    name="content"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Controller
                          {...field}
                          render={({ field }) => (
                            <MarkdownEditor
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Image Upload */}
                  <FormField
                    name="image"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Controller
                          {...field}
                          render={({ field }) => (
                            <ImageUpload
                              value={field.value}
                              onChange={(file) => {
                                field.onChange(file);

                                if (file) {
                                  setImagePreview(URL.createObjectURL(file));
                                }
                              }}
                            />
                          )}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tags */}
                  <FormField
                    name="tags"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Controller
                          {...field}
                          render={({ field }) => (
                            <TagInput
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-4">
          {data?.canPostAsAgency && (
            <Form {...form}>
              <FormField
                control={form.control}
                name="asAgency"
                render={({ field }) => (
                  <FormItem className="flex flex-row space-x-2 place-items-center space-y-0">
                    <FormLabel className="text-xs text-gray-500 dark:text-gray-400">
                      Post as Agency?
                    </FormLabel>
                    <FormControl>
                      <Checkbox
                        className="p-0 m-0 space-x-0 place-items-stretch"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </Form>
          )}

          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
          >
            Cancel
          </Button>

          <Button
            onClick={submitForm}
            disabled={form.formState.isSubmitting}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 dark:bg-primary-light dark:text-gray-900 dark:hover:bg-primary-light/90"
          >
            {form.formState.isSubmitting ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner className="h-4 w-4 animate-spin" />
                Creating Post...
              </div>
            ) : (
              "Create Post"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
