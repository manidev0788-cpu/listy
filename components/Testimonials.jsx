"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const ACCENT = "#2ed2c3";

const testimonials = [
  {
    quote:
      "Listfy brought us real foot traffic within weeks. The listing flow is simple and our hotel shows up beautifully on mobile.",
    name: "Priya Sharma",
    role: "Boutique hotel · Mumbai",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    quote:
      "We replaced three different tools with one directory. Customers actually find our café now — the map and categories just work.",
    name: "Marcus Webb",
    role: "Café owner · Melbourne",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    quote:
      "As a realtor, credibility matters. Listfy profiles look professional and the lead quality from local search has been excellent.",
    name: "Elena Vogt",
    role: "Real estate · Berlin",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    quote:
      "Our spa went from invisible to fully booked on weekends. Love the clean design — it matches our brand without extra work.",
    name: "Amélie Fortin",
    role: "Day spa · Montreal",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    quote:
      "I list pop-up events across cities; updating times and photos is fast. The dashboard saves me hours every month.",
    name: "Jordan Lee",
    role: "Event producer · Los Angeles",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    quote:
      "Finally a directory that doesn’t look dated. Our auto shop photos and reviews stand out — customers say they found us instantly.",
    name: "David Okonkwo",
    role: "Auto repair · Vancouver",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    quote:
      "We run a family dental clinic — Listfy helped parents find us by neighborhood and insurance-friendly tags. Inquiries doubled in two months.",
    name: "Dr. Hannah Yusuf",
    role: "Dental clinic · Toronto",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    quote:
      "Our gym’s trial sign-ups went through the roof after we optimized the listing. The UI is modern and the SEO-friendly structure actually matters.",
    name: "Tomás Rivera",
    role: "Fitness studio · Sydney",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    quote:
      "Independent bookstore here — Listfy’s category tags and neighborhood filters brought in readers we never reached on social alone.",
    name: "Nina Kowalski",
    role: "Bookshop · Chicago",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80",
  },
];

function Stars({ small }) {
  return (
    <div className="flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={small ? "h-3.5 w-3.5" : "h-4 w-4 sm:h-5 sm:w-5"}
          viewBox="0 0 24 24"
          fill={ACCENT}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t, alone }) {
  return (
    <article
      className={`flex h-full flex-col gap-5 rounded-2xl border border-zinc-100/90 bg-white/95 p-6 shadow-sm sm:flex-row sm:items-start sm:gap-6 sm:p-7 ${
        alone ? "md:col-span-2 md:mx-auto md:max-w-2xl" : ""
      }`}
    >
      <div className="relative mx-auto shrink-0 sm:mx-0">
        <div
          className="absolute -inset-0.5 rounded-full opacity-50 blur-sm"
          style={{
            background: `linear-gradient(135deg, ${ACCENT}, rgba(99,102,241,0.45))`,
          }}
          aria-hidden
        />
        <div className="relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-white shadow-md sm:h-24 sm:w-24">
          <Image
            src={t.image}
            alt=""
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="min-w-0 flex-1 text-center sm:text-left">
        <Stars small />
        <blockquote className="mt-3 text-sm font-medium leading-relaxed text-zinc-800 sm:text-base">
          <span className="text-[#1fa99c]">“</span>
          {t.quote}
          <span className="text-[#1fa99c]">”</span>
        </blockquote>
        <footer className="mt-4 flex flex-col gap-0.5 sm:items-start">
          <cite className="not-italic text-sm font-semibold text-zinc-900 sm:text-base">
            {t.name}
          </cite>
          <span className="text-xs text-zinc-500 sm:text-sm">{t.role}</span>
        </footer>
      </div>
    </article>
  );
}

export function Testimonials() {
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  const len = testimonials.length;
  const numPages = Math.ceil(len / 2);

  const go = useCallback(
    (dir) => {
      setPage((p) => (p + dir + numPages) % numPages);
    },
    [numPages]
  );

  useEffect(() => {
    if (reduceMotion || paused) return;
    const id = window.setInterval(() => {
      setPage((p) => (p + 1) % numPages);
    }, 6500);
    return () => window.clearInterval(id);
  }, [reduceMotion, paused, numPages]);

  return (
    <section
      className="relative w-full overflow-hidden py-16 sm:py-20 lg:py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#dff5f2] via-[#e8faf7] to-[#e0f0ff]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          backgroundImage: `radial-gradient(ellipse 90% 60% at 10% 20%, ${ACCENT}2a 0%, transparent 50%),
            radial-gradient(ellipse 70% 50% at 90% 30%, rgba(99, 102, 241, 0.14) 0%, transparent 45%),
            radial-gradient(ellipse 80% 55% at 50% 100%, ${ACCENT}18 0%, transparent 55%)`,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-[15%] top-[10%] h-[min(28rem,70vw)] w-[min(28rem,70vw)] rounded-full bg-[#2ed2c3]/35 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-[10%] top-[35%] h-[22rem] w-[22rem] rounded-full bg-cyan-300/30 blur-[85px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-[25%] h-56 w-56 rounded-full bg-indigo-200/25 blur-[72px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(31, 169, 156, 0.2) 0.5px, transparent 0.6px)",
          backgroundSize: "20px 20px",
        }}
        aria-hidden
      />

      <div className="relative z-[1] mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "#1fa99c", backgroundColor: `${ACCENT}1f` }}
          >
            Testimonials
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-[2.5rem]">
            Trusted by owners who list on Listfy
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-600 sm:text-base">
            Two stories at a time — use the arrows or dots to browse, or wait for
            the slider to advance.
          </p>
        </div>

        <div className="relative mt-12 sm:mt-14">
          <span
            className="pointer-events-none absolute -left-2 top-0 select-none font-serif text-[8rem] font-bold leading-none text-[#2ed2c3]/10 sm:text-[10rem] lg:left-4 lg:text-[12rem]"
            aria-hidden
          >
            “
          </span>

          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/90 bg-white/88 shadow-[0_20px_60px_rgba(46,210,195,0.12)] backdrop-blur-md sm:rounded-[2rem]">
            <div
              className={`flex ${reduceMotion ? "" : "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"}`}
              style={{
                transform: `translateX(-${page * 100}%)`,
              }}
            >
              {Array.from({ length: numPages }).map((_, pageIdx) => {
                const pair = testimonials.slice(pageIdx * 2, pageIdx * 2 + 2);
                const alone = pair.length === 1;
                return (
                  <div
                    key={pageIdx}
                    className="w-full shrink-0 px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12"
                    aria-hidden={pageIdx !== page}
                  >
                    <div
                      className={`grid gap-6 ${alone ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}
                    >
                      {pair.map((t) => (
                        <TestimonialCard key={t.name} t={t} alone={alone} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:border-[#2ed2c3] hover:text-[#1fa99c]"
                aria-label="Previous testimonials"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M15 18l-6-6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:border-[#2ed2c3] hover:text-[#1fa99c]"
                aria-label="Next testimonials"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M9 18l6-6-6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-2" role="tablist">
              {Array.from({ length: numPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === page}
                  aria-label={`Show testimonials page ${i + 1}`}
                  onClick={() => setPage(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === page
                      ? "w-10 bg-[#2ed2c3]"
                      : "w-2.5 bg-zinc-300 hover:bg-zinc-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
