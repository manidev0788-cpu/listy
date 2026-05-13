"use client";

import { useMemo, useState } from "react";
import { HydrationSafeLink as Link } from "@/components/HydrationSafeLink";
import { useRouter } from "next/navigation";
import { ListingThumbImage } from "@/components/ListingThumbImage";
import { Spinner } from "@/components/Spinner";
import { formatListingDate } from "@/lib/formatListingDate";
import { readJsonResponse } from "@/lib/readJsonResponse";

export function AdminListingsTable({ initialListings = [] }) {
  const router = useRouter();
  const [listings, setListings] = useState(initialListings);
  const [query, setQuery] = useState("");
  const [pendingId, setPendingId] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return listings;
    return listings.filter((l) => {
      return (
        (l.name || "").toLowerCase().includes(q) ||
        (l.category || "").toLowerCase().includes(q) ||
        (l.city || "").toLowerCase().includes(q) ||
        (l.country || "").toLowerCase().includes(q) ||
        (l.userId || "").toLowerCase().includes(q)
      );
    });
  }, [query, listings]);

  const handleDelete = async (listing) => {
    if (!listing?._id) return;
    setError("");
    setPendingId(listing._id);
    try {
      const res = await fetch(
        `/api/listings/${encodeURIComponent(listing._id)}`,
        { method: "DELETE" }
      );
      const data = await readJsonResponse(res);
      if (!res.ok || !data?.ok) {
        setError(
          (typeof data?.message === "string" && data.message) ||
            (typeof data?.error === "string" && data.error) ||
            `Could not delete (status ${res.status}).`
        );
        return;
      }
      setListings((prev) => prev.filter((l) => l._id !== listing._id));
      setConfirmTarget(null);
      router.refresh();
    } catch (err) {
      console.error("[admin] delete error:", err);
      setError("Network error — please try again.");
    } finally {
      setPendingId(null);
    }
  };

  return (
    <section className="mt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 sm:text-xl">
            All Listings
          </h2>
          <p className="text-sm text-zinc-500">
            {filtered.length}{" "}
            {filtered.length === 1 ? "listing" : "listings"}
            {query && ` matching "${query}"`}
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
            <SearchIcon />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, city, email…"
            className="h-11 min-h-11 w-full rounded-lg border border-zinc-200 bg-white pl-10 pr-4 text-base text-zinc-900 shadow-sm outline-none transition-all duration-200 placeholder:text-zinc-400 focus:border-[#2ed2c3] focus:ring-2 focus:ring-[#2ed2c3]/30 md:text-sm"
          />
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          {error}
        </div>
      )}

      <div className="mt-5 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-100 text-left text-sm">
            <thead className="bg-zinc-50/80 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <tr>
                <th scope="col" className="px-6 py-4">
                  Business Name
                </th>
                <th scope="col" className="px-6 py-4">
                  Category
                </th>
                <th scope="col" className="px-6 py-4">
                  City
                </th>
                <th scope="col" className="px-6 py-4">
                  User
                </th>
                <th scope="col" className="px-6 py-4">
                  Created
                </th>
                <th scope="col" className="px-6 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16">
                    <EmptyState
                      filtered={query.length > 0}
                      onClearQuery={() => setQuery("")}
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((listing) => {
                  const isBusy = pendingId === listing._id;
                  return (
                    <tr
                      key={listing._id}
                      className="group border-b border-zinc-100 transition-colors duration-200 hover:bg-zinc-50/80 last:border-b-0"
                    >
                      <td className="px-6 py-4 align-top">
                        <div className="flex items-start gap-3">
                          <ListingThumbImage
                            src={listing.image}
                            name={listing.name}
                            className="h-10 w-10 shrink-0 rounded-md object-cover ring-1 ring-zinc-200"
                          />
                          <div className="min-w-0">
                            {listing.slug ? (
                              <Link
                                href={`/listing/${encodeURIComponent(
                                  listing.slug
                                )}`}
                                className="font-bold text-zinc-900 transition-colors hover:text-[#1fa99c]"
                              >
                                {listing.name || "Untitled"}
                              </Link>
                            ) : (
                              <span className="font-bold text-zinc-900">
                                {listing.name || "Untitled"}
                              </span>
                            )}
                            {listing.source === "local" && (
                              <span className="ml-2 inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200">
                                Local
                              </span>
                            )}
                            {listing.phone && (
                              <p className="mt-0.5 truncate text-xs text-zinc-500">
                                {listing.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 align-top">
                        <span className="font-semibold text-[#2ed2c3]">
                          {listing.category || "—"}
                        </span>
                      </td>

                      <td className="px-6 py-4 align-top text-zinc-700">
                        <div className="flex flex-col">
                          <span>{listing.city || "—"}</span>
                          {listing.country && (
                            <span className="text-xs text-zinc-400">
                              {listing.country}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 align-top">
                        {listing.userId ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                            <MailIcon />
                            <span className="max-w-[200px] truncate">
                              {listing.userId}
                            </span>
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-400">—</span>
                        )}
                      </td>

                      <td className="px-6 py-4 align-top text-xs text-zinc-500">
                        {formatListingDate(listing.createdAt)}
                      </td>

                      <td className="px-6 py-4 align-top">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/edit-listing/${encodeURIComponent(
                              listing._id
                            )}`}
                            className="inline-flex h-9 items-center justify-center rounded-md border border-[#2ed2c3] px-4 text-xs font-semibold text-[#2ed2c3] transition-colors hover:bg-[#2ed2c3]/10"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => setConfirmTarget(listing)}
                            disabled={isBusy}
                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-red-500 px-4 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isBusy && (
                              <Spinner
                                size="xs"
                                color="#ffffff"
                                trackOpacity={0.35}
                              />
                            )}
                            {isBusy ? "Deleting…" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {confirmTarget && (
        <ConfirmModal
          listing={confirmTarget}
          busy={pendingId === confirmTarget._id}
          onCancel={() => setConfirmTarget(null)}
          onConfirm={() => handleDelete(confirmTarget)}
        />
      )}
    </section>
  );
}

function EmptyState({ filtered, onClearQuery }) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#2ed2c3]/10 text-[#2ed2c3]">
        <EmptyIcon />
      </div>
      <p className="text-base font-semibold text-zinc-900">
        {filtered ? "No matching listings" : "No listings found"}
      </p>
      <p className="mt-1 max-w-sm text-sm text-zinc-500">
        {filtered
          ? "Try a different search term or clear the filter."
          : "Once users start adding businesses, they will show up here."}
      </p>
      {filtered && (
        <button
          type="button"
          onClick={onClearQuery}
          className="mt-4 inline-flex h-9 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 text-xs font-semibold text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900"
        >
          Clear search
        </button>
      )}
    </div>
  );
}

function ConfirmModal({ listing, busy, onCancel, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={() => !busy && onCancel()}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <div className="relative z-10 w-full max-w-sm rounded-xl bg-white p-6 text-left shadow-2xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
          <WarningIcon />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-zinc-900">
          Delete this listing?
        </h3>
        <p className="mt-2 text-sm text-zinc-600">
          Are you sure you want to delete{" "}
          <span className="font-medium text-zinc-900">
            {listing.name || "this listing"}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {busy && (
              <Spinner size="sm" color="#ffffff" trackOpacity={0.35} />
            )}
            {busy ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m20 20-3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m3 7 9 6 9-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m3.27 6.96 8.73 5.05 8.73-5.05M12 22.08V12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
