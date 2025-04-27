"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

// Components
import { HeaderBar } from "./components/header-bar";
import { TabsMenu } from "./components/tabs-menu";
import { FilterBar } from "./components/filter-bar";
import { FileCard } from "./components/file-card";
import { SkeletonCard } from "./components/skeleton-card";
import { FloatingUploadButton } from "./components/floating-upload-button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

// Sample data
const files = [
  {
    id: 1,
    name: "Project Proposal",
    type: "doc",
    date: "2023-04-15",
    isFavorite: true,
  },
  {
    id: 2,
    name: "Marketing Campaign",
    type: "image",
    date: "2023-04-10",
    isFavorite: false,
    imageUrl: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 3,
    name: "Financial Report",
    type: "sheet",
    date: "2023-04-05",
    isFavorite: true,
  },
  {
    id: 4,
    name: "Brand Guidelines",
    type: "pdf",
    date: "2023-03-28",
    isFavorite: false,
  },
  {
    id: 5,
    name: "Meeting Notes",
    type: "text",
    date: "2023-03-25",
    isFavorite: false,
  },
  {
    id: 6,
    name: "Product Mockup",
    type: "image",
    date: "2023-03-20",
    isFavorite: true,
    imageUrl: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 7,
    name: "Client Presentation",
    type: "pdf",
    date: "2023-03-15",
    isFavorite: false,
  },
  {
    id: 8,
    name: "Team Photo",
    type: "image",
    date: "2023-03-10",
    isFavorite: true,
    imageUrl: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 9,
    name: "Project Timeline",
    type: "sheet",
    date: "2023-03-05",
    isFavorite: false,
  },
  {
    id: 10,
    name: "User Research",
    type: "doc",
    date: "2023-02-28",
    isFavorite: true,
  },
  {
    id: 11,
    name: "Logo Design",
    type: "image",
    date: "2023-02-25",
    isFavorite: false,
    imageUrl: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 12,
    name: "Contract Template",
    type: "doc",
    date: "2023-02-20",
    isFavorite: true,
  },
];

// Menu tabs
const menuTabs = [
  { id: "recent", label: "Recent" },
  { id: "images", label: "Images" },
  { id: "pdfs", label: "PDFs" },
  { id: "documents", label: "Documents" },
  { id: "sheets", label: "Sheets" },
  { id: "text", label: "Text Files" },
  { id: "all", label: "All Files" },
  { id: "favorites", label: "Favorites" },
];

export default function MediaHub() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("recent");
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Filter files based on active tab and search
  const filteredFiles = files.filter((file) => {
    // Filter by tab
    if (activeTab === "recent") return true;
    if (activeTab === "images") return file.type === "image";
    if (activeTab === "pdfs") return file.type === "pdf";
    if (activeTab === "documents") return file.type === "doc";
    if (activeTab === "sheets") return file.type === "sheet";
    if (activeTab === "text") return file.type === "text";
    if (activeTab === "favorites") return file.isFavorite;

    // Search filter
    if (searchQuery) {
      return file.name.toLowerCase().includes(searchQuery.toLowerCase());
    }

    return true;
  });

  // Sort files
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "date")
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === "type") return a.type.localeCompare(b.type);
    return 0;
  });

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

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
            <HeaderBar
              onSearch={handleSearch}
              toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
            />

            {/* Horizontal tabs */}
            <TabsMenu
              tabs={menuTabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#f8fbff] dark:bg-slate-900">
              {/* Filter and sort bar */}
              <FilterBar
                title={
                  menuTabs.find((tab) => tab.id === activeTab)?.label || "Files"
                }
                view={view}
                setView={setView}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />

              {/* Files grid/list */}
              <div
                className={cn(
                  "grid gap-4",
                  view === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                    : "grid-cols-1"
                )}
              >
                {isLoading ? (
                  // Skeleton loading
                  [...Array(8)].map((_, i) => (
                    <SkeletonCard key={i} view={view} />
                  ))
                ) : sortedFiles.length > 0 ? (
                  // Files
                  sortedFiles.map((file) => (
                    <FileCard key={file.id} file={file} view={view} />
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
                    <p className="text-slate-500 dark:text-slate-400 max-w-md">
                      We couldn&apos;t find any files matching your search
                      criteria. Try adjusting your filters or search terms.
                    </p>
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
