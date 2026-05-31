import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
      <div className="text-center">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-600" />
        <p className="mt-3 text-slate-600 dark:text-slate-300">Loading…</p>
      </div>
    </div>
  );
}
