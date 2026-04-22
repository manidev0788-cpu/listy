import Link from "next/link";

const ACCENT = "#2ed2c3";

/**
 * 12 cities — mixed order (not grouped by country). 6 + 6 on large screens.
 * Each entry: Unsplash photo + gradient fallback + explicit cover background on the card.
 */
const cities = [
  {
    name: "Sydney",
    country: "Australia",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=85",
    fallback: "from-blue-900 to-zinc-900",
    listings: ["Circular Quay", "Bondi Beach", "Surry Hills"],
  },
  {
    name: "Berlin",
    country: "Germany",
    image:
      "https://images.unsplash.com/photo-1587330979470-3595ac045ab0?auto=format&fit=crop&w=1200&q=85",
    fallback: "from-zinc-800 to-black",
    listings: ["Brandenburg Gate", "Museum Island", "Kreuzberg Cafés"],
  },
  {
    name: "Mumbai",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=1200&q=85",
    fallback: "from-rose-900 to-zinc-900",
    listings: ["Marine Drive", "Bandra Workspaces", "Colaba Markets"],
  },
  {
    name: "Vancouver",
    country: "Canada",
    image:
      "https://images.unsplash.com/photo-1559511260-66a648ae719a?auto=format&fit=crop&w=1200&q=85",
    fallback: "from-emerald-900 to-zinc-900",
    listings: ["Granville Island", "Gastown", "Stanley Park"],
  },
  {
    name: "Munich",
    country: "Germany",
    image:
      "https://images.unsplash.com/photo-1528722828811-3228457f6b22?auto=format&fit=crop&w=1200&q=85",
    fallback: "from-amber-900 to-zinc-900",
    listings: ["Marienplatz", "English Garden", "Viktualienmarkt"],
  },
  {
    name: "New York",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1496588152823-86ff7695e68f?auto=format&fit=crop&w=1200&q=85",
    fallback: "from-zinc-700 to-zinc-900",
    listings: ["Central Park Bistro", "Brooklyn Pizzeria", "Soho Gallery"],
  },
  {
    name: "Delhi",
    country: "India",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=85",
    fallback: "from-amber-900 to-zinc-900",
    listings: ["Connaught Place", "Hauz Khas", "Cyber Hub"],
  },
  {
    name: "Melbourne",
    country: "Australia",
    image:
      "https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=1200&q=85",
    fallback: "from-violet-900 to-zinc-900",
    listings: ["Laneway Coffee", "Fitzroy", "Yarra River"],
  },
  {
    name: "Toronto",
    country: "Canada",
    image:
      "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=1200&q=85",
    fallback: "from-sky-900 to-zinc-900",
    listings: ["Distillery District", "Harbourfront", "Kensington Market"],
  },
  {
    name: "Las Vegas",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1581351721010-8cf859cb14a4?auto=format&fit=crop&w=1200&q=85",
    fallback: "from-[#2ed2c3] to-zinc-900",
    listings: ["Bellagio Fountains", "The Strip Bistro"],
  },
  {
    name: "Hamburg",
    country: "Germany",
    image:
      "https://images.unsplash.com/photo-1467269204574-96630b8c4cf8?auto=format&fit=crop&w=1200&q=85",
    fallback: "from-slate-800 to-zinc-900",
    listings: ["Speicherstadt", "Elbe Waterfront", "Schanzenviertel"],
  },
  {
    name: "Los Angeles",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=1200&q=85",
    fallback: "from-[#2ed2c3] to-zinc-900",
    listings: ["Venice Beach Cafe", "Hollywood Diner", "Sunset Hotels"],
  },
];

function cityHref(city) {
  return `/listings?city=${encodeURIComponent(city.name)}`;
}

