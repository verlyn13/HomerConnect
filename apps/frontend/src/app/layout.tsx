
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import UserNav from "@/components/UserNav";
import CleanCz from "@/components/CleanCz";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: false, // Prevent preload warnings for unused fonts
});

export const metadata: Metadata = {
  title: "HomerConnect",
  description: "Community Calendar for Homer, Alaska",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <CleanCz />
        <UserNav />
        {children}
      </body>
    </html>
  );
}
