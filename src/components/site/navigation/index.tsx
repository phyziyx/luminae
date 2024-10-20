"use client";

// import { UserButton } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import {
  HouseIcon,
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

type Props = {
  user?: null | User;
};

const ModeToggle = () => {
  const { theme, setTheme } = useTheme();

  const onChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button onClick={() => onChange()}>
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
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
    <nav className="dark:bg-black flex flex-row gap-2 lg:text-base md:text-sm sm:text-xs text-center items-center justify-evenly mb-32 lg:mb-24">
      <div className="flex flex-row gap-2 items-center">
        <Image
          src={"/assets/logo.png"}
          width={200}
          height={200}
          alt="luminae logo"
          className="text-blue-500"
        />
      </div>

      <ul className="flex flex-row gap-4">
        {navbarLinks.map((link) => (
          <li key={link.name}>
            <Link
              className={cn({
                "font-bold text-blue-500 hover:text-blue-500":
                  pathName === link.href,
                "hover:text-blue-300": pathName !== link.href,
              })}
              href={link.href}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex flex-row items-center gap-2">
        <ModeToggle />
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
    </nav>
  );
};

export default Navigation;