function CityCard({ city }) {
  const listingCount = city.listings.length;

  return (
    <Link
      href={cityHref(city)}
      className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_20px_44px_rgba(46,210,195,0.15)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ed2c3] focus-visible:ring-offset-2"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${city.fallback}`}
        aria-hidden
      />

      <div
        className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-110"
        style={{
          backgroundColor: "rgba(0,0,0,0.06)",
          backgroundImage: `url('${city.image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden
      />

      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity duration-300 group-hover:opacity-0"
        aria-hidden
      />

      <div
        className="absolute inset-0 bg-black/60 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />

      <div className="absolute left-3 top-3 z-10">
        <span className="inline-flex rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-800 shadow-sm backdrop-blur-sm sm:text-[11px]">
          {city.country}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 p-3 transition-all duration-300 group-hover:translate-y-2 group-hover:opacity-0 sm:p-4">
        <h3 className="text-sm font-semibold text-white drop-shadow-md sm:text-base">
          {city.name}
        </h3>
        <p className="mt-0.5 text-[11px] text-white/85 sm:text-xs">
          {listingCount} featured {listingCount === 1 ? "spot" : "spots"}
        </p>
      </div>

      <div className="absolute inset-0 z-10 flex translate-y-3 flex-col justify-end px-3 py-3 text-white opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 sm:justify-center sm:px-4 sm:py-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold drop-shadow sm:text-lg">
              {city.name}
            </h3>
            <p className="text-xs text-white/80">{city.country}</p>
          </div>
          <span
            className="inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white sm:text-[11px]"
            style={{ backgroundColor: ACCENT }}
          >
            {listingCount} picks
          </span>
        </div>
        <ul className="mt-2 space-y-1 text-xs text-white/90 sm:mt-3 sm:space-y-1.5 sm:text-sm">
          {city.listings.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span
                className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#2ed2c3]"
                aria-hidden
              />
              <span className="line-clamp-2 leading-snug">{item}</span>
            </li>
          ))}
        </ul>
        <span className="mt-3 inline-flex w-fit items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#2ed2c3] sm:mt-4 sm:text-xs">
          Browse listings
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}

function SectionBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Soft tinted base — reduces harsh white */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#e8f6f4] via-[#eefaf8] to-[#f0f4f8]"
        aria-hidden
      />
      {/* Large blurred “dummy” color blobs */}
      <div className="absolute -left-[20%] -top-[10%] h-[min(42rem,90vw)] w-[min(42rem,90vw)] rounded-full bg-gradient-to-br from-[#2ed2c3]/35 via-[#5ee4d6]/20 to-transparent blur-[100px]" />
      <div className="absolute -right-[15%] top-[25%] h-[min(36rem,80vw)] w-[min(36rem,80vw)] rounded-full bg-gradient-to-bl from-violet-400/25 via-fuchsia-300/15 to-transparent blur-[90px]" />
      <div className="absolute -bottom-[20%] left-[20%] h-[min(32rem,75vw)] w-[min(32rem,75vw)] rounded-full bg-gradient-to-t from-cyan-400/20 via-[#2ed2c3]/12 to-transparent blur-[110px]" />
      <div className="absolute bottom-[10%] -right-[10%] h-[28rem] w-[28rem] rounded-full bg-amber-200/20 blur-[80px]" />
      {/* Extra radial washes */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 50% at 20% 40%, ${ACCENT}1f 0%, transparent 55%),
            radial-gradient(ellipse 60% 45% at 85% 65%, rgba(139, 92, 246, 0.12) 0%, transparent 50%)`,
        }}
      />
      {/* Geometric diagram layer — circles, triangles, squares (very light) */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.22] sm:opacity-[0.18]"
        viewBox="0 0 1400 700"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="none" stroke="#1fa99c" strokeWidth="1.15" strokeOpacity="0.55">
          <circle cx="120" cy="100" r="56" />
          <circle cx="1280" cy="160" r="72" />
          <circle cx="700" cy="580" r="44" />
          <polygon points="620,90 680,90 650,40" />
          <polygon points="180,520 250,480 250,560" />
          <polygon points="1180,480 1240,440 1240,520" />
          <rect
            x="980"
            y="320"
            width="64"
            height="64"
            rx="10"
            transform="rotate(22 1012 352)"
          />
          <rect
            x="320"
            y="240"
            width="48"
            height="48"
            rx="8"
            transform="rotate(-18 344 264)"
          />
          <line x1="0" y1="380" x2="400" y2="280" strokeDasharray="6 10" />
          <line x1="1000" y1="120" x2="1400" y2="220" strokeDasharray="6 10" />
        </g>
        <g fill="#2ed2c3" fillOpacity="0.07">
          <circle cx="450" cy="180" r="100" />
          <circle cx="1050" cy="420" r="130" />
        </g>
      </svg>
      {/* Fine dot texture */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(31, 169, 156, 0.22) 0.5px, transparent 0.6px)`,
          backgroundSize: "22px 22px",
        }}
      />
    </div>
  );
}

export function HappeningCities() {
  return (
    <section className="relative w-full overflow-hidden py-16 sm:py-20 lg:py-24">
      <SectionBackdrop />

      <div className="relative z-[1] w-full px-4 sm:px-5 md:px-8 lg:px-10 xl:px-14 2xl:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ color: "#1fa99c", backgroundColor: `${ACCENT}22` }}
          >
            Worldwide
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
            Happening Cities
          </h2>
          <p className="mt-3 text-base text-zinc-600 sm:text-lg">
            <span className="font-semibold text-zinc-800">12 cities</span>,{" "}
            <span className="font-semibold text-zinc-800">mixed order</span> (
            <span className="whitespace-nowrap">6 + 6</span> on desktop) across
            the USA, India, Canada, Australia, and Germany — every tile has a
            high-res photo background.
          </p>
        </div>

        <ul className="mt-10 grid w-full grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4 md:gap-5 lg:grid-cols-6">
          {cities.map((city) => (
            <li key={`${city.country}-${city.name}`}>
              <CityCard city={city} />
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center sm:mt-12">
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200/90 bg-white px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-700 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition hover:border-[#2ed2c3] hover:text-[#1fa99c]"
          >
            Explore all listings
          </Link>
        </div>
      </div>
    </section>
  );
}
