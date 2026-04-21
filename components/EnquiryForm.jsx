"use client";

import { useState } from "react";
import { Spinner } from "@/components/Spinner";

const ACCENT = "#2ed2c3";

export function EnquiryForm({ listingId, businessName }) {
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    const payload = {
      listingId,
      name: form.get("name") || "",
      message: form.get("message") || "",
    };

    console.log("[enquiry] submitted:", payload);

    await new Promise((r) => setTimeout(r, 600));

    e.currentTarget.reset();
    setStatus("sent");
    setTimeout(() => setStatus("idle"), 3000);
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
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">Send an Enquiry</h3>
          <p className="mt-0.5 text-sm text-zinc-500">
            {businessName
              ? `Get in touch with ${businessName}.`
              : "Get in touch with this business."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="enq-name" className="text-sm font-medium text-zinc-700">
            Name
          </label>
          <input
            id="enq-name"
            name="name"
            type="text"
            placeholder="Your name"
            className="h-12 w-full rounded-md border border-gray-300 bg-white px-4 text-sm text-zinc-900 outline-none transition-all duration-200 placeholder:text-zinc-400 focus:border-[#2ed2c3] focus:ring-2 focus:ring-[#2ed2c3]/30"
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
            placeholder="How can they help you?"
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-all duration-200 placeholder:text-zinc-400 focus:border-[#2ed2c3] focus:ring-2 focus:ring-[#2ed2c3]/30"
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          style={{ backgroundColor: ACCENT }}
        >
          {status === "sending" && (
            <Spinner size="sm" color="#ffffff" trackOpacity={0.35} />
          )}
          {status === "sending" ? "Sending..." : "Send Enquiry"}
          {status !== "sending" && <SendIcon />}
        </button>

        {status === "sent" && (
          <p className="text-center text-xs font-medium" style={{ color: ACCENT }}>
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
