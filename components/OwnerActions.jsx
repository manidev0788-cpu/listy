"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/Spinner";

export function OwnerActions({ id, name }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState("");

  const handleEdit = () => {
    if (!id) return;
    router.push(`/edit-listing/${encodeURIComponent(id)}`);
  };

  const handleDelete = async () => {
    if (!id) return;
    setError("");
    setDeleting(true);
    try {
      const res = await fetch(`/api/listings/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setError(
          data?.message ||
            data?.error ||
            `Could not delete (status ${res.status}).`
        );
        setDeleting(false);
        return;
      }
      router.push("/listings");
      router.refresh();
    } catch (err) {
      console.error("[owner-actions] delete error:", err);
      setError("Network error — please try again.");
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="mt-6 flex gap-4">
        <button
          type="button"
          onClick={handleEdit}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#2ed2c3] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1fa99c]"
        >
          <PencilIcon />
          Edit Listing
        </button>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-600"
        >
          <TrashIcon />
          Delete Listing
        </button>
      </div>

      {error && (
        <p className="rounded-md bg-rose-500/90 px-3 py-1.5 text-xs text-white">
          {error}
        </p>
      )}

      {confirmOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => !deleting && setConfirmOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-sm rounded-xl bg-white p-6 text-left shadow-2xl">
            <h3 className="text-lg font-semibold text-zinc-900">
              Are you sure?
            </h3>
            <p className="mt-2 text-sm text-zinc-600">
              {name ? (
                <>
                  <span className="font-medium text-zinc-900">{name}</span> will
                  be permanently deleted. This action cannot be undone.
                </>
              ) : (
                "This listing will be permanently deleted. This action cannot be undone."
              )}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={deleting}
                className="rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting && (
                  <Spinner size="sm" color="#ffffff" trackOpacity={0.35} />
                )}
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PencilIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14ZM10 11v6M14 11v6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
