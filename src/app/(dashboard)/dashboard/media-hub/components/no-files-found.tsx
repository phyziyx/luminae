import { SearchIcon } from "lucide-react";

function NoFilesFound({ filtersApplied }: { filtersApplied?: boolean }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-white dark:bg-slate-800 rounded-full p-4 mb-4">
        <SearchIcon className="h-8 w-8 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-xl font-medium mb-2 text-slate-800 dark:text-white">
        No files found
      </h3>
      {filtersApplied && (
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          We couldn&apos;t find any files matching your search criteria. Try
          adjusting your filters or search terms.
        </p>
      )}
    </div>
  );
}

export default NoFilesFound;
