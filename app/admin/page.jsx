import { HydrationSafeLink as Link } from "@/components/HydrationSafeLink";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions, isAdminEmail } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { AdminListingsTable } from "@/components/AdminListingsTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Admin Dashboard | Listfy",
  description: "Manage all business listings",
};

async function loadAllListings() {
  try {
    const db = await getDb();
    const rows = await db
      .collection("listings")
      .find({})
      .sort({ createdAt: -1 })
      .limit(500)
      .toArray();

    const listings = rows.map((l) => ({
      ...l,
      _id: l._id.toString(),
      source: "db",
      createdAt: l.createdAt ? l.createdAt.toISOString() : null,
    }));

    return { listings, offline: false };
  } catch (err) {
    console.error("[admin] DB unavailable:", err?.message || err);
    return { listings: [], offline: true };
  }
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/?auth=signin&next=/admin");
  }

  if (!isAdminEmail(session.user.email)) {
    return <AccessDenied email={session.user.email} />;
  }

  const { listings, offline } = await loadAllListings();

  const totalListings = listings.length;
  const uniqueOwners = new Set(
    listings.map((l) => l.userId).filter(Boolean)
  ).size;
  const uniqueCities = new Set(
    listings.map((l) => l.city).filter(Boolean)
  ).size;

  return (
    <main className="min-h-screen min-w-0 bg-[#f8f9fa]">
      <div className="mx-auto max-w-7xl min-w-0 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex min-w-0 flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1fa99c] shadow-sm ring-1 ring-zinc-200">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[#2ed2c3]"
                aria-hidden
              />
              Admin
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Manage all business listings
            </p>
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <Link
              href="/listings"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 shadow-sm transition-colors duration-200 hover:border-zinc-300 hover:text-zinc-900"
            >
              View site
            </Link>
            <Link
              href="/add-listing"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#2ed2c3] px-5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#1fa99c]"
            >
              + New Listing
            </Link>
          </div>
        </div>

        {offline && (
          <div
            role="status"
            className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          >
            Could not load listings — the database is temporarily unavailable.
            Please try again shortly.
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Total Listings"
            value={totalListings}
            icon={<ListIcon />}
            accent
          />
          <StatCard
            label="Unique Owners"
            value={uniqueOwners}
            icon={<UsersIcon />}
          />
          <StatCard
            label="Cities Covered"
            value={uniqueCities}
            icon={<PinIcon />}
          />
        </div>

        <AdminListingsTable initialListings={listings} />
      </div>
    </main>
  );
}

function StatCard({ label, value, icon, accent = false }) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-zinc-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
          accent
            ? "bg-[#2ed2c3]/10 text-[#2ed2c3]"
            : "bg-zinc-100 text-zinc-700"
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {label}
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-zinc-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function AccessDenied({ email }) {
  return (
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#f8f9fa] px-4 py-20">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-zinc-100">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500">
          <LockIcon />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-zinc-900">Access Denied</h1>
        <p className="mt-2 text-sm text-zinc-500">
          You must be signed in as an administrator to view this page.
        </p>
        <p className="mt-1 text-xs text-zinc-400">
          Signed in as <span className="font-medium">{email}</span>
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-[#2ed2c3] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}

function ListIcon() {
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
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UsersIcon() {
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
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinIcon() {
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
        d="M12 21s-8-7.75-8-13a8 8 0 1 1 16 0c0 5.25-8 13-8 13Zm0-10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
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
