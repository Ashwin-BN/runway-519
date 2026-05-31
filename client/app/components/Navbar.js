"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Navbar({ currentPage = "home" }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const role = (() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("role");
    }
    return null;
  })();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
    router.push("/login");
  };

  const navigation = [
    { name: "Add Item", href: "/add-item", current: currentPage === "add-item" },
    { name: "Search", href: "/search", current: currentPage === "search" },
  ];

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5v10l10 10v10l-10 10-10V7L12 2z"/>
                  <path d="M12 2l10 5v10l10 10v10l-10 10-10V7L12 2z" opacity="0.3"/>
                  <path d="M13 7h8v10h-8V7H13z"/>
                  <path d="M3 13h18v6H3V13z"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg">Runway 519</span>
                <span className="text-blue-100 text-xs">Inventory Management</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.current
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 hover:text-slate-100"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-600 dark:text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3-1.34 3-3s-1.34-3-3-3 3 1.34-3 3 3 3-1.34 3-3z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {role || 'User'}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    item.current
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-300 hover:text-slate-100"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
