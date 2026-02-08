import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// This layout is just a wrapper for children.
// The actual html/body tags are in [locale]/layout.tsx and install/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}
