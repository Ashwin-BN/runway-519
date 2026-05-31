"use client";



import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchItems from "@/app/components/SearchItems";
import Navbar from "@/app/components/Navbar";
import ItemModal from "@/app/components/ItemModal";


export default function SearchPage() {
  const [role, setRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();



  useEffect(() => {

    const token = localStorage.getItem("token");

    const storedRole = localStorage.getItem("role");



    if (!token) {

      router.push("/login");

      return;

    }



    setTimeout(() => setRole(storedRole), 0);

  }, [router]);



  return (

    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">

      <Navbar currentPage="search" />



      {/* Main Content */}

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

        <SearchItems />

      </main>


      <ItemModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        item={selectedItem}
        onMarkAsSold={handleMarkAsSold}
        onSetMarkdownPrice={handleSetMarkdownPrice}
        userRole={role}
      />
    </div>

  );

}