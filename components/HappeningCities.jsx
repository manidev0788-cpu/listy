import Link from "next/link";

const cities = [
  {
    name: "Las Vegas",
    slug: "las-vegas",
    image:
      "https://images.unsplash.com/photo-1581351721010-8cf859cb14a4?auto=format&fit=crop&w=800&q=80",
    fallback: "from-[#2ed2c3] to-zinc-900",
    listings: ["Bellagio Fountains", "The Strip Bistro"],
  },
  {
    name: "Los Angeles",
    slug: "los-angeles",
    image:
      "https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=800&q=80",
    fallback: "from-[#2ed2c3] to-zinc-900",
    listings: ["Venice Beach Cafe", "Hollywood Diner", "Sunset Boulevard Hotel"],
  },
  {
    name: "New York",
    slug: "new-york",
    image:
      "https://images.unsplash.com/photo-1496588152823-86ff7695e68f?auto=format&fit=crop&w=800&q=80",
    fallback: "from-zinc-700 to-zinc-900",
    listings: [
      "Central Park Bistro",
      "Brooklyn Pizzeria",
      "Midtown Coworking",
      "Soho Gallery",
    ],
  },
  {
    name: "Oklahoma City",
    slug: "oklahoma-city",
    image:
      "https://images.unsplash.com/photo-1605152276897-4f618f831968?auto=format&fit=crop&w=800&q=80",
    fallback: "from-[#2ed2c3] to-zinc-900",
    listings: ["Bricktown Grill", "Boathouse District"],
  },
  {
    name: "Philadelphia",
    slug: "philadelphia",
    image:
      "https://images.unsplash.com/photo-1567942712661-82b9b407abbf?auto=format&fit=crop&w=800&q=80",
    fallback: "from-[#1fa99c] to-black",
    listings: ["Reading Terminal Market", "Liberty Brew House"],
  },
  {
    name: "San Antonio",
    slug: "san-antonio",
    image:
      "https://images.unsplash.com/photo-1531218614045-d85ed83ff49d?auto=format&fit=crop&w=800&q=80",
    fallback: "from-[#2ed2c3] to-black",
    listings: ["River Walk Lounge", "Alamo Coffee Roasters"],
  },
  {
    name: "San Francisco",
    slug: "san-francisco",
    image:
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80",
    fallback: "from-zinc-700 to-zinc-900",
    listings: [
      "Pier 39 Seafood",
      "Mission Burrito Bar",
      "Castro Co-Working",
    ],
  },
  {
    name: "Washington",
    slug: "washington",
    image:
      "https://images.unsplash.com/photo-1501466044931-62695aada8e9?auto=format&fit=crop&w=800&q=80",
    fallback: "from-[#1fa99c] to-zinc-900",
    listings: ["Capitol Hill Diner", "Georgetown Loft"],
  },
];

function CityCard({ city }) {
  const listingCount = city.listings.length;

  return (
    <Link
      href={`/city/${city.slug}`}
      className="group relative block aspect-4/3 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ed2c3] focus-visible:ring-offset-2"
    >
      <div
        className={`absolute inset-0 bg-linear-to-br ${city.fallback}`}
        aria-hidden
      />

      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-110"
        style={{ backgroundImage: `url('${city.image}')` }}
        aria-hidden
      />

      <div
        className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-0"
        aria-hidden
      />

      <div
        className="absolute inset-0 bg-black/65 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />

      <div className="absolute inset-x-0 bottom-0 p-4 transition-all duration-300 group-hover:translate-y-2 group-hover:opacity-0 sm:p-5">
        <h3 className="text-base font-semibold text-white drop-shadow sm:text-lg">
          {city.name}
        </h3>
        <p className="mt-1 text-xs text-white/85">
          {listingCount} {listingCount === 1 ? "Listing" : "Listings"}
        </p>
      </div>

      <div className="absolute inset-0 flex translate-y-3 flex-col justify-center px-5 py-4 text-white opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-lg font-semibold drop-shadow">{city.name}</h3>
          <span className="inline-flex items-center rounded-full bg-[#2ed2c3] px-2.5 py-0.5 text-[11px] font-semibold text-white">
            {listingCount} {listingCount === 1 ? "Listing" : "Listings"}
          </span>
        </div>
        <ul className="mt-3 space-y-1.5 text-sm text-white/90">
          {city.listings.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span
                className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#2ed2c3]"
                aria-hidden
              />
              <span className="truncate">{item}</span>
            </li>
          ))}
        </ul>
        <span className="mt-4 inline-flex w-fit items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#2ed2c3]">
          View all
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

export function HappeningCities() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Happening Cities
          </h2>
          <p className="mt-2 text-sm text-zinc-500 sm:text-base">
            Cities You Must Explore This Summer
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((city) => (
            <li key={city.slug}>
              <CityCard city={city} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
