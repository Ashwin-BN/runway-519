"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import AddItemForm from "@/app/components/AddItemForm";
import Navbar from "@/app/components/Navbar";

export default function AddItemPage() {
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    setTimeout(() => setRole(localStorage.getItem("role")), 0);
  }, [router]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar currentPage="add-item" />

      {/* Main Content */}
      <main className="pt-20 px-6 sm:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-8">
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100 mb-8">Add New Item</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Enter the details below to add a new item to your inventory.
            </p>
            <AddItemForm />
          </div>
        </div>
      </main>
    </div>
  );
}