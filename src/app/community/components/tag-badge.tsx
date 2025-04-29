import { cn } from "@/lib/utils";

export default function TagBadge({
  text,
  variant,
}: {
  text: string;
  variant?: "default" | "create";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full px-3 py-1 bg-primary/10 dark:bg-primary-light/20 text-primary dark:text-primary-light",
        {
          "text-xs": variant === "default",
          "text-sm font-medium": variant === "create",
        }
      )}
    >
      #{text}
    </div>
  );
}
