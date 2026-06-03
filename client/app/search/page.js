"use client";



import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchItems from "@/app/components/SearchItems";
import Navbar from "@/app/components/Navbar";
import ItemModal from "@/app/components/ItemModal";


export default function SearchPage() {
  const [role, setRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const router = useRouter();

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleMarkAsSold = async (itemId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/items/${itemId}/sold`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setShowModal(false);
        alert("Item marked as sold!");
      } else {
        alert("Error marking item as sold");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const handleSetMarkdownPrice = async (itemId, price) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/items/${itemId}/markdown`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ price }),
        }
      );

      if (res.ok) {
        setShowModal(false);
        alert("Markdown price updated!");
      } else {
        alert("Error updating markdown price");
      }
    } catch (err) {
      alert("Network error");
    }
  };


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

        <SearchItems onItemClick={handleItemClick} />

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