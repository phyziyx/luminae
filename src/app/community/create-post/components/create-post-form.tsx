"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostTitleInput from "./post-title-input";
import CategorySelector from "./category-selector";
import MarkdownEditor from "./markdown-editor";
import MarkdownPreview from "./markdown-preview";
import ImageUpload from "./image-upload";
import TagInput from "./tag-input";
import Image from "next/image";

export default function CreatePostForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    image: null as File | null,
    imagePreview: "",
    tags: [] as string[],
  });

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, title: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleContentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  const handleImageChange = (file: File | null, preview: string) => {
    setFormData((prev) => ({ ...prev, image: file, imagePreview: preview }));
  };

  const handleTagsChange = (tags: string[]) => {
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleSubmit = async (isDraft = false) => {
    setIsSubmitting(true);

    try {
      // In a real app, you would submit the form data to your API here
      console.log("Submitting post:", { ...formData, isDraft });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect to the post or drafts page
      router.push(isDraft ? "/drafts" : "/");
    } catch (error) {
      console.error("Error submitting post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? Any unsaved changes will be lost."
      )
    ) {
      router.back();
    }
  };

  const isFormValid =
    formData.title.trim() !== "" &&
    formData.category !== "" &&
    formData.content.trim() !== "";

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

            <div className="flex items-center gap-2 self-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSubmit(true)}
                disabled={!isFormValid || isSubmitting}
                className="border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
              >
                Save as Draft
              </Button>
            </div>
          </div>

          <TabsContent value="edit" className="mt-0">
            <div className="space-y-6">
              <PostTitleInput
                value={formData.title}
                onChange={handleTitleChange}
              />

              <CategorySelector
                value={formData.category}
                onChange={handleCategoryChange}
              />

              <MarkdownEditor
                value={formData.content}
                onChange={handleContentChange}
              />

              <ImageUpload
                value={formData.image}
                preview={formData.imagePreview}
                onChange={handleImageChange}
              />

              <TagInput value={formData.tags} onChange={handleTagsChange} />
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-0">
            <div className="rounded-md border border-gray-200 dark:border-gray-700 p-6">
              {formData.title ? (
                <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {formData.title}
                </h1>
              ) : (
                <p className="mb-4 text-gray-400 dark:text-gray-500 italic">
                  No title provided
                </p>
              )}

              {formData.category && (
                <div className="mb-4">
                  <span className="rounded-full bg-primary/10 dark:bg-primary-light/20 px-3 py-1 text-xs font-medium text-primary dark:text-primary-light">
                    {formData.category}
                  </span>
                </div>
              )}

              {formData.imagePreview && (
                <div className="mb-6 overflow-hidden rounded-md">
                  <Image
                    src={formData.imagePreview || "/placeholder.svg"}
                    alt="Post image"
                    className="w-full object-cover max-h-96"
                    width={1200}
                    height={600}
                  />
                </div>
              )}

              <div className="prose prose-blue dark:prose-invert max-w-none">
                {formData.content ? (
                  <MarkdownPreview content={formData.content} />
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 italic">
                    No content provided
                  </p>
                )}
              </div>

              {formData.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
          >
            Cancel
          </Button>

          <Button
            onClick={() => handleSubmit(false)}
            disabled={!isFormValid || isSubmitting}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 dark:bg-primary-light dark:text-gray-900 dark:hover:bg-primary-light/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Post...
              </>
            ) : (
              "Create Post"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
