"use client";

import onSubmitComment from "@/actions/submit-comment";
import { LoadingSpinner } from "@/components/site/loading-spinner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { commentFormSchema, CommentFormSchema } from "@/lib/forms";
import { queryKeys } from "@/lib/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

export default function CommentForm({ postId }: { postId: string }) {
  const { toast } = useToast();
  const t = useTranslations();
  const queryClient = useQueryClient();
  const form = useForm<CommentFormSchema>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      postId: postId,
      content: "",
      asAgency: false,
    },
    mode: "onBlur",
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = useCallback(
    async (values: CommentFormSchema) => {
      try {
        const response = await onSubmitComment(values);

        if (response.error) {
          toast({
            title: "Failed to add comment",
            description: response.error,
            variant: "destructive",
          });

          return;
        }

        form.reset({
          content: "",
        });

        toast({
          title: "Comment added",
          description: "Comment successfully posted.",
          variant: "default",
        });

        queryClient.setQueryData(
          queryKeys.community.postComments(postId),
          () => {
            queryClient.invalidateQueries({
              queryKey: queryKeys.community.postComments(postId),
            });
          }
        );
      } catch (err) {
        toast({
          title: "Failed to add comment",
          description: "Please try again later.",
          variant: "destructive",
        });

        console.log(err);
      }
    },
    [form, toast, queryClient, postId]
  );

  return (
    <div className="mb-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-soft">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Write your comment in markdown..."
                    className="mb-4 min-h-32 resize-y border-gray-200 dark:border-gray-700 focus-visible:ring-primary dark:focus-visible:ring-primary-light dark:bg-gray-800 dark:text-gray-100"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Supports markdown formatting
            </div>
            <div className="flex flex-row space-x-4 align-baseline">
              {
                <FormField
                  control={form.control}
                  name="asAgency"
                  render={({ field }) => (
                    <FormItem className="flex flex-row space-x-2 align-middle items-center place-items-center place-content-center">
                      <FormLabel className="text-xs text-gray-500 dark:text-gray-400">
                        Post as Agency?
                      </FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              }
              <Button
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 dark:bg-primary-light dark:hover:bg-primary-light/90 shadow-md hover:shadow-lg transition-all"
              >
                {isLoading ? <LoadingSpinner /> : t("SUBMIT")}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
