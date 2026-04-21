"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchableSelect } from "@/components/SearchableSelect";
import { CATEGORIES } from "@/lib/categories";
import { LOCATIONS } from "@/lib/locations";

const slides = [
  {
    src: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=1920&q=80",
    alt: "Coffee shop interior",
  },
  {
    src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1920&q=80",
    alt: "Busy restaurant scene",
  },
  {
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80",
    alt: "Cozy cafe workspace",
  },
  {
    src: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1920&q=80",
    alt: "Boutique shopping street",
  },
];

const rotatingWords = [
  "Coffee Shops",
  "Restaurants",
  "Hotels",
  "Activities",
  "Events",
];

const featuredCategories = [
  {
    name: "Eat & Drink",
    href: "/listings?category=Restaurant",
    icon: CutleryIcon,
  },
  {
    name: "Apartments",
    href: "/listings?category=Apartments",
    icon: HomeIcon,
  },
  {
    name: "Services",
    href: "/listings?category=Services",
    icon: BriefcaseIcon,
  },
  { name: "Events", href: "/listings?category=Events", icon: MusicIcon },
];

export function Hero() {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeWord, setActiveWord] = useState(0);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const q = query.trim();
    const loc = location.trim();
    const cat = category.trim();
    if (q) params.set("search", q);
    if (loc) params.set("location", loc);
    if (cat) params.set("category", cat);
    const qs = params.toString();
    router.push(qs ? `/listings?${qs}` : "/listings");
  };

  useEffect(() => {
    const id = setInterval(() => {
      setActiveSlide((s) => (s + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveWord((w) => (w + 1) % rotatingWords.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
              i === activeSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url('${slide.src}')` }}
            role="img"
            aria-label={slide.alt}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-black/55" aria-hidden />

      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4 pb-16 pt-[88px] text-center sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[860px] text-white">
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Find Nearby{" "}
            <span className="relative inline-block align-baseline">
              <span
                key={activeWord}
                className="inline-block animate-[fade-in_400ms_ease-out_both] text-white"
              >
                {rotatingWords[activeWord]}
              </span>
              <span
                aria-hidden
                className="ml-1 inline-block h-[0.9em] w-[3px] -translate-y-[-0.05em] animate-pulse bg-white align-middle"
              />
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base font-normal leading-relaxed text-white/90 sm:text-lg">
            Explore top-rated attractions, activities and more!
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="mx-auto mt-10 w-full max-w-[920px]"
          role="search"
          aria-label="Search listings"
        >
          <div className="flex flex-col rounded-[28px] bg-white p-2 shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-black/5 md:flex-row md:items-center md:rounded-full">
            <div className="flex min-h-[52px] flex-1 items-center gap-3 border-b border-zinc-200 px-4 py-2 md:border-b-0 md:border-r md:px-5">
              <span
                aria-hidden
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#2ed2c3] to-[#1fa99c] text-white"
              >
                <SparkleIcon />
              </span>
              <input
                name="q"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, category or keyword"
                className="min-w-0 flex-1 border-0 bg-transparent py-1 text-left text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
              />
            </div>

            <div className="flex min-h-[52px] flex-1 items-stretch border-b border-zinc-200 md:border-b-0 md:border-r">
              <SearchableSelect
                value={location}
                onChange={setLocation}
                options={LOCATIONS}
                placeholder="City, country or area"
                searchPlaceholder="Search locations..."
                emptyLabel="locations"
                leftIcon={<PinIcon />}
                allowCustom
                ariaLabel="Location"
                buttonClassName="!h-full !border-0 !bg-transparent !rounded-none !px-4 md:!px-5 focus:!ring-0 focus:!bg-transparent"
              />
            </div>

            <div className="flex min-h-[52px] flex-1 items-stretch">
              <SearchableSelect
                value={category}
                onChange={setCategory}
                options={CATEGORIES}
                placeholder="All Categories"
                searchPlaceholder="Search categories..."
                emptyLabel="categories"
                leftIcon={<TagIcon />}
                ariaLabel="Category"
                buttonClassName="!h-full !border-0 !bg-transparent !rounded-none !px-4 md:!px-5 focus:!ring-0 focus:!bg-transparent"
              />
            </div>

            <div className="mt-1 md:mt-0 md:shrink-0 md:pl-2">
              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-linear-to-br from-[#2ed2c3] to-[#1fa99c] px-7 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ed2c3] focus-visible:ring-offset-2 md:w-auto md:min-w-[140px]"
              >
                <SearchIcon />
                Search
              </button>
            </div>
          </div>
        </form>

        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="text-sm text-white/85">Or browse featured categories:</p>
          <ul className="flex flex-wrap items-center justify-center gap-3">
            {featuredCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <li key={cat.name}>
                  <Link
                    href={cat.href}
                    className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/25 backdrop-blur-sm transition-colors hover:bg-white/25"
                  >
                    <Icon />
                    {cat.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2" aria-hidden>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeSlide ? "w-8 bg-white" : "w-4 bg-white/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SparkleIcon() {
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
        d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0-5a8 8 0 0 0-8 8c0 5.25 8 13 8 13s8-7.75 8-13a8 8 0 0 0-8-8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        fill="none"
      />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2A2 2 0 0 1 3 12V4a1 1 0 0 1 1-1h8a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function ChevronDownIcon() {
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
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="m20 20-3.5-3.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CutleryIcon() {
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
        d="M6 3v7a2 2 0 0 0 2 2v9M10 3v7a2 2 0 0 1-2 2M18 3c-1.5 0-3 2-3 5s1.5 4 3 4v9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HomeIcon() {
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
        d="m3 11 9-8 9 8v9a2 2 0 0 1-2 2h-4v-6H10v6H6a2 2 0 0 1-2-2v-9Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="3"
        y="7"
        width="18"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MusicIcon() {
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
        d="M9 18V5l12-2v13"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}
