"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/site/mode-toggle";
import Logo from "@/components/logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronDownIcon, ChevronUpIcon, MenuIcon } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useState } from "react";

const communityLinks = [
  {
    name: "Home",
    href: "/community",
  },
  {
    name: "Trending",
    href: "/community/trending",
  },
];

// Categories for Mega Menu
const categories = [
  { name: "Gen. Discussion", href: "/community/categories/gen-discussion" },
  { name: "Bug Reporting", href: "/community/categories/bug-reporting" },
  { name: "Delete/Combine Pages", href: "/community/categories/delete-combine-pages" },
  { name: "Artist Show-Off", href: "/community/categories/artist-show-off" },
  { name: "Off-Topic", href: "/community/categories/off-topic" },
  { name: "Contests", href: "/community/categories/contests" },
  { name: "Battles", href: "/community/categories/battles" },
  { name: "Fan-Fic", href: "/community/categories/fan-fic" },
  { name: "RPG", href: "/community/categories/rpg" },
  { name: "Comic Book Preview", href: "/community/categories/comic-book-preview" },
  { name: "API Developers", href: "/community/categories/api-developers" },
  { name: "Editing & Tools", href: "/community/categories/editing-tools" },
  { name: "Podcast", href: "/community/categories/podcast" },
  { name: "Quests", href: "/community/categories/quests" },
  { name: "Feats and Analysis", href: "/community/categories/feats-and-analysis" },
];

const CommunityNavbar = () => {
  const [isSidebarCategoriesOpen, setIsSidebarCategoriesOpen] = useState(false);

  return (
    <header className="w-full border-b bg-muted dark:bg-muted/60 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/community" prefetch={false}>
          <Logo className="text-blue-500" />
        </Link>

        {/* Desktop Navigation with Corrected NavigationMenu */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {communityLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors"
            >
              {link.name}
            </Link>
          ))}

          {/* Categories Mega Menu Using ShadCN */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-700 dark:text-gray-300 hover:text-blue-500 flex items-center gap-1 bg-inherit">
                  Categories
                </NavigationMenuTrigger>

                {/* Correct Mega Menu Grid Layout */}
                <NavigationMenuContent className="w-[400px] lg:w-[500px] shadow-md rounded-md bg-white dark:bg-gray-950 mt-2 p-4">
                  <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-2">
                    {categories.map((category) => (
                      <li key={category.name}>
                        <NavigationMenuLink
                          asChild
                          className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Link href={category.href}>{category.name}</Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-white dark:bg-gray-950">
              <div className="flex flex-col gap-4 p-4">
                {communityLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Collapsible Categories Dropdown in Sidebar */}
                <div className="mt-2">
                  <button
                    onClick={() => setIsSidebarCategoriesOpen(!isSidebarCategoriesOpen)}
                    className="text-gray-700 dark:text-gray-300 font-semibold mb-2 w-full text-left flex items-center justify-between"
                  >
                    Categories {isSidebarCategoriesOpen ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                  </button>
                  {isSidebarCategoriesOpen && (
                    <div className="grid grid-cols-1 gap-2">
                      {categories.map((category) => (
                        <Link
                          key={category.name}
                          href={category.href}
                          className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <hr className="border-gray-300 dark:border-gray-700" />

                {/* Create Post and View Profile Buttons only in Sidebar */}
                <Link href="/community/create">
                  <Button className="w-full bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg transition-all dark:bg-primary/80 dark:hover:bg-primary/70">
                    Create Post
                  </Button>
                </Link>
                <Link href="/community/profile">
                  <Button className="w-full bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg transition-all dark:bg-primary/80 dark:hover:bg-primary/70">
                    View Profile
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Mode Toggle (Always Visible) */}
        <div className="flex items-center">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default CommunityNavbar;
