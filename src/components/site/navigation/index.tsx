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
    <header className="w-full border-b bg-luminae dark:border-gray-800 dark:bg-gray-950">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between justify-items-center px-4 md:px-6">
        {/* Logo */}
        <div>
          <Link
            href="#"
            className="items-center gap-2 md:block hidden"
            prefetch={false}
          >
            <Image
              src={"/assets/logo_big.svg"}
              width={200}
              height={200}
              alt="luminae logo"
              className="fill-blue-500"
            />
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="md:hidden">
              <Image
                src={"/assets/logo.png"}
                width={200}
                height={200}
                alt="luminae logo"
                className="text-blue-500"
              />
              <hr />
              <div className="grid gap-4 p-4">
                {navbarLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn({
                      "font-bold text-blue-500 hover:text-blue-500":
                        pathName === link.href,
                      "hover:text-blue-300": pathName !== link.href,
                    })}
                    prefetch={false}
                  >
                    {link.name}
                  </Link>
                ))}
                <hr />
                {!user ? (
                  <Button>
                    <HouseIcon />
                    <Link href="/agency">{t("DASHBOARD")}</Link>
                  </Button>
                ) : (
                  <>
                    <Button>
                      <User2Icon />
                      <Link href="/agency/sign-in">{t("SIGN_IN")}</Link>
                    </Button>
                    <Button variant={"secondary"}>
                      <UserRoundPlus />
                      <Link href="/agency/sign-up">{t("SIGN_UP")}</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Navbar */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navbarLinks.map((link) => (
            <Link
              key={link.name}
              className={cn("font-bold", {
                "text-blue-500 hover:text-blue-500": pathName === link.href,
                "text-gray-500 dark:text-gray-100 hover:text-blue-300":
                  pathName !== link.href,
              })}
              href={link.href}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Options for Mode Toggle, Sign Up and Sign In  */}
        <div className="flex flex-row gap-2">
          <ModeToggle />
          {user ? (
            <Button>
              <HouseIcon />
              <Link href="/agency">{t("DASHBOARD")}</Link>
            </Button>
          ) : (
            <div className="md:flex flex-row gap-2 hidden">
              <Button>
                <User2Icon />
                <Link href="/agency/sign-in">{t("SIGN_IN")}</Link>
              </Button>
              <Button variant={"secondary"}>
                <UserRoundPlus />
                <Link href="/agency/sign-up">{t("SIGN_UP")}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
