"use client";

import Image from "next/image";
import { useState } from "react";
import { readJsonResponse } from "@/lib/readJsonResponse";

const ACCENT = "#2ed2c3";
const EMAIL_RE =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SubscribeSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [heroImageFailed, setHeroImageFailed] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await readJsonResponse(res);

      if (!res.ok || data?.ok === false) {
        setStatus("error");
        setMessage(
          (typeof data?.message === "string" && data.message) ||
            "Something went wrong. Try again."
        );
        return;
      }

      setStatus("success");
      setMessage(
        (typeof data?.message === "string" && data.message) ||
          "Thanks — you’re on the list."
      );
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Check your connection.");
    }
  }

  return (
    <section className="relative w-full overflow-hidden bg-zinc-50 py-14 sm:py-16 lg:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-0 shadow-[0_24px_80px_rgba(0,0,0,0.08)] lg:grid-cols-2 lg:gap-0 lg:rounded-3xl lg:overflow-hidden lg:bg-white lg:ring-1 lg:ring-zinc-200/80">
        {/* Image — business / listings theme */}
        <div className="relative min-h-[240px] sm:min-h-[300px] lg:min-h-[420px]">
          {!heroImageFailed ? (
            <Image
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85"
              alt="Small business owner managing listings on a tablet"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={false}
              onError={() => setHeroImageFailed(true)}
            />
          ) : (
            <div
              className="absolute inset-0 bg-gradient-to-br from-[#1fa99c] to-[#2ed2c3]"
              aria-hidden
            />
          )}
          <div
            className="absolute inset-0 bg-gradient-to-tr from-black/55 via-black/15 to-transparent lg:from-black/40"
            aria-hidden
          />
          <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
              Listfy
            </p>
            <p className="mt-2 max-w-sm text-lg font-semibold leading-snug text-white sm:text-xl">
              Grow your business where people actually search for local services.
            </p>
          </div>
        </div>

        {/* Copy + form */}
        <div className="flex flex-col justify-center border-t border-zinc-100 bg-white px-6 py-10 sm:px-10 sm:py-12 lg:border-t-0 lg:px-12 lg:py-14">
          <span
            className="inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
            style={{ color: "#1fa99c", backgroundColor: `${ACCENT}22` }}
          >
            Newsletter
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl lg:text-[2rem]">
            Subscribe for listing tips &amp; updates
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-600 sm:text-base">
            Short reads on getting found, better photos, and seasonal ideas for
            your listing — no spam, unsubscribe anytime.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="subscribe-email" className="sr-only">
                Email address
              </label>
              <input
                id="subscribe-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3.5 text-sm text-zinc-900 outline-none ring-0 transition placeholder:text-zinc-400 focus:border-[#2ed2c3] focus:bg-white focus:ring-2 focus:ring-[#2ed2c3]/25 disabled:opacity-60"
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-xl bg-[#2ed2c3] px-5 py-3.5 text-sm font-bold uppercase tracking-wider text-zinc-900 shadow-sm transition hover:bg-[#26c2b5] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-8"
            >
              {status === "loading" ? "Subscribing…" : "Subscribe"}
            </button>
          </form>

          {message ? (
            <p
              className={`mt-4 text-sm font-medium ${
                status === "success" ? "text-[#1fa99c]" : "text-red-600"
              }`}
              role={status === "error" ? "alert" : "status"}
              aria-live="polite"
            >
              {message}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
