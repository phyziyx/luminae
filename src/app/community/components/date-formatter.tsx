import { LucideCalendar, LucidePencil } from "lucide-react";

export default function DateFormatter({
  createdAt,
  updatedAt,
}: {
  createdAt: Date;
  updatedAt: Date | null | undefined;
}) {
  return (
    <div className="flex flex-row text-xs gap-2 text-gray-500 dark:text-gray-400 content-center place-items-center align-middle">
      <div className="flex flex-row align-baseline">
        <LucideCalendar className="h-3 w-3 mr-1 align-baseline" />{" "}
        {new Date(createdAt).toLocaleString()}
      </div>
      {updatedAt && createdAt !== updatedAt && (
        <>
          •
          <div className="flex flex-row align-baseline">
            <LucidePencil className="h-3 w-3 mr-1" />{" "}
            {new Date(updatedAt).toLocaleString()}
          </div>
        </>
      )}
    </div>
  );
}
