"use client";

import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { PostComment } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateCommentSchema, updateCommentSchema } from "@/lib/forms";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/site/loading-spinner";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import getQueryClient from "@/lib/react-query";
import onUpdateComment from "@/actions/update-comment";

export default function CommentEditor({
  comment,
  setEditing,
}: {
  comment: PostComment;
  setEditing: (editing: boolean) => void;
}) {
  const t = useTranslations();
  const { toast } = useToast();

  const queryClient = getQueryClient();

  const form = useForm<UpdateCommentSchema>({
    resolver: zodResolver(updateCommentSchema),
    defaultValues: {
      content: comment.content,
      commentId: comment.id,
    },
  });

  const onSubmit = useCallback(
    async (values: UpdateCommentSchema) => {
      try {
        const response = await onUpdateComment(values);

        if (response.error) {
          toast({
            title: "Failed to update comment",
            description: response.error,
            variant: "destructive",
          });

          return;
        }

        form.reset({
          content: "",
        });

        toast({
          title: "Comment update",
          description: "Comment successfully updated.",
          variant: "default",
        });

        setEditing(false);

        // queryClient.setQueryData(
        //   queryKeys.community.postComments(postId),
        //   () => {
        //     queryClient.invalidateQueries({
        //       queryKey: queryKeys.community.postComments(postId),
        //     });
        //   }
        // );
      } catch (err) {
        toast({
          title: "Failed to update comment",
          description: "Please try again later.",
          variant: "destructive",
        });

        console.log(err);
      }
    },
    [form, toast, setEditing]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="content"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Textarea
                placeholder="Update your comment..."
                className="mb-3 min-h-24 resize-y border-gray-200 dark:border-gray-700 focus-visible:ring-primary dark:focus-visible:ring-primary-light dark:bg-gray-800 dark:text-gray-100"
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Supports markdown formatting
          </div>
          <div className="flex flex-row space-x-4 align-baseline">
            <Button
              disabled={
                !form.formState.isValid ||
                form.formState.isSubmitting ||
                form.formState.isSubmitted
              }
              className="bg-primary hover:bg-primary/90 dark:bg-primary-light dark:hover:bg-primary-light/90 shadow-md hover:shadow-lg transition-all"
            >
              {form.formState.isSubmitting || form.formState.isSubmitted ? (
                <LoadingSpinner />
              ) : (
                t("SUBMIT")
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
