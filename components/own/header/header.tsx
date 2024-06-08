"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const HeaderOwnComponent = () => {
  const pathname = usePathname();
  return (
    <header className="flex items-center justify-between mb-6 mx-auto px-4 md:px-6 py-8">
      <nav className="flex gap-4 text-sm font-medium">
        <Link
          href="/dashboard"
          className={` dark:text-gray-400 dark:hover:text-gray-50 ${
            pathname === "/dashboard"
              ? "font-bold text-gray-900"
              : "text-gray-500 hover:text-gray-900"
          }`}
          prefetch={false}
        >
          Dashboard
        </Link>
        <Link
          href="/services"
          className={` dark:text-gray-400 dark:hover:text-gray-50 ${
            pathname === "/services"
              ? "font-bold text-gray-900"
              : "text-gray-500 hover:text-gray-900"
          }`}
          prefetch={false}
        >
          Services
        </Link>
        <Link
          href="/transactions"
          className={` dark:text-gray-400 dark:hover:text-gray-50 ${
            pathname === "/transaction"
              ? "font-bold text-gray-900"
              : "text-gray-500 hover:text-gray-900"
          }`}
          prefetch={false}
        >
          Transactions
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="rounded-full">
          {/* <img
            src="/placeholder.svg"
            width="32"
            height="32"
            className="rounded-full"
            alt="Avatar"
          /> */}
          <span className="sr-only">User menu</span>
        </Button>
      </div>
    </header>
  );
};

export default HeaderOwnComponent;
