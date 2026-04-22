"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const ACCENT = "#2ed2c3";

/** Featured home carousel — names must match `CATEGORIES` / add-listing dropdown exactly. */
const SLIDER_CATEGORIES = [
  {
    name: "Automotive",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Beauty & Spas",
    image:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Hotels",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Real Estate",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Restaurants",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Shopping",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Fitness & Instruction",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Coffee & Tea",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Nightlife",
    image:
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Gyms",
    image:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Spas",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Pet Services",
    image:
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Home Services",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Travel Services",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Events",
    image:
      "https://images.unsplash.com/photo-1540575467063-27a04c5724cf?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Pizza",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Health & Medical",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Education",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Photographers",
    image:
      "https://images.unsplash.com/photo-1452587925148-ce544e77f70e?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Yoga",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Auto Repair",
    image:
      "https://images.unsplash.com/photo-1632823463396-24b32842e555?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Massage Therapy",
    image:
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028dec?auto=format&fit=crop&w=900&q=80",
  },
];

const ICONS = [
  "/images/icon-02.svg",
  "/images/icon-03.svg",
  "/images/icon-04.svg",
  "/images/icon-05.svg",
  "/images/icon-06.svg",
  "/images/icon-07.svg",
];

function categoryHref(name) {
  return `/listings?category=${encodeURIComponent(name)}`;
}

function ChevronDown({ className }) {
  return (
    <svg
      className={className}
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DoubleChevronDown({ className }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m6 15 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon({ dir }) {
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
        d={dir === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Pixels per millisecond — lower = slower crawl (~0.1 ≈ 6 px/sec). */
const AUTO_SCROLL_SPEED = 0.11;

function CategoryCard({ cat, i, duplicate }) {
  return (
    <div
      data-category-card
      className="w-[min(88vw,340px)] flex-shrink-0 sm:w-[300px] lg:w-[340px]"
    >
      <Link
        href={categoryHref(cat.name)}
        tabIndex={duplicate ? -1 : undefined}
        className="group flex h-full flex-col overflow-visible rounded-2xl border border-white/60 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04] transition-all duration-500 hover:-translate-y-2 hover:border-white hover:shadow-[0_24px_50px_rgba(46,210,195,0.18)]"
      >
        <div className="relative z-0 h-52 w-full shrink-0 sm:h-56 lg:h-60">
          <div className="absolute inset-0 overflow-hidden rounded-t-2xl bg-zinc-100">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
              style={{ backgroundImage: `url('${cat.image}')` }}
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent"
              aria-hidden
            />
          </div>
          <span
            className="absolute bottom-0 left-1/2 z-20 flex h-14 w-14 -translate-x-1/2 -translate-y-[58%] items-center justify-center rounded-full bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] ring-2 ring-white"
            style={{ boxShadow: `0 8px 28px ${ACCENT}33` }}
          >
            <Image
              src={ICONS[i % ICONS.length]}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
          </span>
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-2 rounded-b-2xl bg-white px-4 pb-7 pt-9 text-center sm:pt-10">
          <span className="text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
            {cat.name}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors group-hover:text-[#1fa99c]">
            Browse listings
            <ChevronDown className="text-zinc-400 group-hover:text-[#1fa99c]" />
          </span>
        </div>
      </Link>
    </div>
  );
}

export function Categories() {
  const scrollerRef = useRef(null);
  const firstStripRef = useRef(null);
  const loopWidthRef = useRef(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const measureLoopWidth = useCallback(() => {
    const strip = firstStripRef.current;
    const parent = strip?.parentElement;
    if (!strip || !parent) return;
    const gapRaw = getComputedStyle(parent).gap || getComputedStyle(parent).columnGap;
    const gap =
      gapRaw && gapRaw !== "normal" ? parseFloat(gapRaw) || 24 : 24;
    loopWidthRef.current = strip.offsetWidth + gap;
  }, []);

  useEffect(() => {
    const strip = firstStripRef.current;
    if (!strip) return;
    measureLoopWidth();
    const ro = new ResizeObserver(() => measureLoopWidth());
    ro.observe(strip);
    return () => ro.disconnect();
  }, [measureLoopWidth]);

  const scrollByDir = useCallback((dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("[data-category-card]");
    const step = (card?.offsetWidth ?? 320) + 24;
    el.scrollBy({
      left: dir * step,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (reduceMotion || paused) return;
    const el = scrollerRef.current;
    if (!el) return;

    let rafId = 0;
    let last = performance.now();

    const tick = (now) => {
      const dtMs = Math.min(48, now - last);
      last = now;

      const lw = loopWidthRef.current;
      if (lw > 1) {
        el.scrollLeft += AUTO_SCROLL_SPEED * dtMs;
        if (el.scrollLeft >= lw) {
          el.scrollLeft -= lw;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reduceMotion, paused]);

  return (
    <section
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#eefcfb] via-[#f4f6f8] to-[#f6f7f8] py-16 sm:py-20 lg:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, ${ACCENT}22 0%, transparent 45%),
            radial-gradient(circle at 80% 60%, ${ACCENT}18 0%, transparent 42%)`,
        }}
        aria-hidden
      />

      <div className="relative mx-auto mb-12 max-w-3xl px-4 text-center sm:mb-14 sm:px-6">
        <span
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: "#1fa99c", backgroundColor: `${ACCENT}22` }}
        >
          Discover
        </span>
        <h2 className="mt-5 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
          Our Top Categories
        </h2>
        <p className="mt-3 text-base text-zinc-600 sm:text-lg">
          Explore popular categories — the row scrolls slowly on its own; hover
          to pause, or swipe and use the arrows to jump.
        </p>
      </div>

      <div className="relative w-full">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-20 w-8 bg-gradient-to-r from-[#f4f6f8] to-transparent sm:w-16 lg:w-24"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-20 w-8 bg-gradient-to-l from-[#f6f7f8] to-transparent sm:w-16 lg:w-24"
          aria-hidden
        />

        <button
          type="button"
          onClick={() => scrollByDir(-1)}
          className="absolute left-2 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/95 text-zinc-700 shadow-lg backdrop-blur-sm transition hover:scale-105 hover:border-zinc-200 hover:text-zinc-900 sm:flex lg:left-6"
          aria-label="Previous categories"
        >
          <ArrowIcon dir="left" />
        </button>
        <button
          type="button"
          onClick={() => scrollByDir(1)}
          className="absolute right-2 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/95 text-zinc-700 shadow-lg backdrop-blur-sm transition hover:scale-105 hover:border-zinc-200 hover:text-zinc-900 sm:flex lg:right-6"
          aria-label="Next categories"
        >
          <ArrowIcon dir="right" />
        </button>

        <div
          ref={scrollerRef}
          className="w-full overflow-x-auto px-4 pb-6 pt-2 [scrollbar-width:none] [-ms-overflow-style:none] sm:px-8 lg:px-12 [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="flex w-max gap-6">
            <div ref={firstStripRef} className="flex gap-6">
              {SLIDER_CATEGORIES.map((cat, i) => (
                <CategoryCard key={cat.name} cat={cat} i={i} duplicate={false} />
              ))}
            </div>
            <div className="flex gap-6" aria-hidden>
              {SLIDER_CATEGORIES.map((cat, i) => (
                <CategoryCard key={`${cat.name}-dup`} cat={cat} i={i} duplicate />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-4 flex justify-center px-4">
        <Link
          href="/listings"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200/90 bg-white px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-700 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition hover:border-[#2ed2c3] hover:text-[#1fa99c]"
        >
          <DoubleChevronDown className="text-zinc-500" />
          View all listings
        </Link>
      </div>
    </section>
  );
}
