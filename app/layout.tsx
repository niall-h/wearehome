import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
    <html lang="en" className={myFont.variable}>
      <body className={myFont.className}>{children}</body>
    </html>
  );
}
