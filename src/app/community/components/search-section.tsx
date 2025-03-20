import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const categories = [
  "All Categories",
  "Design",
  "Development",
  "Marketing",
  "Business",
  "Technology",
  "Lifestyle",
];

export default function SearchSection() {
  return (
    <section className="mb-12 rounded-xl bg-gradient-to-r from-blue-50 to-white p-6 md:p-8 shadow-soft">
      <div className="mb-4 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-800 sm:text-3xl">
          Find What You&apos;re Looking For
        </h2>
        <p className="text-gray-600">
          Search through{" "}
          <span className="text-primary font-medium">thousands of posts</span>{" "}
          from our community members
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="search"
            placeholder="Search posts, topics, or keywords..."
            className="pl-10 border-gray-200 focus-visible:ring-primary bg-white dark:bg-muted/50"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto border-primary text-primary hover:bg-primary/5"
            >
              Filter by Category
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Categories</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {categories.map((category) => (
                <DropdownMenuItem key={category}>{category}</DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all">
          Search
        </Button>
      </div>
    </section>
  );
}
