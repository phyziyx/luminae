import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/providers/theme-provider";
import { Suspense } from "react";
import { ModalProvider } from "@/providers/modal-provider";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Luminae",
  description: "Your one-stop agency management platform",
  creator: "Luminae",
  openGraph: {
    type: "website",
    url: "https://luminae-one.vercel.app/",
    title: "Luminae",
    description: "Your one-stop agency management platform",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html className="antialiased" lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <Suspense fallback={<div>Loading...</div>}>
              <ClerkProvider>
                <ModalProvider>
                  {children}
                  <Toaster />
                  {/* <SonnarToaster position="bottom-left" /> */}
                </ModalProvider>
              </ClerkProvider>
            </Suspense>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
