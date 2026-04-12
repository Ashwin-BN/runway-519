"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";

export default function AddItemForm() {
  const [formData, setFormData] = useState({
    brand: "",
    price: "",
    department: "",
    category: "",
    styleNumber: "",
    barcode: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("Please login first");
      return;
    }
    const token = await auth.currentUser.getIdToken();
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    if (image) data.append("image", image);

    try {
      const res = await fetch("http://localhost:5000/items", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
      if (res.ok) {
        alert("Item added successfully!");
        setFormData({
          brand: "",
          price: "",
          department: "",
          category: "",
          styleNumber: "",
          barcode: "",
        });
        setImage(null);
      } else {
        const error = await res.json();
        alert("Error: " + error.error);
      }
    } catch (err) {
      alert("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add New Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="department"
          placeholder="Department (2 digits)"
          value={formData.department}
          onChange={handleChange}
          required
          maxLength="2"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="category"
          placeholder="Category (4 digits)"
          value={formData.category}
          onChange={handleChange}
          required
          maxLength="4"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="styleNumber"
          placeholder="Style Number (6 digits)"
          value={formData.styleNumber}
          onChange={handleChange}
          required
          maxLength="6"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="barcode"
          placeholder="Barcode"
          value={formData.barcode}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Item"}
        </button>
      </form>
    </div>
  );
}</content>
<parameter name="filePath">c:\CPP\Job\runway-519\client\components\AddItemForm.js