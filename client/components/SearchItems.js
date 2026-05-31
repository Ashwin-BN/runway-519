"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";

export default function SearchItems({ onItemClick }) {
  const [filters, setFilters] = useState({
    department: "",
    category: "",
    styleNumber: "",
    brand: "",
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const searchItems = async () => {
    if (!auth.currentUser) {
      alert("Please login first");
      return;
    }
    const token = await auth.currentUser.getIdToken();
    setLoading(true);
    const query = new URLSearchParams(filters).toString();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      } else {
        alert("Error fetching items");
      }
    } catch (err) {
      alert("Network error");
    }
    setLoading(false);
  };

  useEffect(() => {
    searchItems(); // Load all items initially
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Search Items</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={filters.department}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={filters.category}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="styleNumber"
          placeholder="Style Number"
          value={filters.styleNumber}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={filters.brand}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <button
          onClick={searchItems}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <button
            key={item._id}
            type="button"
            onClick={() => onItemClick?.(item)}
            className="text-left bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700 transition-transform transform hover:-translate-y-1"
            aria-label={`View item ${item.styleNumber || item.brand}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.brand} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {item.styleNumber || item.brand}
                  </h3>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">${item.price?.toFixed?.(2) || 'N/A'}</p>
                    {item.markdownPrice && <p className="text-sm text-red-600">Sale ${item.markdownPrice}</p>}
                  </div>
                </div>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{item.brand}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full ${item.status === 'sold' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {item.status}
                  </span>
                  <span className="text-xs text-slate-500">Dept {item.department}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}