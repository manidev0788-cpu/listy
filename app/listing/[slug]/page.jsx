import { cache } from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { HydrationSafeLink as Link } from "@/components/HydrationSafeLink";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { generateListingContent } from "@/lib/ai";
import { createSlug } from "@/lib/slug";
import { EnquiryForm } from "@/components/EnquiryForm";
import { OwnerActions } from "@/components/OwnerActions";
import { ListingCard } from "@/components/ListingCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=1920&q=80";

async function getRequestOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "";
  const proto =
    h.get("x-forwarded-proto") ||
    (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

function truncateMetaDescription(text, max = 158) {
  const t = String(text || "")
    .replace(/\s+/g, " ")
    .trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

function buildListingPathSegment(slug) {
  const s = String(slug || "").trim();
  return s ? `/listing/${s}` : "/listing";
}

function joinAddressParts(listing) {
  return [listing.address, listing.city, listing.country, listing.pincode]
    .filter((p) => typeof p === "string" && p.trim().length > 0)
    .map((p) => p.trim())
    .join(", ");
}

const loadListingBySlug = cache(async (slug) => {
  if (!slug || typeof slug !== "string") {
    return { status: "not_found" };
  }

  try {
    const db = await getDb();

    let row = await db.collection("listings").findOne({ slug });

    if (!row) {
      const candidates = await db
        .collection("listings")
        .find({
          $or: [{ slug: { $exists: false } }, { slug: null }, { slug: "" }],
        })
        .limit(500)
        .toArray();

      for (const c of candidates) {
        if (createSlug(c.name, c.city) === slug) {
          row = c;
          try {
            await db
              .collection("listings")
              .updateOne({ _id: c._id }, { $set: { slug } });
          } catch (err) {
            console.error("[listing] slug backfill error:", err);
          }
          break;
        }
      }
    }

    if (!row) return { status: "not_found" };

    return {
      status: "ok",
      listing: {
        ...row,
        _id: row._id.toString(),
        createdAt: row.createdAt ? row.createdAt.toISOString() : null,
        updatedAt: row.updatedAt ? row.updatedAt.toISOString() : null,
        aiGeneratedAt: row.aiGeneratedAt
          ? row.aiGeneratedAt.toISOString()
          : null,
      },
    };
  } catch (err) {
    console.error("[listing] DB error:", err?.message || err);
    return { status: "error" };
  }
});

const fetchSimilarListings = cache(async (listing) => {
  try {
    const db = await getDb();
    const clauses = [{ _id: { $ne: new ObjectId(listing._id) } }];

    if (listing.category) {
      clauses.push({ category: listing.category });
    }
    if (listing.city) {
      clauses.push({ city: listing.city });
    }

    const query = clauses.length > 1 ? { $and: clauses } : clauses[0];

    const rows = await db
      .collection("listings")
      .find(query)
      .sort({ createdAt: -1 })
      .limit(6)
      .toArray();

    return rows.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
      slug: doc.slug || createSlug(doc.name, doc.city),
      createdAt:
        doc.createdAt instanceof Date
          ? doc.createdAt.toISOString()
          : doc.createdAt,
    }));
  } catch (err) {
    console.error("[listing] similar fetch error:", err?.message || err);
    return [];
  }
});

const getOrGenerateAi = cache(async (listing) => {
  const hasCached =
    listing.aiTitle &&
    listing.aiDescription &&
    Array.isArray(listing.aiKeywords) &&
    listing.aiKeywords.length > 0;

  if (hasCached) {
    return {
      title: listing.aiTitle,
      description: listing.aiDescription,
      keywords: listing.aiKeywords,
      source: listing.aiSource || "cache",
    };
  }

  const ai = await generateListingContent(listing);

  if (!listing._id || !/^[a-f0-9]{24}$/i.test(String(listing._id))) {
    return ai;
  }

  try {
    const db = await getDb();
    await db.collection("listings").updateOne(
      { _id: new ObjectId(listing._id) },
      {
        $set: {
          aiTitle: ai.title,
          aiDescription: ai.description,
          aiKeywords: ai.keywords,
          aiSource: ai.source,
          aiGeneratedAt: new Date(),
        },
      }
    );
  } catch (err) {
    console.error("[listing] ai cache save error:", err);
  }

  return ai;
});

