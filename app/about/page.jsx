import Image from "next/image";
import Link from "next/link";

const ACCENT = "#2ed2c3";

export const metadata = {
  title: "About Us | Listfy Local Business Directory",
  description:
    "Discover Listfy’s mission to help local businesses get found online. Learn who we are, what we offer, and read owner testimonials about our business directory platform.",
  keywords: [
    "about Listfy",
    "business directory",
    "local business listings",
    "list your business",
    "local search",
  ],
  openGraph: {
    title: "About Us | Listfy",
    description:
      "Listfy connects customers with trusted local businesses through clear listings, categories, and city search.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Listfy",
    description:
      "Learn how Listfy helps businesses get discovered and what owners say about our directory.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://listfy.com/about",
      name: "About Listfy",
      description:
        "About Listfy local business directory: mission, platform overview, and testimonials from business owners.",
      isPartOf: { "@type": "WebSite", name: "Listfy" },
    },
    {
      "@type": "Organization",
      name: "Listfy",
      description:
        "Listfy is a business directory platform for local listings, categories, and city-based search.",
      url: "https://listfy.com",
    },
  ],
};

const IMG = {
  hero: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=85",
  mission: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=85",
  workspace: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85",
  community: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-[#f4f7f6]">
        {/* Hero with photo */}
        <header className="relative min-h-[320px] overflow-hidden sm:min-h-[380px] lg:min-h-[420px]">
          <Image
            src={IMG.hero}
            alt="Team collaborating around a laptop in a bright office"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30"
            aria-hidden
          />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 20%, ${ACCENT}55 0%, transparent 50%)`,
            }}
            aria-hidden
          />
          <div className="relative z-10 flex min-h-[320px] flex-col justify-end px-4 pb-12 pt-24 sm:min-h-[380px] sm:px-6 sm:pb-14 lg:min-h-[420px] lg:px-8 lg:pb-16">
            <div className="mx-auto w-full max-w-4xl text-center">
              <nav aria-label="Breadcrumb" className="mb-5">
                <ol className="flex flex-wrap items-center justify-center gap-2 text-sm text-white/80">
                  <li>
                    <Link href="/" className="transition hover:text-white">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden className="text-white/50">
                    /
                  </li>
                  <li className="font-medium text-white">About Us</li>
                </ol>
              </nav>
              <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm sm:text-4xl lg:text-5xl">
                About Listfy
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
                We help people find great local businesses—and help owners get
                discovered without a complicated setup.
              </p>
            </div>
          </div>
        </header>

        <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          {/* Mission + image */}
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="relative order-2 lg:order-1">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.12)] ring-1 ring-black/5 lg:aspect-[5/4]">
                <Image
                  src={IMG.mission}
                  alt="Business professionals reviewing strategy together"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div
                className="absolute -bottom-4 -right-4 hidden h-24 w-24 overflow-hidden rounded-xl border-4 border-[#f4f7f6] shadow-lg sm:block lg:-right-6"
                aria-hidden
              >
                <Image
                  src={IMG.workspace}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            </div>

            <div className="order-1 rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm sm:p-8 lg:order-2 lg:p-10">
              <span
                className="inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
                style={{ color: "#1fa99c", backgroundColor: `${ACCENT}22` }}
              >
                Our mission
              </span>
              <h2 className="mt-4 text-2xl font-bold text-zinc-900 sm:text-3xl">
                Local discovery, made simple
              </h2>
              <div className="mt-5 space-y-4 text-[0.95rem] leading-relaxed text-zinc-600 sm:text-base">
                <p>
                  Listfy is a modern{" "}
                  <strong className="font-semibold text-zinc-800">
                    business directory
                  </strong>{" "}
                  for discovering trusted local services—restaurants, hotels,
                  home professionals, retailers, and more. Clear listings,
                  categories, and city search help owners get found without
                  complex tools.
                </p>
                <p>
                  We believe every small business deserves a professional online
                  presence. Publish photos, contact details, and service areas in
                  minutes; visitors browse by category, city, and keywords to
                  compare and choose with confidence.
                </p>
                <p>
                  We ship steady improvements to search, mobile layouts, and
                  editing tools based on owner and user feedback. Listfy focuses
                  on transparent, useful{" "}
                  <strong className="font-semibold text-zinc-800">
                    local results
                  </strong>{" "}
                  for shoppers and a readable profile for businesses.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-8 rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm sm:mt-16 sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
            <section aria-labelledby="vision-heading" className="space-y-4">
              <span
                className="inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
                style={{ color: "#1fa99c", backgroundColor: `${ACCENT}22` }}
              >
                Our vision
              </span>
              <h2
                id="vision-heading"
                className="text-xl font-bold text-zinc-900 sm:text-2xl"
              >
                A trusted map of every neighborhood economy
              </h2>
              <p className="text-[0.95rem] leading-relaxed text-zinc-600 sm:text-base">
                We envision a directory where accuracy, accessibility, and fair
                visibility come first—so independent shops and professional
                services can compete on merit, not ad spend alone. Listfy should
                feel as reliable as asking a neighbor for a recommendation.
              </p>
            </section>
            <section aria-labelledby="company-heading" className="space-y-4">
              <span
                className="inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
                style={{ color: "#1fa99c", backgroundColor: `${ACCENT}22` }}
              >
                Company
              </span>
              <h2
                id="company-heading"
                className="text-xl font-bold text-zinc-900 sm:text-2xl"
              >
                Listfy Inc.
              </h2>
              <dl className="space-y-3 text-sm text-zinc-600 sm:text-[0.95rem]">
                <div>
                  <dt className="font-semibold text-zinc-800">Headquarters</dt>
                  <dd className="mt-1">
                    221B Baker Street, Suite 4A
                    <br />
                    New York, NY 10001, United States
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-zinc-800">Support</dt>
                  <dd className="mt-1">
                    <a
                      href="mailto:hello@listfy.com"
                      className="text-[#1fa99c] hover:underline"
                    >
                      hello@listfy.com
                    </a>
                    <span className="text-zinc-400"> · </span>
                    <a
                      href="tel:+11234567890"
                      className="text-[#1fa99c] hover:underline"
                    >
                      +1 (123) 456-7890
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-zinc-800">Product focus</dt>
                  <dd className="mt-1">
                    Local business discovery, owner dashboards, and category-based
                    search across cities worldwide.
                  </dd>
                </div>
              </dl>
            </section>
          </div>

          {/* Full-width image band */}
          <div className="relative mt-14 overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5 sm:mt-20">
            <div className="relative aspect-[21/9] min-h-[180px] sm:min-h-[220px] lg:aspect-[3/1]">
              <Image
                src={IMG.community}
                alt="Welcoming restaurant interior representing local business"
                fill
                className="object-cover"
                sizes="(max-width: 1152px) 100vw, 1152px"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
              <div className="absolute inset-y-0 left-0 flex max-w-md flex-col justify-center px-6 sm:px-10 lg:px-12">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2ed2c3]">
                  Built for your city
                </p>
                <p className="mt-2 text-lg font-semibold text-white sm:text-xl">
                  From corner cafés to professional services—your listing
                  belongs here.
                </p>
              </div>
            </div>
          </div>

          <section
            className="mt-14 sm:mt-20"
            aria-labelledby="testimonials-heading"
          >
            <h2
              id="testimonials-heading"
              className="text-center text-xl font-bold text-zinc-900 sm:text-2xl"
            >
              What business owners say
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-zinc-600 sm:text-base">
              Sample feedback from businesses using our directory.
            </p>
            <ul className="mt-8 grid gap-5 md:grid-cols-3">
              <li className="flex flex-col rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-[#2ed2c3]/30">
                    <Image
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&h=96&q=80"
                      alt=""
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">
                      Marcus T.
                    </p>
                    <p className="text-xs text-zinc-500">Café owner</p>
                  </div>
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-zinc-700">
                  <p>
                    “Neighborhood search brought new regulars—we finally look
                    credible online.”
                  </p>
                </blockquote>
              </li>
              <li className="flex flex-col rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-[#2ed2c3]/30">
                    <Image
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&h=96&q=80"
                      alt=""
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">
                      Sarah L.
                    </p>
                    <p className="text-xs text-zinc-500">Boutique retail</p>
                  </div>
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-zinc-700">
                  <p>
                    “Hours and photos update in minutes; built for busy owners.”
                  </p>
                </blockquote>
              </li>
              <li className="flex flex-col rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-[#2ed2c3]/30">
                    <Image
                      src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=96&h=96&q=80"
                      alt=""
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">
                      Dr. A. Yusuf
                    </p>
                    <p className="text-xs text-zinc-500">Health clinic</p>
                  </div>
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-zinc-700">
                  <p>
                    “Clients found us in one search—clean layout, no clutter.”
                  </p>
                </blockquote>
              </li>
            </ul>
          </section>

          <div className="relative mt-12 overflow-hidden rounded-2xl sm:mt-16">
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1400&q=80"
                alt=""
                fill
                className="object-cover opacity-40"
                sizes="100vw"
              />
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#2ed2c3]/90 via-[#2ed2c3]/85 to-[#1fa99c]/90"
                aria-hidden
              />
            </div>
            <div className="relative px-6 py-12 text-center sm:px-10 sm:py-14">
              <p className="text-lg font-semibold text-white sm:text-xl">
                Ready to list your business or explore the directory?
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/add-listing"
                  className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-zinc-800"
                >
                  Add listing
                </Link>
                <Link
                  href="/listings"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-white/90 bg-white/10 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  Browse listings
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
