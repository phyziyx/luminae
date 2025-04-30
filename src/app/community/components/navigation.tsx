"use client";

import Link from "next/link";
import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";

import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/site/mode-toggle";
import Logo from "@/components/logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MenuIcon,
  UserIcon,
  LogOut,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Import the server action
import { fetchCategoriesAction } from "./actions/fetchCategories";

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

export default function CommunityNavbar() {
  const [isSidebarCategoriesOpen, setIsSidebarCategoriesOpen] = useState(false);

  // 1) For sign out
  const router = useRouter();
  const [pendingSignOut, setPendingSignOut] = useState<boolean>(false);

  const handleSignOut = async () => {
    try {
      setPendingSignOut(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
          },
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setPendingSignOut(false);
    }
  };

  // 2) Load categories from DB
  const [categories, setCategories] = useState<
    { id: string; name: string; title: string }[]
  >([]);

  const [, startTransition] = useTransition();

  useEffect(() => {
    // In a client component, we can call a server action using startTransition:

    startTransition(async () => {
      try {
        const dbCategories = await fetchCategoriesAction();
        setCategories(dbCategories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    });
  }, []);

  return (
    <header className="w-full border-b bg-muted dark:bg-muted/60 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/community" prefetch={false}>
          <Logo className="text-blue-500" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {/* Main links: Home, Trending */}
          <nav className="flex items-center gap-6 text-sm font-medium">
            {communityLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {/* Categories Mega Menu */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 dark:text-gray-300 hover:text-blue-500 flex items-center gap-1 bg-inherit">
                    Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[400px] lg:w-[500px] shadow-md rounded-md bg-white dark:bg-gray-950 p-4">
                    <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-2">
                      {categories.map((category) => (
                        <li key={category.id}>
                          <NavigationMenuLink
                            asChild
                            className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <Link href={`/community/${category.name}`}>
                              {category.title}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>

        {/* Mobile Menu (Sheet) */}
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 bg-white dark:bg-gray-950"
            >
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

                {/* Collapsible Categories in Sidebar */}
                <div className="mt-2">
                  <button
                    onClick={() => setIsSidebarCategoriesOpen((prev) => !prev)}
                    className="text-gray-700 dark:text-gray-300 font-semibold mb-2 w-full text-left flex items-center justify-between"
                  >
                    Categories{" "}
                    {isSidebarCategoriesOpen ? (
                      <ChevronUpIcon className="h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" />
                    )}
                  </button>
                  {isSidebarCategoriesOpen && (
                    <div className="grid grid-cols-1 gap-2">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/community/${cat.name}`}
                          className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors"
                        >
                          {cat.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <hr className="border-gray-300 dark:border-gray-700" />

                {/* View Profile */}
                <Link href="/community/profile">
                  <Button className="w-full flex items-center gap-2 bg-primary text-white hover:bg-primary/90 shadow-md dark:bg-primary/80 dark:hover:bg-primary/70 transition-all">
                    <UserIcon className="h-4 w-4" />
                    View Profile
                  </Button>
                </Link>

                {/* Sign Out */}
                <Button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 bg-primary text-white hover:bg-primary/90 shadow-md dark:bg-primary/80 dark:hover:bg-primary/70 transition-all"
                  disabled={pendingSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Mode Toggle (always visible on the far right) */}
        <div className="flex items-center md:ml-4">
          {/* Right side icons: View Profile, Create Post, etc. */}
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/community/profile"
                    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <UserIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Profile</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ModeToggle />
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Dark Mode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {/* Sign Out Icon */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  className="rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                  disabled={pendingSignOut}
                >
                  <LogOut className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sign Out</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}
