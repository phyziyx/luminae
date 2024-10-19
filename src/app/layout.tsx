import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "next-themes";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Luminae",
  description: "Agency",
};

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <ClerkProvider appearance={{ baseTheme: dark }}>
//       <ThemeProvider
//         attribute="class"
//         defaultTheme="system"
//         enableSystem
//         disableTransitionOnChange
//       >
//         <html lang="en" suppressHydrationWarning>
//           <body
//             className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//           >
//             <main>{children}</main>
//           </body>
//         </html>
//       </ThemeProvider>
//     </ClerkProvider>
//   );
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider appearance={{ baseTheme: dark }}>
            {/* <ModalProvider> */}
            {children}
            {/* <Toaster /> */}
            {/* <SonnarToaster position="bottom-left" /> */}
            {/* </ModalProvider> */}
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
