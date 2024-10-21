"use client";

// import { UserButton } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import {
  HouseIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  User2Icon,
  UserRoundPlus,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type Props = {
  user?: null | User;
};

const ModeToggle = () => {
  const { theme, setTheme } = useTheme();

  const onChange = () => {
    // Note: Theme can be undefined, "light", or "dark"
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button variant="ghost" onClick={() => onChange()}>
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
};

const navbarLinks = [
  {
    name: "Pricing",
    href: "/home",
  },
  {
    name: "Documentation",
    href: "/documentation",
  },
] as const;

const Navigation = ({ user }: Props) => {
  const pathName = usePathname();

  const t = useTranslations();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <Image
            src={"/assets/logo.png"}
            width={200}
            height={200}
            alt="luminae logo"
            className="text-blue-500"
          />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navbarLinks.map((link) => (
            <Link
              key={link.name}
              className={cn({
                "font-bold text-blue-500 hover:text-blue-500":
                  pathName === link.href,
                "hover:text-blue-300": pathName !== link.href,
              })}
              href={link.href}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full md:hidden"
              >
                <MenuIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="md:hidden">
              <div className="grid gap-4 p-4">
                {navbarLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                    prefetch={false}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <ModeToggle />
          <div>
            {user ? (
              <Button>
                <HouseIcon />
                <Link href="/agency">{t("DASHBOARD")}</Link>
              </Button>
            ) : (
              <div className="flex flex-row gap-2">
                <Button>
                  <User2Icon />
                  <Link className="" href="/agency/sign-in">
                    {t("SIGN_IN")}
                  </Link>
                </Button>
                <Button variant={"secondary"}>
                  <UserRoundPlus />
                  <Link className="" href="/agency/sign-up">
                    {t("SIGN_UP")}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
