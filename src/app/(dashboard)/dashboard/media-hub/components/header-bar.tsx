import { SearchBar } from "./search-bar";
import { FilterBar } from "./filter-bar";

interface HeaderBarProps {
  onSearch: (query: string) => void;
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
}

export function HeaderBar({ onSearch, view, setView }: HeaderBarProps) {
  return (
    <div className="w-full flex flex-col sm:flex-row min-h-16 justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sm:items-center px-4">
      <SearchBar onSearch={onSearch} />
      <FilterBar view={view} setView={setView} />
    </div>
  );
}
