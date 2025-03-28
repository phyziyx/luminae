"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { searchBarSchema, SearchBarSchema } from "@/lib/forms";

export default function SearchBar({
  handleSearch,
}: {
  handleSearch: (data: SearchBarSchema) => void;
}) {
  const form = useForm<SearchBarSchema>({
    resolver: zodResolver(searchBarSchema),
    defaultValues: {
      search: "",
    },
    mode: "onChange",
  });

  const isLoading = form.formState.isSubmitting;

  return (
    <div className="mb-8 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-soft">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSearch)} className="flex flex-col gap-4 sm:flex-row align-middle place-items-center items-center justify-between">
          <div className="relative flex-1">
            <FormField
              control={form.control}
              name={"search"}
              render={({ field }) => {
                return (
                  <FormItem>
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                    <FormControl>
                      <Input
                        {...field}
                        type="search"
                        placeholder="Search for posts, topics, or keywords..."
                        className="pl-10 border-gray-200 dark:border-gray-700 focus-visible:ring-primary dark:focus-visible:ring-primary-light dark:bg-gray-800 dark:text-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <Button
            type="submit"
            className="bg-primary mt-2 hover:bg-primary/90 dark:bg-primary-light dark:text-white dark:hover:bg-primary-light/90 shadow-md hover:shadow-lg transition-all"
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
