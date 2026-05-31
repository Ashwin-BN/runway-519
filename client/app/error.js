"use client";

import React from "react";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <div className="max-w-md w-full p-6 bg-white dark:bg-slate-800 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{error?.message || "An unexpected error occurred."}</p>
          <div className="flex gap-3">
            <button
              onClick={() => reset()}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Try again
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="px-4 py-2 bg-gray-200 dark:bg-slate-700 rounded"
            >
              Home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
