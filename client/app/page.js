"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

import { auth } from "@/lib/firebase";
import Navbar from "@/app/components/Navbar";
import ItemModal from "@/app/components/ItemModal";

export default function HomePage() {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [markdownPrice, setMarkdownPrice] = useState("");

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchRecent = async () => {
      const token = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role");

      if (!token) {
        router.push("/login");
        return;
      }

      if (auth.currentUser) {
        try {
          const freshToken = await auth.currentUser.getIdToken(true);

          localStorage.setItem("token", freshToken);
          setRole(storedRole);

          setLoading(true);

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items`, {
            headers: {
              Authorization: `Bearer ${freshToken}`,
            },
          });

          if (res.ok) {
            const data = await res.json();
            setAllItems(data);
          } else {
            router.push("/login");
          }
        } catch (err) {
          console.error("Authentication error:", err);
          router.push("/login");
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
        setLoading(false);
      }
    };

    fetchRecent();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    router.push("/login");
  };

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
        setAllItems(
          allItems.map((item) =>
            item._id === itemId
              ? { ...item, status: "sold" }
              : item
          )
        );

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
        setAllItems(
          allItems.map((item) =>
            item._id === itemId
              ? { ...item, markdownPrice: price }
              : item
          )
        );

        setShowModal(false);
        alert("Markdown price updated!");
      } else {
        alert("Error updating markdown price");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar currentPage="home" />

      <main className="pt-20 px-6 sm:px-8 lg:px-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="max-w-4xl">
            <h1 className="text-5xl sm:text-6xl font-semibold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
              Welcome back,{" "}
              {role === "admin"
                ? "Admin"
                : role === "management"
                ? "Manager"
                : "User"}
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
              Here's what's happening with your inventory today.
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Items */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-500">
                      Total Items
                    </p>

                    <p className="text-4xl font-semibold text-slate-900 dark:text-slate-100">
                      {allItems.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Available */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-500">
                      Available
                    </p>

                    <p className="text-4xl font-semibold text-slate-900 dark:text-slate-100">
                      {
                        allItems.filter(
                          (item) => item.status === "available"
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Sold */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-500">
                      Sold
                    </p>

                    <p className="text-4xl font-semibold text-slate-900 dark:text-slate-100">
                      {
                        allItems.filter((item) => item.status === "sold")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* On Sale */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-500">
                      On Sale
                    </p>

                    <p className="text-4xl font-semibold text-slate-900 dark:text-slate-100">
                      {
                        allItems.filter((item) => item.markdownPrice).length
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-8">
              Quick Actions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => router.push("/search")}
                className="group bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700 transition-all duration-200 text-left"
                aria-label="Search items"
              >
                <div className="flex items-center space-x-6 mb-4">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <svg
                      className="w-8 h-8 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      Search Items
                    </h3>

                    <p className="text-base text-slate-600 dark:text-slate-400">
                      Find specific items quickly
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push("/add-item")}
                className="group bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700 transition-all duration-200 text-left"
                aria-label="Add new item"
              >
                <div className="flex items-center space-x-6 mb-4">
                  <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <svg
                      className="w-8 h-8 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      Add New Item
                    </h3>

                    <p className="text-base text-slate-600 dark:text-slate-400">
                      Add inventory to your store
                    </p>
                  </div>
                </div>
              </button>

              {(role === "admin" || role === "management") && (
                <button
                  onClick={() => router.push("/admin")}
                  className="group bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700 transition-all duration-200 text-left"
                  aria-label="Manage users"
                >
                  <div className="flex items-center space-x-6 mb-4">
                    <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                      <svg
                        className="w-8 h-8 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">
                        Manage Users
                      </h3>

                      <p className="text-base text-slate-600 dark:text-slate-400">
                        Admin & management
                      </p>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Recent Items */}
        <div className="mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                      Recent Items
                    </h2>

                    <p className="text-base text-slate-600 dark:text-slate-400 mt-1">
                      Latest additions to your inventory
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>

                    <span className="text-sm text-slate-500">Live</span>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {loading ? (
                  <div className="py-16 text-center">
                    <div className="animate-pulse flex items-center justify-center">
                      <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-full"></div>

                      <span className="ml-4 text-base text-slate-600 dark:text-slate-400">
                        Loading items...
                      </span>
                    </div>
                  </div>
                ) : allItems.length === 0 ? (
                  <div className="py-16 text-center">
                    <svg
                      className="mx-auto h-16 w-16 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-5v2m0 0v2m0-2h2m-2 0h-2"
                      />
                    </svg>

                    <h3 className="mt-4 text-xl font-medium text-slate-900 dark:text-slate-100">
                      No items found
                    </h3>

                    <p className="mt-2 text-base text-slate-500">
                      Get started by adding your first item.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allItems
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt || 0) -
                          new Date(a.createdAt || 0)
                      )
                      .slice(0, 10)
                      .map((item) => (
                        <div
                          key={item._id}
                          className="group flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-200 cursor-pointer"
                          onClick={() => handleItemClick(item)}
                        >
                          <div className="flex items-center space-x-6">
                            {item.imageUrl ? (
                              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-700">
                                <img
                                  src={item.imageUrl}
                                  alt={item.styleNumber || "Item"}
                                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                />
                              </div>
                            ) : null}

                            <div className="space-y-1">
                              <span className="sm:hidden text-slate-500 dark:text-slate-400 font-medium">
                                {item.department} • {item.styleNumber}
                              </span>

                              <div className="flex items-center gap-1.5">
                                {item.markdownPrice ? (
                                  <>
                                    <span className="text-lg font-bold text-red-600 dark:text-red-400">
                                      ${item.markdownPrice}
                                    </span>

                                    <span className="text-xs text-slate-400 line-through">
                                      ${item.price}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                    ${item.price}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                              <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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