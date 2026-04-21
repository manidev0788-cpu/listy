import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Automotive",
    ads: 7,
    icon: "/images/icon-02.svg",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80",
    href: "/category/automotive",
  },
  {
    name: "Beauty & Spa",
    ads: 1,
    icon: "/images/icon-03.svg",
    image:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=600&q=80",
    href: "/category/beauty-spa",
  },
  {
    name: "Hotel",
    ads: 1,
    icon: "/images/icon-04.svg",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
    href: "/category/hotel",
  },
  {
    name: "Real Estate",
    ads: 1,
    icon: "/images/icon-05.svg",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80",
    href: "/category/real-estate",
  },
  {
    name: "Restaurant",
    ads: 1,
    icon: "/images/icon-06.svg",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    href: "/category/restaurant",
  },
  {
    name: "Shopping",
    ads: 1,
    icon: "/images/icon-07.svg",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    href: "/category/shopping",
  },
];

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

export function Categories() {
  return (
    <section className="bg-[#f6f7f8] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Our Top Categories
          </h2>
          <p className="mt-2 text-sm text-zinc-500 sm:text-base">
            Explore the most popular categories on Listfy
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-5 sm:mt-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((cat) => (
            <li key={cat.name}>
              <Link
                href={cat.href}
                className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(0,0,0,0.10)]"
              >
                <div className="relative h-28 w-full overflow-hidden bg-zinc-100">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url('${cat.image}')` }}
                    aria-hidden
                  />
                  <div
                    className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent"
                    aria-hidden
                  />
                  <span className="absolute bottom-0 left-1/2 flex h-12 w-12 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.12)] ring-1 ring-zinc-100">
                    <Image
                      src={cat.icon}
                      alt=""
                      width={36}
                      height={36}
                      className="h-9 w-9 object-contain"
                    />
                  </span>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center gap-1.5 px-3 pb-5 pt-8 text-center">
                  <span className="text-[15px] font-semibold text-zinc-800">
                    {cat.name}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                    {cat.ads} {cat.ads === 1 ? "Ad" : "Ads"}
                    <ChevronDown className="text-zinc-400" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 rounded border border-zinc-200 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-700 shadow-sm transition-colors hover:border-zinc-300 hover:text-zinc-900"
          >
            <DoubleChevronDown className="text-zinc-500" />
            View More
          </Link>
        </div>
      </div>
    </section>
  );
}
