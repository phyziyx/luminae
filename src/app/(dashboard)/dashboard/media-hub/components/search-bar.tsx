"use client";

import type React from "react";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search Media..."
          className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 pl-10 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
        >
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </form>
  );
}
