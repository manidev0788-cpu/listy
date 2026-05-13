import { redirect, notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions, isAdminEmail } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { EditListingForm } from "@/components/EditListingForm";

export const dynamic = "force-dynamic";

function isObjectIdString(id) {
  return typeof id === "string" && /^[a-f0-9]{24}$/i.test(id);
}

async function loadListing(id) {
  if (!isObjectIdString(id)) return null;

  try {
    const db = await getDb();
    const row = await db
      .collection("listings")
      .findOne({ _id: new ObjectId(id) });
    if (!row) return null;
    return {
      ...row,
      _id: row._id.toString(),
      createdAt: row.createdAt ? row.createdAt.toISOString() : null,
    };
  } catch (err) {
    console.error("[edit-listing] load error:", err?.message || err);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const listing = await loadListing(id);
  return {
    title: listing ? `Edit ${listing.name} | Listfy` : "Edit Listing | Listfy",
  };
}

export default async function EditListingPage({ params }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect(`/?auth=signin&next=/edit-listing/${encodeURIComponent(id)}`);
  }

  const listing = await loadListing(id);
  if (!listing) notFound();

  const sessionEmail = (session.user.email || "").toLowerCase();
  const ownerEmail = (listing.userId || "").toLowerCase();
  const isAdmin = isAdminEmail(session.user.email);
  const isOwner = ownerEmail === sessionEmail;

  if (!isOwner && !isAdmin) {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#f8f9fa] px-4 py-20">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-zinc-100">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <LockIcon />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-zinc-900">
            Access denied
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            You can only edit listings that you own.
          </p>
          <a
            href={`/listing/${encodeURIComponent(listing.slug || "")}`}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-[#2ed2c3] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Back to listing
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f9fa] py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#2ed2c3] shadow-sm ring-1 ring-zinc-200">
            Edit Listing
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl md:text-5xl">
            Update your business details
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-500 sm:text-base">
            Changes go live immediately across the directory.
          </p>
        </div>
        <EditListingForm
          id={listing._id}
          slug={listing.slug}
          initial={{
            name: listing.name || "",
            category: listing.category || "",
            address: listing.address || "",
            pincode: listing.pincode || "",
            city: listing.city || "",
            country: listing.country || "",
            services: listing.services || "",
            phone: listing.phone || "",
            email: listing.email || "",
            website: listing.website || "",
            description: listing.description || "",
            image: listing.image || "",
          }}
        />
      </div>
    </main>
  );
}

function LockIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="4"
        y="11"
        width="16"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 11V8a4 4 0 1 1 8 0v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
