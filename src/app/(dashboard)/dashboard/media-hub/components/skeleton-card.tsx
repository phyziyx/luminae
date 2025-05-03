import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  view: "grid" | "list";
}

export function SkeletonCard({ view }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-800 rounded-xl overflow-hidden",
        "border border-slate-200 dark:border-slate-700",
        view === "grid" ? "w-full" : "w-full flex items-center"
      )}
    >
      <div
        className={cn(
          "animate-pulse bg-slate-100 dark:bg-slate-700",
          view === "grid" ? "w-full h-32" : "w-1/4 h-20"
        )}
      />
      <div className="p-3 w-full">
        <div className="animate-pulse bg-slate-100 dark:bg-slate-700 h-4 w-3/4 rounded mb-2" />
        <div className="animate-pulse bg-slate-100 dark:bg-slate-700 h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}
