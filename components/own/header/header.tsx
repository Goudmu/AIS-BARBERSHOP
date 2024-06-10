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
          href="/expenses"
          className={` dark:text-gray-400 dark:hover:text-gray-50 ${
            pathname === "/expenses"
              ? "font-bold text-gray-900"
              : "text-gray-500 hover:text-gray-900"
          }`}
          prefetch={false}
        >
          Expenses
        </Link>
        <Link
          href="/jurnalumum"
          className={` dark:text-gray-400 dark:hover:text-gray-50 ${
            pathname === "/jurnalumum"
              ? "font-bold text-gray-900"
              : "text-gray-500 hover:text-gray-900"
          }`}
          prefetch={false}
        >
          Jurnal Umum
        </Link>
        <Link
          href="/jurnalpenyesuaian"
          className={` dark:text-gray-400 dark:hover:text-gray-50 ${
            pathname === "/jurnalpenyesuaian"
              ? "font-bold text-gray-900"
              : "text-gray-500 hover:text-gray-900"
          }`}
          prefetch={false}
        >
          Jurnal Penyesuaian
        </Link>
        <Link
          href="/jurnalpenutup"
          className={` dark:text-gray-400 dark:hover:text-gray-50 ${
            pathname === "/jurnalpenutup"
              ? "font-bold text-gray-900"
              : "text-gray-500 hover:text-gray-900"
          }`}
          prefetch={false}
        >
          Jurnal Penutup
        </Link>
        <Link
          href="/accounts"
          className={` dark:text-gray-400 dark:hover:text-gray-50 ${
            pathname === "/accounts"
              ? "font-bold text-gray-900"
              : "text-gray-500 hover:text-gray-900"
          }`}
          prefetch={false}
        >
          Akun Akuntansi
        </Link>
        <Link
          href="/worksheet"
          className={` dark:text-gray-400 dark:hover:text-gray-50 ${
            pathname === "/worksheet"
              ? "font-bold text-gray-900"
              : "text-gray-500 hover:text-gray-900"
          }`}
          prefetch={false}
        >
          Worksheet
        </Link>
        <Link
          href="/reports"
          className={` dark:text-gray-400 dark:hover:text-gray-50 ${
            pathname === "/reports"
              ? "font-bold text-gray-900"
              : "text-gray-500 hover:text-gray-900"
          }`}
          prefetch={false}
        >
          Reports
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
