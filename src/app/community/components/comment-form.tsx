"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { commentFormSchema, CommentFormSchema } from "@/lib/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

export default function CommentForm({ postId }: { postId: string }) {
  const { toast } = useToast();

  const form = useForm<CommentFormSchema>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      postId: postId,
      content: "",
    },
    mode: "onBlur",
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = useCallback(async (values: CommentFormSchema) => {
    try {
      //
    } catch (err) {
      //   toast({
      //     title: "Failed to add comment",
      //     description: "Please try again later.",
      //     variant: "destructive",
      //   });
      console.log(err);
    }
  }, []);

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
            <Button
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 dark:bg-primary-light dark:text-gray-900 dark:hover:bg-primary-light/90 shadow-md hover:shadow-lg transition-all"
            >
              Post Comment
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
