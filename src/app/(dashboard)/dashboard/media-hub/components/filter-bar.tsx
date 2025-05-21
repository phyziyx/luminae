import { Grid3X3, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

interface FilterBarProps {
  title: string;
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
}

export function FilterBar({ title, view, setView }: FilterBarProps) {
  return (
    <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white">
        {title}
      </h2>

      <div className="flex items-center gap-4">
        {/* View toggle */}
        <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-md h-8",
              view === "grid"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
            )}
            onClick={() => setView("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-md h-8",
              view === "list"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
            )}
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        {/* Sort dropdown */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <span>Sort by</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          >
            <DropdownMenuItem
              onClick={() => setSortBy("date")}
              className={
                sortBy === "date"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : ""
              }
            >
              Date
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSortBy("name")}
              className={
                sortBy === "name"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : ""
              }
            >
              Name
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSortBy("type")}
              className={
                sortBy === "type"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : ""
              }
            >
              Type
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
    </div>
  );
}
