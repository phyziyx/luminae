"use client";

import {
  HouseIcon,
  MenuIcon,
  User2Icon,
  UserRoundPlus,
  UserRoundXIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ModeToggle from "@/components/site/mode-toggle";
import Logo from "@/components/logo";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { LoadingSpinner } from "@/components/site/loading-spinner";

type Props = {
  user?: boolean;
};

const navbarLinks = [
  {
    name: "Pricing",
    href: "#pricing",
  },
  {
    name: "About",
    href: "/community/about",
  },
  {
    name: "Community",
    href: "/community",
  },
  {
    name: "Contact",
    href: "/contact",
  },
] as const;

const SignOutButton = () => {
  const router = useRouter();
  const t = useTranslations();
  const [pending, setPending] = useState<boolean>(false);

  const handleSignOut = async () => {
    try {
      setPending(true);

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
      setPending(false);
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleSignOut}
      disabled={pending}
      className="rounded-full px-6 font-medium transition-all hover:scale-105 flex items-center gap-2"
    >
      {pending ? (
        <LoadingSpinner />
      ) : (
        <>
          <UserRoundXIcon className="h-4 w-4" />
          {t("SIGN_OUT")}
        </>
      )}
    </Button>
  );
};

const Navigation = ({ user }: Props) => {
  const pathName = usePathname();

  const t = useTranslations();

  return (
    <header className="sticky top-4 z-50">
      <div className="mx-auto max-w-7xl rounded-2xl border border-white/20 bg-white/30 px-4 backdrop-blur-md shadow-sm dark:border-white/10 dark:bg-neutral-900/30">
        {/* Mobile Layout */}
        <div className="flex h-16 items-center justify-between md:hidden">
          <Link href="/" prefetch={false}>
            <Logo className="text-blue-500" />
          </Link>

          <div className="flex items-center gap-2">
            <Sheet>
              <VisuallyHidden>
                <SheetTitle>Menu</SheetTitle>
              </VisuallyHidden>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MenuIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <Image
                  src="/assets/logo.png"
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
                      className={cn("text-base font-semibold", {
                        "text-blue-500": pathName === link.href,
                        "text-gray-600 dark:text-gray-200 hover:text-blue-400":
                          pathName !== link.href,
                      })}
                      prefetch={false}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <hr />
                  {user ? (
                    <>
                      <Link href="/dashboard">
                        <Button className="rounded-full px-6 font-medium transition-all hover:scale-105 w-full text-center">
                          <HouseIcon className="mr-2 h-4 w-4" />
                          {t("DASHBOARD")}
                        </Button>
                      </Link>
                      <SignOutButton />
                    </>
                  ) : (
                    <>
                      <Link href="/sign-in">
                        <Button
                          className="w-full md:w-auto rounded-full px-6 font-medium transition-all hover:scale-105
             flex items-center justify-center gap-2 bg-blue-600 text-white"
                        >
                          <User2Icon className="h-4 w-4" />
                          {t("SIGN_IN")}
                        </Button>
                      </Link>
                      <Link href="/sign-up">
                        <Button
                          variant="outline"
                          className="w-full md:w-auto rounded-full border border-transparent
             bg-gradient-to-r from-purple-500 to-indigo-500 text-white
             hover:from-purple-600 hover:to-indigo-600 hover:text-white
             transition-all hover:scale-105 font-medium flex items-center justify-center gap-2
             dark:from-purple-600 dark:to-indigo-600 dark:hover:from-purple-700 dark:hover:to-indigo-700"
                        >
                          <UserRoundPlus className="h-4 w-4" />
                          {t("SIGN_UP")}
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            <ModeToggle />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden h-16 md:flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" prefetch={false}>
            <Logo className="text-blue-500" />
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-6 text-sm font-semibold">
            {navbarLinks.map((link) => (
              <Link
                key={link.name}
                className={cn({
                  "text-blue-500": pathName === link.href,
                  "text-gray-600 dark:text-gray-200 hover:text-blue-400":
                    pathName !== link.href,
                })}
                href={link.href}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            <ModeToggle />
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button className="rounded-full px-6 font-medium transition-all hover:scale-105 bg-blue-600 text-white">
                    <HouseIcon className="mr-2 h-4 w-4" />
                    {t("DASHBOARD")}
                  </Button>
                </Link>
                <SignOutButton />
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button
                    className="w-full md:w-auto rounded-full px-6 font-medium transition-all hover:scale-105
             flex items-center justify-center gap-2 bg-blue-600 text-white"
                  >
                    <User2Icon className="h-4 w-4" />
                    {t("SIGN_IN")}
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    variant="outline"
                    className="w-full md:w-auto rounded-full border border-transparent
             bg-gradient-to-r from-purple-500 to-indigo-500 text-white
             hover:from-purple-600 hover:to-indigo-600 hover:text-white
             transition-all hover:scale-105 font-medium flex items-center justify-center gap-2
             dark:from-purple-600 dark:to-indigo-600 dark:hover:from-purple-700 dark:hover:to-indigo-700"
                  >
                    <UserRoundPlus className="h-4 w-4" />
                    {t("SIGN_UP")}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
