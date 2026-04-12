"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function HomePage() {
  const [recentItems, setRecentItems] = useState([]);
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
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (!token) {
      router.push("/login");
      return;
    }
    setRole(storedRole);

    const fetchRecent = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/items?limit=10", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setRecentItems(data);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
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
    setMarkdownPrice(item.markdownPrice || "");
    setShowModal(true);
  };

  const handleMarkAsSold = async () => {
    if (!selectedItem) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/items/${selectedItem._id}/sold`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Update the item in the list
        setRecentItems(recentItems.map(item =>
          item._id === selectedItem._id
            ? { ...item, status: "sold" }
            : item
        ));
        setShowModal(false);
        alert("Item marked as sold!");
      } else {
        alert("Error marking item as sold");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const handleMarkdown = async () => {
    if (!selectedItem || !markdownPrice) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/items/${selectedItem._id}/markdown`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price: Number(markdownPrice) }),
      });

      if (res.ok) {
        // Update the item in the list
        setRecentItems(recentItems.map(item =>
          item._id === selectedItem._id
            ? { ...item, markdownPrice: Number(markdownPrice) }
            : item
        ));
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                Runway Inventory
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {role === "admin" && (
                <button
                  onClick={() => router.push("/admin")}
                  className="inline-flex items-center px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  Manage Users
                </button>
              )}
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push("/add-item")}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200 btn-hover"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Item
            </button>

            <button
              onClick={() => router.push("/search")}
              className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-base font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200 btn-hover"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Items
            </button>
          </div>
        </div>

        {/* Recent Items */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Recently Added Items
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Click on any item to view details and manage status
            </p>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {loading ? (
              <div className="px-6 py-12 text-center">
                <div className="animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                  <span className="ml-3 text-slate-600 dark:text-slate-400">Loading items...</span>
                </div>
              </div>
            ) : recentItems.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-5v2m0 0v2m0-2h2m-2 0h-2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">No items found</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Get started by adding your first item.</p>
              </div>
            ) : (
              recentItems.map((item) => (
                <div
                  key={item._id}
                  className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors duration-150 card-hover"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex items-center gap-4">
                    {item.imageUrl ? (
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                        <img
                          src={item.imageUrl}
                          alt={item.brand}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {item.brand}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          item.status === "sold"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                            : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <span>Dept: {item.department}</span>
                        <span>Style: {item.styleNumber}</span>
                        <div className="flex items-center gap-1">
                          <span className={item.markdownPrice ? "line-through text-slate-400" : "font-medium text-slate-900 dark:text-slate-100"}>
                            ${item.price}
                          </span>
                          {item.markdownPrice && (
                            <span className="font-medium text-red-600 dark:text-red-400">
                              ${item.markdownPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Item Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto modal-backdrop">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-slate-900 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                    Item Details
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-150"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {selectedItem.imageUrl && (
                  <div className="mb-6">
                    <img
                      src={selectedItem.imageUrl}
                      alt={selectedItem.brand}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Brand
                      </label>
                      <p className="mt-1 text-sm text-slate-900 dark:text-slate-100 font-medium">
                        {selectedItem.brand}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Department
                      </label>
                      <p className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                        {selectedItem.department}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Category
                      </label>
                      <p className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                        {selectedItem.category}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Style Number
                      </label>
                      <p className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                        {selectedItem.styleNumber}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Price
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      {selectedItem.markdownPrice ? (
                        <>
                          <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                            ${selectedItem.markdownPrice}
                          </span>
                          <span className="text-sm text-slate-500 dark:text-slate-400 line-through">
                            ${selectedItem.price}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                            On Sale
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          ${selectedItem.price}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Status
                    </label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                      selectedItem.status === "sold"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    }`}>
                      {selectedItem.status === "sold" ? "Sold" : "Available"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {selectedItem.status !== "sold" && (
                    <button
                      onClick={handleMarkAsSold}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 flex-1"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Mark as Sold
                    </button>
                  )}

                  {(role === "admin" || role === "management") && selectedItem.status !== "sold" && (
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Markdown Price
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="0.00"
                          value={markdownPrice}
                          onChange={(e) => setMarkdownPrice(e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-slate-100"
                          min="0"
                          step="0.01"
                        />
                        <button
                          onClick={handleMarkdown}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          Set Price
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
