"use client";

import type React from "react";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "./components/searchbar";
import { searchBarSchema, SearchBarSchema } from "@/lib/forms";
import { useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query";
import SearchResultsList from "./components/search-results-list"; // import { type SearchParams } from "next/dist/server/request/search-params";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

function useSearchQuery({
  query,
  sort = "latest",
}: {
  query: string;
  sort?: string;
}) {
  return useInfiniteQuery({
    queryKey: queryKeys.community.search({
      query,
      sort,
    }),
    queryFn: async ({ pageParam }) => {
      const response = await fetch(
        `/api/community/search?query=${query}&sort=${sort}` +
          (pageParam ? `&cursor=${pageParam}` : "")
      );
      return response.json();
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: false,
  });
}

export default function SearchPage() {
  const [sortOption] = useState("latest");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const form = useForm<SearchBarSchema>({
    resolver: zodResolver(searchBarSchema),
    defaultValues: {
      search: "",
    },
    mode: "onChange",
  });

  const {
    data,
    isPending,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    refetch: refetchSearch,
  } = useSearchQuery({
    query: form.getValues().search,
    sort: sortOption,
  });

  const handleSearch = useCallback(
    (data: SearchBarSchema) => {
      setSearchQuery(data.search);
      refetchSearch();
    },
    [refetchSearch]
  );

  const searchResults = useMemo(
    () => data?.pages?.flatMap((page) => page.items) || [],
    [data]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 -ml-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light"
          asChild
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 sm:text-4xl">
            Search{" "}
            <span className="text-[#5B9AFF] dark:text-[#7BABFF]">Results</span>
            <div className="mt-2 h-1 w-48 bg-[#5B9AFF] dark:bg-[#7BABFF]"></div>
          </h1>
          <p className="mt-4 max-w-3xl text-gray-600 dark:text-gray-300">
            Find posts, discussions, and insights from our community members.
          </p>
        </div>

        <SearchBar form={form} onSubmit={handleSearch} />

        <SearchResultsList
          searchQuery={searchQuery}
          searchResults={searchResults}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isPending={isPending}
          isError={isError}
          isFetching={isFetching}
          isFetchingNextPage={isFetchingNextPage}
        />
      </main>
    </div>
  );
}
