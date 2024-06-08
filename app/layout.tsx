import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import HeaderOwnComponent from "@/components/own/header/header";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <HeaderOwnComponent />
        <div className="max-w-[80%] mx-auto">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