function buildLocalBusinessSchema({ listing, description, canonicalUrl }) {
  const addressLine = joinAddressParts(listing);
  const imageUrl =
    typeof listing.image === "string" && /^https?:\/\//i.test(listing.image)
      ? listing.image
      : undefined;

  const website =
    typeof listing.website === "string" && listing.website.trim()
      ? /^https?:\/\//i.test(listing.website)
        ? listing.website.trim()
        : `https://${listing.website.trim()}`
      : undefined;

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: listing.name || "Business",
    description: truncateMetaDescription(description, 500),
    url: canonicalUrl,
  };

  if (imageUrl) schema.image = [imageUrl];
  if (listing.phone) schema.telephone = listing.phone;
  if (website) schema.sameAs = [website];

  if (addressLine || listing.city || listing.country) {
    schema.address = {
      "@type": "PostalAddress",
      ...(listing.address ? { streetAddress: listing.address } : {}),
      ...(listing.city ? { addressLocality: listing.city } : {}),
      ...(listing.country ? { addressCountry: listing.country } : {}),
      ...(listing.pincode ? { postalCode: listing.pincode } : {}),
    };
  }

  return schema;
}

function buildBreadcrumbSchema(items, origin) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${origin}${item.path}`,
    })),
  };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const loaded = await loadListingBySlug(slug);

  if (loaded.status === "not_found") {
    return {
      title: "Listing not found | Listfy",
      description: "This listing could not be found.",
      robots: { index: false, follow: true },
    };
  }

  if (loaded.status === "error") {
    return {
      title: "Listfy",
      description: "We could not load this listing right now.",
      robots: { index: false, follow: true },
    };
  }

  const listing = loaded.listing;
  const ai = await getOrGenerateAi(listing);
  const origin = await getRequestOrigin();
  const path = buildListingPathSegment(slug);
  const canonical = `${origin}${path}`;

  const rawDesc =
    ai.description ||
    listing.description ||
    `${listing.name || "Business"} — ${listing.category || "Services"} in ${listing.city || "your area"}.`;
  const description = truncateMetaDescription(rawDesc);
  const pageTitle = `${ai.title} | Listfy`;

  const ogImage =
    typeof listing.image === "string" && /^https?:\/\//i.test(listing.image)
      ? listing.image
      : DEFAULT_HERO_IMAGE;

  return {
    title: pageTitle,
    description,
    keywords: Array.isArray(ai.keywords) ? ai.keywords : undefined,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      siteName: "Listfy",
      type: "website",
      locale: "en_US",
      images: [{ url: ogImage, width: 1200, height: 630, alt: listing.name || "Listing" }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [ogImage],
    },
  };
}

export default async function ListingDetailPage({ params }) {
  const { slug } = await params;
  const loaded = await loadListingBySlug(slug);

  if (loaded.status === "not_found") {
    notFound();
  }

  if (loaded.status === "error") {
    throw new Error("LISTING_LOAD_FAILED");
  }

  const listing = loaded.listing;
  const origin = await getRequestOrigin();
  const path = buildListingPathSegment(slug);
  const canonicalUrl = `${origin}${path}`;

  const [ai, similar] = await Promise.all([
    getOrGenerateAi(listing),
    fetchSimilarListings(listing),
  ]);

  const session = await getServerSession(authOptions);
  const isOwner =
    !!session?.user?.email &&
    !!listing.userId &&
    session.user.email.toLowerCase() === listing.userId.toLowerCase();

  const category = listing.category || "Business";
  const city = listing.city || "";
  const subtitle = city ? `${category} in ${city}` : category;
  const displayName = (listing.name || "").trim() || "Business listing";
  const heroImage =
    typeof listing.image === "string" && listing.image.length > 0
      ? listing.image
      : DEFAULT_HERO_IMAGE;
  const heroAlt = `${displayName}${city ? ` in ${city}` : ""} — ${category}`;

  const mapsQuery = joinAddressParts(listing);
  const mapsSearchUrl = mapsQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`
    : null;
  const mapsEmbedUrl = mapsQuery
    ? `https://www.google.com/maps?q=${encodeURIComponent(mapsQuery)}&output=embed`
    : null;

  const listingsBrowse = new URLSearchParams();
  if (listing.category) listingsBrowse.set("category", listing.category);
  if (listing.city) listingsBrowse.set("location", listing.city);
  const listingsQs = listingsBrowse.toString();
  const categoryBrowseHref = listingsQs ? `/listings?${listingsQs}` : "/listings";

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Listings", path: "/listings" },
    ...(listing.category
      ? [{ name: listing.category, path: categoryBrowseHref }]
      : []),
    { name: displayName, path },
  ];

  const localBusinessSchema = buildLocalBusinessSchema({
    listing,
    description: ai.description || listing.description || "",
    canonicalUrl,
  });

  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems, origin);

  const jsonLd = JSON.stringify([localBusinessSchema, breadcrumbSchema]);

  const showAiTagline =
    ai.title && displayName && ai.title.trim() !== displayName.trim();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <main className="bg-[#f8f9fa]">
        <nav
          className="border-b border-zinc-200 bg-white"
          aria-label="Breadcrumb"
        >
          <div className="mx-auto max-w-[1200px] px-4 py-3 sm:px-6 lg:px-8">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500 sm:text-sm">
              {breadcrumbItems.map((item, i) => {
                const isLast = i === breadcrumbItems.length - 1;
                return (
                  <li key={`${item.path}-${i}`} className="flex min-w-0 items-center gap-2">
                    {i > 0 && (
                      <span aria-hidden className="text-zinc-300">
                        /
                      </span>
                    )}
                    {isLast ? (
                      <span className="truncate font-medium text-zinc-800">
                        {item.name}
                      </span>
                    ) : (
                      <Link
                        href={item.path}
                        className="truncate transition-colors hover:text-[#1fa99c]"
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </nav>

        <section className="relative w-full min-h-[min(52vh,480px)] overflow-hidden">
          { /* eslint-disable-next-line @next/next/no-img-element */ }
          <img
            src={heroImage}
            alt={heroAlt}
            width={1920}
            height={1080}
            decoding="async"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-black/60" />
          <div className="relative mx-auto max-w-[1200px] px-4 py-16 text-center sm:px-6 sm:py-20 md:py-24 lg:px-8 lg:py-28">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2ed2c3]">
              {subtitle}
            </p>
            <h1 className="mx-auto mt-4 max-w-4xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {displayName}
            </h1>
            {showAiTagline && (
              <p className="mx-auto mt-3 max-w-3xl text-base leading-snug text-white/90 sm:text-lg md:text-xl">
                {ai.title}
              </p>
            )}

            {isOwner && (
              <div className="mt-6 flex justify-center">
                <OwnerActions id={listing._id} name={listing.name} />
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-white/85">
              {listing.city && (
                <span className="inline-flex min-w-0 items-center gap-1.5">
                  <PinIcon className="shrink-0 text-[#2ed2c3]" />
                  <span className="truncate">
                    {listing.city}
                    {listing.country ? `, ${listing.country}` : ""}
                  </span>
                </span>
              )}
              {listing.phone && (
                <>
                  <span aria-hidden className="h-3 w-px shrink-0 bg-white/30" />
                  <a
                    href={`tel:${listing.phone}`}
                    className="inline-flex min-w-0 items-center gap-1.5 hover:text-white"
                  >
                    <PhoneIcon className="shrink-0 text-[#2ed2c3]" />
                    <span className="truncate">{listing.phone}</span>
                  </a>
                </>
              )}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16 lg:grid lg:grid-cols-[1fr_380px] lg:gap-12 lg:px-8 lg:py-20">
          <div className="min-w-0">
            <section className="mx-auto max-w-4xl" aria-labelledby="about-heading">
              <h2
                id="about-heading"
                className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl"
              >
                About {displayName}
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-gray-700 sm:text-lg">
                {ai.description
                  .split(/\n{2,}|(?<=\.)\s{2,}/)
                  .filter(Boolean)
                  .map((para, i) => (
                    <p key={i}>{para.trim()}</p>
                  ))}
              </div>
            </section>

            {mapsEmbedUrl && (
              <section
                className="mx-auto mt-12 max-w-4xl"
                aria-labelledby="location-heading"
              >
                <h2
                  id="location-heading"
                  className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl"
                >
                  Location
                </h2>
                <p className="mt-2 text-sm text-zinc-600 sm:text-base">
                  {mapsQuery}
                </p>
                <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-zinc-100">
                  <div className="relative aspect-16/10 w-full min-h-[220px]">
                    <iframe
                      title={`Map showing ${displayName}`}
                      className="absolute inset-0 h-full w-full border-0"
                      src={mapsEmbedUrl}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </div>
                </div>
                {mapsSearchUrl && (
                  <a
                    href={mapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex text-sm font-semibold text-[#1fa99c] hover:text-[#2ed2c3]"
                  >
                    Open in Google Maps
                  </a>
                )}
              </section>
            )}

            {listing.services && (
              <section
                className="mx-auto mt-12 max-w-4xl"
                aria-labelledby="services-heading"
              >
                <h2
                  id="services-heading"
                  className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl"
                >
                  Services offered
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {listing.services
                    .split(/[,\n]/)
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((s) => (
                      <li
                        key={s}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200"
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-[#2ed2c3]"
                          aria-hidden
                        />
                        {s}
                      </li>
                    ))}
                </ul>
              </section>
            )}

            {Array.isArray(ai.keywords) && ai.keywords.length > 0 && (
              <section
                className="mx-auto mt-12 max-w-4xl"
                aria-labelledby="topics-heading"
              >
                <h2
                  id="topics-heading"
                  className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl"
                >
                  Related topics
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {ai.keywords.map((kw) => (
                    <li
                      key={kw}
                      className="rounded-full bg-[#2ed2c3]/10 px-3 py-1 text-sm text-[#2ed2c3]"
                    >
                      {kw}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {similar.length > 0 && (
              <section
                className="mx-auto mt-14 max-w-4xl lg:max-w-none"
                aria-labelledby="similar-heading"
              >
                <h2
                  id="similar-heading"
                  className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl"
                >
                  Similar listings
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  More {listing.category || "businesses"}
                  {listing.city ? ` in ${listing.city}` : ""}
                </p>
                <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {similar.map((item) => (
                    <li key={item._id}>
                      <ListingCard listing={item} />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {ai.source === "mock" && (
              <p className="mx-auto mt-10 max-w-4xl rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                Content on this page was generated locally (no{" "}
                <code className="rounded bg-amber-100 px-1 font-mono text-[11px]">
                  OPENAI_API_KEY
                </code>{" "}
                set). Add one to <code>.env.local</code> to enable live AI
                generation.
              </p>
            )}
          </div>

          <aside className="mt-10 flex min-w-0 flex-col gap-6 lg:mt-0">
            <div className="rounded-xl bg-white p-6 shadow-xl ring-1 ring-zinc-100">
              <h2 className="text-lg font-semibold text-zinc-900">
                Business information
              </h2>

              <dl className="mt-5 space-y-4 text-sm">
                <InfoRow label="Business" icon={<BuildingIcon />}>
                  <span className="font-semibold text-zinc-900">
                    {listing.name || "—"}
                  </span>
                </InfoRow>

                {listing.category && (
                  <InfoRow label="Category" icon={<TagIcon />}>
                    <span className="text-zinc-700">{listing.category}</span>
                  </InfoRow>
                )}

                {listing.city && (
                  <InfoRow label="Location" icon={<PinIcon />}>
                    <span className="whitespace-normal wrap-break-word text-zinc-700">
                      {listing.address ? `${listing.address}, ` : ""}
                      {listing.city}
                      {listing.country ? `, ${listing.country}` : ""}
                    </span>
                  </InfoRow>
                )}

                {listing.phone && (
                  <InfoRow label="Phone" icon={<PhoneIcon />}>
                    <a
                      href={`tel:${listing.phone}`}
                      className="text-zinc-700 hover:text-[#1fa99c]"
                    >
                      {listing.phone}
                    </a>
                  </InfoRow>
                )}

                {listing.email && (
                  <InfoRow label="Email" icon={<MailIcon />}>
                    <a
                      href={`mailto:${listing.email}`}
                      className="break-all text-zinc-700 hover:text-[#1fa99c]"
                    >
                      {listing.email}
                    </a>
                  </InfoRow>
                )}

                {listing.website && (
                  <InfoRow label="Website" icon={<GlobeIcon />}>
                    <a
                      href={
                        /^https?:\/\//.test(listing.website)
                          ? listing.website
                          : `https://${listing.website}`
                      }
                      target="_blank"
                      rel="noreferrer noopener"
                      className="break-all text-zinc-700 hover:text-[#1fa99c]"
                    >
                      {listing.website}
                    </a>
                  </InfoRow>
                )}
              </dl>

              {listing.phone && (
                <a
                  href={`tel:${listing.phone}`}
                  className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#2ed2c3] text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <PhoneIcon />
                  Call now
                </a>
              )}
            </div>

            <EnquiryForm listingId={listing._id} businessName={listing.name} />
          </aside>
        </div>
      </main>
    </>
  );
}

function InfoRow({ label, icon, children }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2ed2c3]/10 text-[#2ed2c3]">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <dt className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
          {label}
        </dt>
        <dd className="mt-0.5">{children}</dd>
      </div>
    </div>
  );
}

function PinIcon({ className = "" }) {
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
        d="M12 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0-5a8 8 0 0 0-8 8c0 5.25 8 13 8 13s8-7.75 8-13a8 8 0 0 0-8-8Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function PhoneIcon({ className = "" }) {
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
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m3 7 9 6 9-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BuildingIcon() {
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
        d="M4 21V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14M16 10h2a2 2 0 0 1 2 2v9M4 21h16M9 9h2M9 13h2M9 17h2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
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
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" />
    </svg>
  );
}
