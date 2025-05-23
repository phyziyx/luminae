"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// Components
import { FileCard } from "./components/file-card";
import { FloatingUploadButton } from "./components/floating-upload-button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAgencyFiles } from "@/lib/managers/agencyManager";
import { AgencyFilesResponse } from "@/lib/types";
import { queryKeys } from "@/lib/react-query";
import { LoadingSpinner } from "@/components/site/loading-spinner";
import InfiniteScrollContainer from "@/components/site/infinite-scroll-container";

import NoFilesFound from "./components/no-files-found";
import { HeaderBar } from "./components/header-bar";
import { useDebounce } from "@uidotdev/usehooks";
import { TabsMenu } from "./components/tabs-menu";
import { FileType } from "@/lib/r2";

const menuTabs: { id: FileType; label: string }[] = [
  { id: "all", label: "All Files" },
  { id: "images", label: "Images" },
  { id: "pdfs", label: "PDFs" },
  { id: "documents", label: "Documents" },
  { id: "sheets", label: "Sheets" },
  { id: "text", label: "Text Files" },
  { id: "others", label: "Others" },
];

export default function MediaHub() {
  const [activeTab, setActiveTab] = useState<FileType>("all");

  const [sortBy, setSortBy] = useState<"date">("date");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  const [view, setView] = useState<"grid" | "list">("list");

  const {
    data,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery<AgencyFilesResponse>({
    queryKey: queryKeys.agencyFiles.search({
      query: debouncedSearchQuery,
      fileType: activeTab,
    }),
    queryFn: ({ pageParam }: { pageParam: unknown }) => {
      return fetchAgencyFiles({
        pageParam: pageParam as string | undefined,
        searchTerm: debouncedSearchQuery,
        fileType: activeTab,
      });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: { nextCursor?: string | null }) =>
      lastPage.nextCursor,
  });

  const files = data?.pages.flatMap((page) => page.items) || [];

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-3xl font-semibold">Media Hub</h1>
        </div>
      </header>
      <div className="text-slate-800 dark:text-slate-200">
        <div className="flex">
          <div className="flex-1 flex flex-col overflow-hidden px-2">
            <HeaderBar
              onSearch={setSearchQuery}
              view={view}
              setView={setView}
            />

            <TabsMenu
              tabs={menuTabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            <InfiniteScrollContainer
              className="flex-1 overflow-y-auto p-4"
              onBottomReached={() =>
                hasNextPage &&
                !isFetching &&
                !isFetchingNextPage &&
                fetchNextPage()
              }
            >
              {isFetching ? (
                <div className="flex text-blue-500 items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : files.length > 0 ? (
                <div
                  className={cn(
                    "grid gap-4",
                    view === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                      : "grid-cols-1"
                  )}
                >
                  {files.map((file) => (
                    <FileCard key={file.key} file={file} view={view} />
                  ))}
                </div>
              ) : (
                <NoFilesFound
                  filtersApplied={!!debouncedSearchQuery || activeTab !== "all"}
                />
              )}
              {isFetchingNextPage && (
                <div className="flex text-blue-500 items-center justify-center">
                  <LoadingSpinner />
                </div>
              )}

              {isError && (
                <div className="flex text-red-500 items-center justify-center">
                  <p>Error fetching files. Please try again later.</p>
                </div>
              )}
            </InfiniteScrollContainer>
          </div>
        </div>

        <FloatingUploadButton />
      </div>
    </>
  );
}
