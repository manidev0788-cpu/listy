import Link from "next/link";

export const metadata = {
  title: "Blog | Listfy Directory Insights",
  description:
    "Tips for local SEO, listing quality, and growing your business with Listfy. Guides and updates from the directory team.",
  openGraph: {
    title: "Blog | Listfy",
    description: "Ideas and updates for local businesses and directory users.",
    type: "website",
  },
};

const POSTS = [
  {
    slug: "optimize-your-listing",
    title: "How to optimize your business listing for local search",
    excerpt:
      "Photos, categories, and consistent NAP data help customers trust your profile and improve discovery.",
    date: "Mar 12, 2026",
    read: "6 min read",
  },
  {
    slug: "choose-right-category",
    title: "Choosing the right category (and when to add a second)",
    excerpt:
      "Match how people search—avoid vague labels and pick the closest primary category first.",
    date: "Feb 28, 2026",
    read: "4 min read",
  },
  {
    slug: "mobile-first-listings",
    title: "Why mobile-first listings convert better",
    excerpt:
      "Most local searches happen on phones. Structure your description and CTAs for small screens.",
    date: "Feb 14, 2026",
    read: "5 min read",
  },
  {
    slug: "trust-signals",
    title: "Trust signals that make your directory profile stand out",
    excerpt:
      "Hours, response time, and verified contact details reduce friction for new customers.",
    date: "Jan 30, 2026",
    read: "7 min read",
  },
  {
    slug: "seasonal-promotions",
    title: "Running seasonal promotions without cluttering your listing",
    excerpt:
      "Short, dated offers in your description keep the page fresh without breaking SEO consistency.",
    date: "Jan 8, 2026",
    read: "3 min read",
  },
  {
    slug: "privacy-and-reviews",
    title: "Reviews, privacy, and what we display on Listfy",
    excerpt:
      "How we handle public business information and what owners can control in their dashboard.",
    date: "Dec 18, 2025",
    read: "8 min read",
  },
];

export default function BlogPage() {
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
              <li className="font-medium text-zinc-800">Blog</li>
            </ol>
          </nav>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Blog
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-600">
            Practical guides for owners and marketers using Listfy. Full
            articles are coming soon—cards below are static previews.
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post) => (
            <li key={post.slug}>
              <article
                id={post.slug}
                className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-[#2ed2c3]/40 hover:shadow-md scroll-mt-24"
              >
                <p className="text-xs font-medium text-zinc-500">
                  {post.date}
                  <span className="mx-2 text-zinc-300">·</span>
                  {post.read}
                </p>
                <h2 className="mt-3 text-lg font-bold text-zinc-900">
                  <Link
                    href={`/blog#${post.slug}`}
                    className="transition hover:text-[#1fa99c]"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog#${post.slug}`}
                  className="mt-4 inline-flex text-sm font-semibold text-[#1fa99c] hover:underline"
                >
                  Read more
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
