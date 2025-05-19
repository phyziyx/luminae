"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

// Components
// import { HeaderBar } from "./components/header-bar";
// import { TabsMenu } from "./components/tabs-menu";
// import { FilterBar } from "./components/filter-bar";
import { FileCard } from "./components/file-card";
// import { SkeletonCard } from "./components/skeleton-card";
import { FloatingUploadButton } from "./components/floating-upload-button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAgencyFiles } from "@/lib/managers/agencyManager";
import { AgencyFilesResponse } from "@/lib/types";
import { queryKeys } from "@/lib/react-query";
import { LoadingSpinner } from "@/components/site/loading-spinner";

// Menu tabs
// const menuTabs = [
//   { id: "recent", label: "Recent" },
//   { id: "images", label: "Images" },
//   { id: "pdfs", label: "PDFs" },
//   { id: "documents", label: "Documents" },
//   { id: "sheets", label: "Sheets" },
//   { id: "text", label: "Text Files" },
//   { id: "all", label: "All Files" },
//   { id: "favorites", label: "Favorites" },
// ];

export default function MediaHub() {
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [activeTab, setActiveTab] = useState("recent");
  const [view] = useState<"grid" | "list">("list");
  // const [searchQuery, setSearchQuery] = useState("");
  // const [sortBy, setSortBy] = useState<"date">("date");

  const {
    data,
    isFetching,
    // hasNextPage,
    // fetchNextPage,
    // isFetchingNextPage,
    // isError,
  } = useInfiniteQuery<AgencyFilesResponse>({
    queryKey: queryKeys.agency.files,
    queryFn: ({ pageParam }: { pageParam: unknown }) => {
      return fetchAgencyFiles({
        pageParam: pageParam as string | undefined,
      });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: { nextCursor?: string | null }) =>
      lastPage.nextCursor,
  });

  const files = data?.pages.flatMap((page) => page.items) || [];

  // Filter files based on active tab and search
  // const filteredFiles = files.filter((file) => {
  //   // Filter by tab
  //   if (activeTab === "recent") return true;
  //   if (activeTab === "images") return file.type === "image";
  //   if (activeTab === "pdfs") return file.type === "pdf";
  //   if (activeTab === "documents") return file.type === "doc";
  //   if (activeTab === "sheets") return file.type === "sheet";
  //   if (activeTab === "text") return file.type === "text";
  //   if (activeTab === "favorites") return file.isFavorite;
  //   // Search filter
  //   if (searchQuery) {
  //     return file.name.toLowerCase().includes(searchQuery.toLowerCase());
  //   }
  //   return true;
  // });

  // Sort files
  // const sortedFiles = [...filteredFiles].sort((a, b) => {
  //   if (sortBy === "name") return a.name.localeCompare(b.name);
  //   if (sortBy === "date")
  //     return new Date(b.date).getTime() - new Date(a.date).getTime();
  //   if (sortBy === "type") return a.type.localeCompare(b.type);
  //   return 0;
  // });

  // Handle search
  // const handleSearch = (query: string) => {
  //   setSearchQuery(query);
  // };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-3xl font-semibold">Media Hub</h1>
        </div>
      </header>
      <div className="min-h-screen bg-gradient-to-b from-[#f8fbff] to-[#e9f0fb] dark:from-slate-900 dark:to-slate-800 text-slate-800 dark:text-slate-200">
        <div className="flex h-screen overflow-hidden">
          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            {/* <HeaderBar
              onSearch={handleSearch}
              toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
            /> */}

            {/* Horizontal tabs */}
            {/* <TabsMenu
              tabs={menuTabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            /> */}

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#f8fbff] dark:bg-slate-900">
              {/* Filter and sort bar */}
              {/* <FilterBar
                title={
                  menuTabs.find((tab) => tab.id === activeTab)?.label || "Files"
                }
                view={view}
                setView={setView}
                sortBy={sortBy}
                setSortBy={setSortBy}
              /> */}

              {/* Files grid/list */}
              <div
                className={cn(
                  "grid gap-4",
                  view === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                    : "grid-cols-1"
                )}
              >
                {isFetching ? (
                  <LoadingSpinner />
                ) : files.length > 0 ? (
                  files.map((file) => (
                    <FileCard key={file.key} file={file} view={view} />
                  ))
                ) : (
                  // No files found
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-white dark:bg-slate-800 rounded-full p-4 mb-4">
                      <Search className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                    </div>
                    <h3 className="text-xl font-medium mb-2 text-slate-800 dark:text-white">
                      No files found
                    </h3>
                    {/* <p className="text-slate-500 dark:text-slate-400 max-w-md">
                      We couldn&apos;t find any files matching your search
                      criteria. Try adjusting your filters or search terms.
                    </p> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Floating action button */}
        <FloatingUploadButton />
      </div>
    </>
  );
}
