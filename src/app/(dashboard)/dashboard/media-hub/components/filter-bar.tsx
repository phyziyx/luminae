import { Grid3X3, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
}

export function FilterBar({ view, setView }: FilterBarProps) {
  return (
    <div className="flex flex-row items-center bg-white dark:bg-slate-800 rounded-lg p-2">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "rounded-md h-8 w-full",
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
          "rounded-md h-8 w-full",
          view === "list"
            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
        )}
        onClick={() => setView("list")}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}
