import { HydrationSafeLink as Link } from "@/components/HydrationSafeLink";
import { CategoriesDirectory } from "@/components/CategoriesDirectory";
import { CATEGORIES } from "@/lib/categories";

export const metadata = {
  title: "Browse Categories | Listfy Business Directory",
  description:
    "Explore every business category on Listfy—from automotive and dining to real estate and shopping. Open a category to see live listings.",
  openGraph: {
    title: "Categories | Listfy",
    description: "Find businesses by category on Listfy.",
    type: "website",
  },
};

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-[#f8faf9]">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <nav aria-label="Breadcrumb" className="text-sm text-zinc-500">
            <ol className="flex flex-wrap gap-2">
              <li>
                <Link href="/" className="hover:text-[#1fa99c]">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-zinc-800">Categories</li>
            </ol>
          </nav>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Business categories
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-600">
            Choose a category to browse verified-style listings, contact details,
            and local services in one place.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <CategoriesDirectory categories={CATEGORIES} />
      </div>
    </main>
  );
}
