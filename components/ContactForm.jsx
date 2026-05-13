"use client";

import { useState } from "react";
import { readJsonResponse } from "@/lib/readJsonResponse";

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [pending, setPending] = useState(false);

  const validate = () => {
    const n = name.trim();
    const e = email.trim().toLowerCase();
    const m = message.trim();
    if (n.length < 2) return "Please enter your name (at least 2 characters).";
    if (!EMAIL_RE.test(e)) return "Please enter a valid email address.";
    if (m.length < 10)
      return "Please enter a message (at least 10 characters).";
    return null;
  };

  async function onSubmit(e) {
    e.preventDefault();
    const clientErr = validate();
    if (clientErr) {
      setStatus({ type: "error", text: clientErr });
      return;
    }
    setPending(true);
    setStatus(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          message: message.trim(),
        }),
      });
      const data = await readJsonResponse(res);
      if (!res.ok || data?.ok === false) {
        setStatus({
          type: "error",
          text:
            (typeof data.message === "string" && data.message) ||
            "Something went wrong. Please try again.",
        });
        return;
      }
      setStatus({
        type: "success",
        text:
          (typeof data.message === "string" && data.message) ||
          "Thanks — we received your message and will reply soon.",
      });
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus({
        type: "error",
        text: "Network error. Check your connection and try again.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
      noValidate
    >
      {status ? (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-xl px-4 py-3 text-sm font-medium ${
            status.type === "success"
              ? "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200"
              : "bg-red-50 text-red-900 ring-1 ring-red-200"
          }`}
        >
          {status.text}
        </div>
      ) : null}

      <div>
        <label
          htmlFor="contact-name"
          className="block text-sm font-semibold text-zinc-800"
        >
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-base text-zinc-900 outline-none transition-colors focus:border-[#2ed2c3] focus:ring-2 focus:ring-[#2ed2c3]/25 md:py-2.5 md:text-sm"
          placeholder="Your name"
          required
          minLength={2}
        />
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="block text-sm font-semibold text-zinc-800"
        >
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-base text-zinc-900 outline-none transition-colors focus:border-[#2ed2c3] focus:ring-2 focus:ring-[#2ed2c3]/25 md:py-2.5 md:text-sm"
          placeholder="you@example.com"
          required
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block text-sm font-semibold text-zinc-800"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-2 min-h-[8rem] w-full resize-y rounded-xl border border-zinc-200 px-4 py-3 text-base text-zinc-900 outline-none transition-colors focus:border-[#2ed2c3] focus:ring-2 focus:ring-[#2ed2c3]/25 md:py-2.5 md:text-sm"
          placeholder="How can we help?"
          required
          minLength={10}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#2ed2c3] px-5 py-3 text-sm font-bold text-zinc-900 transition hover:bg-[#26c2b5] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
