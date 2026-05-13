"use client";

import { useState } from "react";
import { Spinner } from "@/components/Spinner";

const ACCENT = "#2ed2c3";

export function EnquiryForm({ listingId, businessName }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const message = String(form.get("message") || "").trim();

    if (name.length < 2) {
      setError("Please enter your name (at least 2 characters).");
      return;
    }
    if (message.length < 5) {
      setError("Please enter a short message (at least 5 characters).");
      return;
    }

    setStatus("sending");
    try {
      await new Promise((r) => setTimeout(r, 600));
      e.currentTarget.reset();
      setStatus("sent");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg ring-1 ring-zinc-100 sm:p-7">
      <div className="flex items-start gap-3">
        <span
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2ed2c3]/10"
          style={{ color: ACCENT }}
        >
          <MessageIcon />
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-zinc-900">Send an Enquiry</h3>
          <p className="mt-0.5 text-sm text-zinc-500">
            {businessName
              ? `Get in touch with ${businessName}.`
              : "Get in touch with this business."}
          </p>
        </div>
      </div>

      {error ? (
        <div
          role="alert"
          aria-live="polite"
          className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800"
        >
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4" noValidate>
        <input type="hidden" name="listingId" value={listingId || ""} readOnly />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="enq-name" className="text-sm font-medium text-zinc-700">
            Name
          </label>
          <input
            id="enq-name"
            name="name"
            type="text"
            placeholder="Your name"
            minLength={2}
            className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-base text-zinc-900 outline-none transition-all duration-200 placeholder:text-zinc-400 focus:border-[#2ed2c3] focus:ring-2 focus:ring-[#2ed2c3]/30 md:text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="enq-message"
            className="text-sm font-medium text-zinc-700"
          >
            Message
          </label>
          <textarea
            id="enq-message"
            name="message"
            rows={4}
            minLength={5}
            placeholder="How can they help you?"
            className="min-h-[8rem] w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-base text-zinc-900 outline-none transition-all duration-200 placeholder:text-zinc-400 focus:border-[#2ed2c3] focus:ring-2 focus:ring-[#2ed2c3]/30 md:text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          style={{ backgroundColor: ACCENT }}
        >
          {status === "sending" && (
            <Spinner size="sm" color="#ffffff" trackOpacity={0.35} />
          )}
          {status === "sending" ? "Sending..." : "Send Enquiry"}
          {status !== "sending" && <SendIcon />}
        </button>

        {status === "sent" && (
          <p
            className="text-center text-xs font-medium"
            style={{ color: ACCENT }}
            role="status"
            aria-live="polite"
          >
            Enquiry sent! They will get back to you soon.
          </p>
        )}
      </form>
    </div>
  );
}

function MessageIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M21 12a9 9 0 0 1-9 9 9.1 9.1 0 0 1-4.2-1L3 21l1-4.8A9 9 0 1 1 21 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SendIcon() {
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
        d="m3 11 18-8-8 18-2-8-8-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
