import { authClient } from "@/lib/auth/client";
import { NeonAuthUIProvider, UserButton } from "@neondatabase/auth/react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EDC",
  description: "Predict your lineup",
};

export const myFont = localFont({
  src: [
    {
      path: "../public/fonts/Posterama1919W04-Bold.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--edc-font",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={myFont.variable} suppressHydrationWarning>
      <NeonAuthUIProvider
        authClient={authClient}
        social={{
          providers: ["google"],
        }}
      >
        <header className="flex justify-between items-center p-4 gap-4 h-16">
          <Link href="/" className="hover:bg-gray-300 rounded-sm px-4 py-2">
            Home
          </Link>
          <UserButton size="icon" />
        </header>
        <body className={myFont.className}>{children}</body>
      </NeonAuthUIProvider>
    </html>
  );
}
