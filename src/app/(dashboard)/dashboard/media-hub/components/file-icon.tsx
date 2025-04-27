import { cn } from "@/lib/utils";

interface FileIconProps {
  type: string;
}

export function FileIcon({ type }: FileIconProps) {
  const iconColor = {
    pdf: "text-red-400 dark:text-red-300",
    doc: "text-blue-400 dark:text-blue-300",
    sheet: "text-green-400 dark:text-green-300",
    text: "text-yellow-400 dark:text-yellow-300",
    default: "text-slate-400 dark:text-slate-300",
  };

  return (
    <div
      className={cn(
        "w-full h-32 flex items-center justify-center rounded-lg",
        type === "pdf"
          ? "bg-red-50 dark:bg-red-900/20"
          : type === "doc"
          ? "bg-blue-50 dark:bg-blue-900/20"
          : type === "sheet"
          ? "bg-green-50 dark:bg-green-900/20"
          : type === "text"
          ? "bg-yellow-50 dark:bg-yellow-900/20"
          : "bg-slate-50 dark:bg-slate-800/40"
      )}
    >
      <div
        className={cn(
          "text-3xl font-bold",
          iconColor[type as keyof typeof iconColor] || iconColor.default
        )}
      >
        {type === "pdf"
          ? "PDF"
          : type === "doc"
          ? "DOC"
          : type === "sheet"
          ? "XLS"
          : type === "text"
          ? "TXT"
          : "FILE"}
      </div>
    </div>
  );
}
