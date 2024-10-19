"use client";

// import { ModeToggle } from "@/components/global/mode-toggle";
import { UserButton } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

type Props = {
  user?: null | User;
};

const ModeToggle = () => {
  const { theme, systemTheme, setTheme } = useTheme();

  const onChange = () => {
    console.log("onChange");
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  return (
    <button onClick={() => onChange()}>
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};

const Navigation = ({ user }: Props) => {
  return (
    <div className="fixed top-0 right-0 left-0 p-4 flex items-center justify-between z-10">
      <aside className="flex items-center gap-2">
        <Image
          src={"./assets/luminae_logo.svg"}
          width={40}
          height={40}
          alt="luminae logo"
          className="text-blue-500"
        />
        <span className="text-xl font-bold"> Luminae.</span>
      </aside>
      <nav className="hidden md:block absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%]">
        <ul className="flex items-center justify-center gap-8">
          <Link href={"#"}>Pricing</Link>
          <Link href={"#"}>Documentation</Link>
          <Link href={"/about"}>About</Link>
        </ul>
      </nav>
      <aside className="flex gap-2 items-center">
        <Link
          href={"/agency"}
          className="bg-primary text-white p-2 px-4 rounded-md hover:bg-primary/80"
        >
          Login
        </Link>
        <UserButton />
        <ModeToggle />
      </aside>
    </div>
  );
};

export default Navigation;
