import { cache } from "react";
import Link from "next/link";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { generateListingContent } from "@/lib/ai";
import { createSlug } from "@/lib/slug";
import { findSampleBySlug } from "@/lib/sampleListings";
import { findLocalListingBySlug } from "@/lib/localStore";
import { EnquiryForm } from "@/components/EnquiryForm";
import { OwnerActions } from "@/components/OwnerActions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const fetchListing = cache(async (slug) => {
  if (!slug || typeof slug !== "string") return null;

  const localRow = await findLocalListingBySlug(slug);
  if (localRow) return localRow;

  try {
    const db = await getDb();

    let row = await db.collection("listings").findOne({ slug });

    if (!row) {
      const candidates = await db
        .collection("listings")
        .find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: "" }] })
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

    if (!row) {
      const sample = findSampleBySlug(slug);
      if (sample) return sample;
      return null;
    }

    return {
      ...row,
      _id: row._id.toString(),
      createdAt: row.createdAt ? row.createdAt.toISOString() : null,
      aiGeneratedAt: row.aiGeneratedAt
        ? row.aiGeneratedAt.toISOString()
        : null,
    };
  } catch (err) {
    console.error(
      "[listing] DB unavailable, trying sample listings:",
      err?.message || err
    );
    const sample = findSampleBySlug(slug);
    return sample || null;
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

  if (listing.isSample || listing.isLocal) {
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

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const listing = await fetchListing(slug);
  if (!listing) return { title: "Listing not found | Listfy" };

  const ai = await getOrGenerateAi(listing);
  return {
    title: `${ai.title} | Listfy`,
    description: (ai.description || "").slice(0, 160),
    keywords: ai.keywords,
  };
}

export default async function ListingDetailPage({ params }) {
  const { slug } = await params;
  const listing = await fetchListing(slug);

  if (!listing) {
    return <NotFoundView />;
  }

  const session = await getServerSession(authOptions);
  const isOwner =
    !!session?.user?.email &&
    !!listing.userId &&
    session.user.email === listing.userId;

  const ai = await getOrGenerateAi(listing);
  const category = listing.category || "Business";
  const city = listing.city || "Your City";
  const subtitle = `${category} in ${city}`;
  const heroBg =
    listing.image ||
    "https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=1920&q=80";

  return (
    <main className="bg-[#f8f9fa]">
      <section
        className="relative w-full overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${heroBg}')` }}
      >
        <div aria-hidden className="absolute inset-0 bg-black/60" />
        <div className="relative mx-auto max-w-[1200px] px-4 py-20 text-center sm:px-6 sm:py-24 md:py-28 lg:px-8 lg:py-32">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2ed2c3]">
            {subtitle}
          </p>
          <h1 className="mx-auto mt-4 max-w-4xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            {ai.title}
          </h1>

          {isOwner && (
            <div className="mt-6 flex justify-center">
              <OwnerActions id={listing._id} name={listing.name} />
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-white/85">
            {listing.city && (
              <span className="inline-flex items-center gap-1.5">
                <PinIcon className="text-[#2ed2c3]" />
                {listing.city}
                {listing.country ? `, ${listing.country}` : ""}
              </span>
            )}
            {listing.phone && (
              <>
                <span aria-hidden className="h-3 w-px bg-white/30" />
                <a
                  href={`tel:${listing.phone}`}
                  className="inline-flex items-center gap-1.5 hover:text-white"
                >
                  <PhoneIcon className="text-[#2ed2c3]" />
                  {listing.phone}
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16 lg:grid lg:grid-cols-[1fr_380px] lg:gap-12 lg:px-8 lg:py-20">
        <div className="min-w-0">
          <section className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              About {listing.name}
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

          {listing.services && (
            <section className="mx-auto mt-12 max-w-4xl">
              <h3 className="text-xl font-semibold text-zinc-900">
                Services Offered
              </h3>
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
            <section className="mx-auto mt-12 max-w-4xl">
              <h3 className="text-xl font-semibold text-zinc-900">
                Related Topics
              </h3>
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

        <aside className="mt-10 flex flex-col gap-6 lg:mt-0">
          <div className="rounded-xl bg-white p-6 shadow-xl ring-1 ring-zinc-100">
            <h3 className="text-lg font-semibold text-zinc-900">
              Business Information
            </h3>

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
                  <span className="text-zinc-700">
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
                Call Now
              </a>
            )}
          </div>

          <EnquiryForm listingId={listing._id} businessName={listing.name} />
        </aside>
      </div>
    </main>
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
        <dd className="mt-0.5 truncate">{children}</dd>
      </div>
    </div>
  );
}

function NotFoundView() {
  return (
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#f8f9fa] px-4 py-20">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-zinc-100">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#2ed2c3]/10 text-[#2ed2c3]">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M9.5 9.5A2.5 2.5 0 0 1 12 8a2.5 2.5 0 0 1 .8 4.87c-.5.2-.8.65-.8 1.18V14m0 3v.01"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="mt-5 text-2xl font-bold text-zinc-900">Listing not found</h1>
        <p className="mt-2 text-sm text-zinc-500">
          We couldn&apos;t find the listing you&apos;re looking for. It may have
          been removed or the link is incorrect.
        </p>
        <Link
          href="/listings"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-[#2ed2c3] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Browse All Listings
        </Link>
      </div>
    </main>
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
