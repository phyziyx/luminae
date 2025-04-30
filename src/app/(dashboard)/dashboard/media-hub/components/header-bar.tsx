import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./search-bar";

interface HeaderBarProps {
  onSearch: (query: string) => void;
  toggleMenu: () => void;
}

export function HeaderBar({ onSearch, toggleMenu }: HeaderBarProps) {
  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 sticky top-0 z-30">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 mr-2"
        onClick={toggleMenu}
      >
        <Menu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
      </Button>

      <SearchBar onSearch={onSearch} />
    </header>
  );
}
