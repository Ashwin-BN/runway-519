"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";

export default function SearchItems() {
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
      const res = await fetch(`http://localhost:5000/items?${query}`, {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item._id} className="border p-4 rounded">
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.brand} width={100} className="mb-2" />
            )}
            <p><strong>Brand:</strong> {item.brand}</p>
            <p><strong>Price:</strong> ${item.price}</p>
            <p><strong>Department:</strong> {item.department}</p>
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Style:</strong> {item.styleNumber}</p>
            <p><strong>Barcode:</strong> {item.barcode}</p>
            <p><strong>Status:</strong> {item.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}</content>
<parameter name="filePath">c:\CPP\Job\runway-519\client\components\SearchItems.js