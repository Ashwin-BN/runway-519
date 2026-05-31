"use client";

import { useEffect, useState } from "react";

export default function ItemModal({
  isOpen,
  onClose,
  item,
  onMarkAsSold,
  onSetMarkdownPrice,
  userRole,
}) {
  const [markdownPrice, setMarkdownPrice] = useState("");

  useEffect(() => {
    if (item) {
      setMarkdownPrice(item.markdownPrice ?? "");
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const itemCount = item.count ?? item.quantity ?? 1;

  const handleMarkdownSubmit = () => {
    const parsed = parseFloat(markdownPrice);
    if (!Number.isNaN(parsed) && parsed > 0) {
      onSetMarkdownPrice(item._id, parsed);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/95 shadow-[0_30px_80px_rgba(15,23,42,0.18)] dark:border-slate-700/70 dark:bg-slate-950/95">
          <div className="flex flex-col overflow-hidden rounded-[2rem] bg-white dark:bg-slate-950">
            <div className="flex flex-col gap-4 border-b border-slate-200/70 bg-slate-50 px-6 py-5 dark:border-slate-700/70 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-3xl bg-blue-600 text-white shadow-blue-500/10">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                    Inventory details
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {item.brand || "Untitled item"}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    SKU: {item.styleNumber || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                  item.status === "sold"
                    ? "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200"
                    : "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200"
                }`}>
                  {item.status === "sold" ? "Sold" : "Available"}
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  aria-label="Close details"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-6 py-6 sm:px-8 sm:py-8">
              <div className="grid gap-8 lg:grid-cols-[1.25fr_0.85fr]">
                <section className="space-y-6">
                  <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-slate-100 dark:border-slate-700/70 dark:bg-slate-900">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.brand || "Item image"}
                        className="h-72 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-72 items-center justify-center text-slate-500 dark:text-slate-400">
                        No image available
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-700/70 dark:bg-slate-900">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                        Brand
                      </p>
                      <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {item.brand}
                      </p>
                    </div>
                    <div className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-700/70 dark:bg-slate-900">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                        Style number
                      </p>
                      <p className="mt-3 text-lg font-mono text-slate-900 dark:text-slate-100">
                        {item.styleNumber}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="rounded-[1.75rem] border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-700/70 dark:bg-slate-900">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                      Pricing
                    </p>
                    <div className="mt-4 flex flex-col gap-3 text-slate-900 dark:text-slate-100">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Original</p>
                          <p className="mt-2 text-2xl font-semibold">${item.price}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Markdown</p>
                          <p className="mt-2 text-2xl font-semibold text-rose-600 dark:text-rose-400">
                            {item.markdownPrice ? `$${item.markdownPrice}` : "—"}
                          </p>
                        </div>
                      </div>
                      {item.markdownPrice && (
                        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:bg-rose-900/20 dark:text-rose-200">
                          Sale price is active for this item.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-700/70 dark:bg-slate-900">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                      Details
                    </p>
                    <dl className="mt-4 grid gap-4 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                      <div>
                        <dt className="font-medium text-slate-900 dark:text-slate-100">Department</dt>
                        <dd className="mt-1">{item.department}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-900 dark:text-slate-100">Category</dt>
                        <dd className="mt-1">{item.category}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-900 dark:text-slate-100">Status</dt>
                        <dd className="mt-1 capitalize">{item.status}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-900 dark:text-slate-100">Count</dt>
                        <dd className="mt-1">{itemCount}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-900 dark:text-slate-100">Created</dt>
                        <dd className="mt-1">{new Date(item.createdAt).toLocaleString()}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="font-medium text-slate-900 dark:text-slate-100">Images</dt>
                        <dd className="mt-1">{item.imageUrls?.length ? `${item.imageUrls.length} image${item.imageUrls.length === 1 ? "" : "s"} available` : "Single image"}</dd>
                      </div>
                    </dl>
                  </div>
                </section>
              </div>
            </div>

            <div className="border-t border-slate-200/70 bg-slate-50 px-6 py-5 dark:border-slate-700/70 dark:bg-slate-950 sm:px-8">
              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                {(userRole === "admin" || userRole === "management") && item.status !== "sold" ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="number"
                      placeholder="New markdown price"
                      value={markdownPrice}
                      onChange={(e) => setMarkdownPrice(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100"
                      min="0"
                      step="0.01"
                      aria-label="Markdown price"
                    />
                    <button
                      type="button"
                      onClick={handleMarkdownSubmit}
                      className="inline-flex min-h-[3rem] items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      Set markdown price
                    </button>
                  </div>
                ) : (
                  <div />
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Close
                  </button>
                  {item.status !== "sold" && (
                    <button
                      type="button"
                      onClick={() => onMarkAsSold(item._id)}
                      className="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/10 transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                    >
                      Mark as sold
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
