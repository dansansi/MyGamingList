import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Globals/Header";
import CookieBanner from "@/components/Globals/CookieBanner";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyGamingList",
  description: "Create and track all your games status from any platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geist.variable} antialiased bg-zinc-900 text-white flex flex-col h-full`}>
        <Header />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
