"use client";

import { useState } from "react";

export default function SearchItems({
  onSearchComplete,
  onItemClick,
}) {
  const [filters, setFilters] = useState({
    department: "",
    category: "",
    styleNumber: "",
    brand: "",
    priceMin: "",
    priceMax: "",
    markdown: false,
  });


  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Prevent non-numeric input for price fields
    if ((name === "priceMin" || name === "priceMax") && type !== "checkbox") {
      const numericValue = value.replace(/[^0-9.]/g, '');
      setFilters((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const searchItems = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please log in to search items");
        return;
      }

      const queryParams = new URLSearchParams();
      const currentFilters = { ...filters }; // Create stable copy

      Object.entries(currentFilters).forEach(([key, val]) => {
        if (val) {
          queryParams.append(key, val);
        }
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/items?${queryParams.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();

        setItems(data);
        onSearchComplete?.(data);
      } else {
        alert("Error searching items");
      }
    } catch (err) {
      console.error("Search error:", err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-12">
          <div className="max-w-4xl">
            <h1 className="text-5xl sm:text-6xl font-semibold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
              Search Items
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
              Find items by department, category, brand, style
              number, or price range.
            </p>
          </div>
        </div>

        <div className="mb-12">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-8">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
                Search Filters
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-base font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Department
                  </label>


                  <input
                    type="text"
                    name="department"
                    placeholder="e.g. 01"
                    value={filters.department}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-slate-100 text-base transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    placeholder="e.g. 1234"
                    value={filters.category}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-slate-100 text-base transition-all duration-200"
                  />
                </div>


                <div>
                  <label className="block text-base font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Style Number
                  </label>


                  <input
                    type="text"
                    name="styleNumber"
                    placeholder="e.g. 123456"
                    value={filters.styleNumber}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-slate-100 text-base transition-all duration-200"
                  />
                </div>


                <div>
                  <label className="block text-base font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Brand
                  </label>


                  <input
                    type="text"
                    name="brand"
                    placeholder="Brand name"
                    value={filters.brand}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-slate-100 text-base transition-all duration-200"
                  />
                </div>


                <div>
                  <label className="block text-base font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Min Price
                  </label>


                  <input
                    type="number"
                    min="0"
                    name="priceMin"
                    placeholder="0.00"
                    value={filters.priceMin}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-slate-100 text-base transition-all duration-200"
                  />
                </div>


                <div>
                  <label className="block text-base font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Max Price
                  </label>


                  <input
                    type="number"
                    name="priceMax"
                    placeholder="0.00"
                    value={filters.priceMax}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-slate-100 text-base transition-all duration-200"
                  />
                </div>


                <div className="flex items-end">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="markdown"
                      checked={filters.markdown}
                      onChange={handleChange}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 rounded"
                    />

                    <span className="ml-3 text-base font-medium text-slate-700 dark:text-slate-300">
                      Markdown only
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end p-8">
              <button
                onClick={searchItems}
                disabled={loading}
                className="inline-flex items-center px-8 py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-2xl shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Search items with current filters"
                role="button"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>

                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>


                    Searching...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>


                    Search Items
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                      Search Results
                    </h2>

                    <p className="text-base text-slate-600 dark:text-slate-400 mt-1">
                      {items.length} item
                      {items.length !== 1 ? "s" : ""} found
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>

                    <span className="text-sm text-slate-500">
                      Live
                    </span>
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
                ) : items.length === 0 ? (
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => onItemClick?.(item)}
                        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center space-x-6">
                          {item.imageUrl ? (
                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-700">
                              <img
                                src={item.imageUrl}
                                alt={item.styleNumber || "Item"}
                                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                              />
                            </div>
                          ) : (
                            <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                              <svg
                                className="w-12 h-12 text-slate-400"
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
                            </div>
                          )}

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                                {item.styleNumber || "N/A"}
                              </h4>

                              <div className="flex items-center gap-2">
                                {item.status === "sold" && (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                                    Sold
                                  </span>
                                )}

                                {item.markdownPrice && (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                                    Sale
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <p className="text-base text-slate-600 dark:text-slate-400">
                                {item.department &&
                                  `Department: ${item.department}`}
                              </p>

                              <p className="text-base text-slate-600 dark:text-slate-400">
                                {item.brand &&
                                  `Brand: ${item.brand}`}
                              </p>

                              <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                                {item.price
                                  ? `$${item.price.toFixed(2)}`
                                  : "N/A"}
                              </p>
                            </div>
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
      </div>
    </div>
  );
}