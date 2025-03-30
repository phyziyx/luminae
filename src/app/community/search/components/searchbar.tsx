"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SearchIcon, XCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { SearchBarSchema } from "@/lib/forms";
import { LoadingSpinner } from "@/components/site/loading-spinner";
import { cn } from "@/lib/utils";

export default function SearchBar({
  form,
  onSubmit,
}: {
  form: ReturnType<typeof useForm<SearchBarSchema>>;
  onSubmit: (data: SearchBarSchema) => void;
}) {
  const isLoading = form.formState.isSubmitting;

  return (
    <div className="mb-8 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-soft">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 sm:flex-row items-baseline place-items-center"
        >
          <FormField
            control={form.control}
            name={"search"}
            render={({ field }) => {
              return (
                <FormItem className="relative flex flex-col w-full">
                  <SearchIcon className="absolute ml-2 top-4 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <FormControl className="w-full">
                    <Input
                      {...field}
                      type="search"
                      placeholder="Search for posts, topics, or keywords..."
                      className="pl-10 w-full bg-transparent text-gray-900 dark:text-gray-100 focus:ring-0 focus:outline-none"
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />

          <Button
            type="submit"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 dark:bg-primary-light dark:text-white dark:hover:bg-primary-light/90 shadow-md hover:shadow-lg transition-all"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : "Search"}
          </Button>
        </form>

        <FormMessage
          className={cn(
            "flex p-2 mt-2 bg-red-500/20 rounded-xl dark:text-red-500 justify-between",
            {
              hidden: !form.formState.errors.search,
            }
          )}
        >
          {form.formState.errors.search?.message}
          <XCircleIcon
            className="ml-2 h-5 w-5 text-red-500 hover:cursor-pointer"
            onClick={() => form.clearErrors()}
          />
        </FormMessage>
      </Form>
    </div>
  );
}
