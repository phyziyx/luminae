"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const date = new Date().getFullYear();
  const t = useTranslations();

  return (
    <footer className="w-full border-t border-white/10 bg-white/20 backdrop-blur-lg dark:bg-neutral-900/30 py-12 px-4 sm:px-8 text-sm text-gray-600 dark:text-gray-300">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
        {/* Logo & Tagline */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <Image
            src="/assets/bulb.png"
            height={40}
            width={40}
            alt="Luminae Icon"
            className="opacity-90"
          />
          <Image
            src="/assets/luminae_plain.png"
            height={96}
            width={96}
            alt="Luminae Logo"
            className="opacity-90"
          />
          <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
            Empowering agency owners to deliver better, faster.
          </p>
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col gap-2">
          <Link
            href="/community/about"
            className="hover:text-blue-500 transition"
          >
            About
          </Link>
          <Link href="#pricing" className="hover:text-blue-500 transition">
            Pricing
          </Link>
          <Link href="/community" className="hover:text-blue-500 transition">
            Community
          </Link>
          <Link href="/contact" className="hover:text-blue-500 transition">
            Contact Us
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-center md:text-right">
          <p className="text-gray-500 dark:text-gray-400">
            {t("COPYRIGHT", { YEAR: date.toString() })}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Made with ❤️ by agency owners, for agency owners.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
